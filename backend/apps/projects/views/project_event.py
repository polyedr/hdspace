import os
import zipfile
from io import BytesIO

from django.views.generic.base import View
from django.urls import reverse
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from django.conf import settings

from apps.core.utils import render_body
# from apps.threads.models import Thread, UserThread
from apps.projects.forms import ProjectInvitationForm
from apps.projects.models import (
    Project, ProjectScreen, ProjectInvitation,
    ProjectMember, ProjectActivity
)
from apps.projects.utils import emails
from apps.accounts.models import User


__all__ = (
    "ProjectInviteView",
    "AcceptDeclineInvitationView",
    "DeleteChatMemberView",
    "DownloadProjectView",
    "UserInviteView",
    "EditMemberRoleView",
)


class DownloadProjectView(LoginRequiredMixin, View):

    def get(self, request, *args, **kwargs):
        project_id = kwargs.pop("pk")
        project = Project.objects.get(pk=project_id)
        screens = ProjectScreen.objects.filter(project=project)
        if project.status == "paid":
            filenames = []
            for screen in screens:
                file_path = screen.image.file.name
                if os.path.exists(screen.image.file.name):
                    filenames.append(file_path)
            zip_subdir = project.name
            zip_filename = f'{zip_subdir}.zip'

            index_html = render_body("projects/download.html", {"project": project}, settings.DOWNLOAD_BASE_TEMPLATE)
            index_page = zip_subdir + ".html"
            index_file = open(index_page, "w")
            index_file.write(index_html)
            index_file.close()
            filenames.append(index_page)
            filenames.append("static/js/jquery-3.1.1.min.js")

            s = BytesIO()

            zf = zipfile.ZipFile(s, "w")

            for fpath in filenames:
                fdir, fname = os.path.split(fpath)
                zip_path = os.path.join(zip_subdir, fname)
                zf.write(fpath, zip_path)

            zf.close()
            os.remove(index_page)
            resp = HttpResponse(s.getvalue(), content_type='text/plain')
            resp['Content-Disposition'] = 'attachment; filename=%s' % zip_filename

            return resp

        else:
            messages.error(request, "Invalid Project.")
            return HttpResponseRedirect(reverse("projects:dashboard"))


class ProjectInviteView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request, *args, **kwargs):
        form = ProjectInvitationForm(data=request.POST)
        project_id = kwargs.pop("pk")
        if form.is_valid():
            data = form.cleaned_data
            project = Project.objects.get(pk=project_id)
            invitation_data = dict(
                project=project,
                is_active=False,
                email=data["email"],
                role=data["role"],
                invitation_token=ProjectInvitation.generate_token(),
                user=None,
            )
            user = User.objects.filter(email=data["email"]).first()
            if user is not None:
                invitation_data["user"] = user

            project_member = ProjectInvitation.objects.filter(email=data["email"], project=project).first()
            if project_member is not None:
                return JsonResponse({
                    "msg": "User with this email already has been invited to this project"
                }, status=400)
            else:
                invite = ProjectInvitation.objects.create(**invitation_data)
                ProjectActivity.objects.create(
                    type=ProjectActivity.USER_INVITED,
                    member=request.user,
                    project=project,
                )
                emails.invitation_email(
                    email=data["email"],
                    project=project,
                    accept_path=reverse("projects:accept_decline",
                                        kwargs={"invitation_token": invite.invitation_token, "status": "accept"}),
                    descline_path=reverse("projects:accept_decline",
                                          kwargs={"invitation_token": invite.invitation_token, "status": "decline"}),
                )
                return JsonResponse({"msg": "User has been successfully invited."})
        else:
            return JsonResponse({"msg": "Invalid invitation Email."}, status=400)


class AcceptDeclineInvitationView(View):

    # noinspection PyMethodMayBeStatic
    def get(self, request, *args, **kwargs):
        token = kwargs.pop("invitation_token")
        status = kwargs.pop("status")
        try:
            invitation = ProjectInvitation.objects.get(invitation_token=token)
            if status == "accept":
                if invitation.user_id is not None:
                    member = ProjectMember.objects.create(
                        role=invitation.role,
                        project=invitation.project,
                        user=invitation.user,
                    )

                    # thread = Thread.objects.get(project=invitation.project)
                    # UserThread.objects.create(
                    #     thread=thread,
                    #     user=member,
                    # )
                    invitation.delete()
                else:
                    invitation.is_active = True
                    invitation.save()
            else:
                emails.invitation_decline_email(
                    email=invitation.email,
                    name=invitation.project.name,
                )
                invitation.delete()
        except ProjectMember.DoesNotExist:
            pass
        return HttpResponseRedirect(reverse("accounts:registration"))


class DeleteChatMemberView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request, *args, **kwargs):
        member_id = request.POST["memberId"]
        ProjectMember.objects.filter(pk=member_id).delete()
        return JsonResponse({"msg": "Member has been deleted successfully."})


class UserInviteView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request):
        user_id = request.POST["userId"]
        project_id = request.POST["projectId"]
        user = User.objects.get(pk=user_id)
        project = Project.objects.get(pk=project_id)
        member = ProjectMember.objects.filter(project=project, user=user).first()
        if member is not None:
            return JsonResponse({
                "msg": "User with this email already project member."
            }, status=400)

        invitation_data = dict(
            project=project,
            is_active=False,
            email=user.email,
            role=user.profile.role,
            invitation_token=ProjectInvitation.generate_token(),
            user=user,
        )

        project_member = ProjectInvitation.objects.filter(email=user.email, project=project).first()
        if project_member is not None:
            return JsonResponse({
                "msg": "User with this email already has been invited to this project"
            }, status=400)
        else:
            invite = ProjectInvitation.objects.create(**invitation_data)
            ProjectActivity.objects.create(
                type=ProjectActivity.USER_INVITED,
                member=request.user,
                project=project,
            )
            emails.invitation_email(
                email=user.email,
                project=project,
                accept_path=reverse("projects:accept_decline",
                                    kwargs={"invitation_token": invite.invitation_token, "status": "accept"}),
                descline_path=reverse("projects:accept_decline",
                                      kwargs={"invitation_token": invite.invitation_token, "status": "decline"}),
            )
            return JsonResponse({"msg": "User has been successfully invited."})


class EditMemberRoleView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request, *args, **kwargs):
        role = request.POST["role"]
        member = request.POST["authorId"]
        ProjectMember.objects.filter(pk=member).update(role=role)

        return JsonResponse({})
