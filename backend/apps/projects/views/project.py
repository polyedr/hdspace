from urllib.parse import quote_plus
from django.views.generic.base import View
from django.views.generic import TemplateView
from django.db.models import Q, Count
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect

from apps.payments.cart import Cart
from apps.core.views.seo import SEOViewMixin
from apps.core.utils import build_absolute_url
from apps.threads.models import Thread, UserThread, Message
from apps.projects.forms import (
    CreateProjectForm, ScreenUploadForm, ProjectInvitationForm,
    AddTaskForm, ScreenEventForm
)

from apps.accounts.forms import SearchUserForm
from apps.projects.models import (
    Project, ProjectScreen, ScreenEvent, ScreenComment,
    ProjectMember, ProjectTask, ProjectActivity
)
from apps.accounts.models import Profile
from apps.projects.utils.project_db_synchronization import create_project_data_db, delete_project_data_db, select_project

__all__ = (
    "DashboardView",
    "CreateProjectView",
    "ProjectView",
    "DeleteProjectView",
    "ProjectPreviewView",
)


class DashboardView(LoginRequiredMixin, SEOViewMixin, TemplateView):
    template_name = "projects/dashboard.html"
    page_title = "Projects"

    def get(self, request, *args, **kwargs):
        print('Running DAshboard')
        context = self.get_context_data()
        projects = Project.objects.annotate(number_of_screens=Count('projectscreen')).filter(
            Q(user=request.user) |
            Q(members__projectmember__user__exact=request.user))
        cart = Cart(request)
        context["cart"] = cart.cart
        context["projects"] = projects
        if "form" not in kwargs:
            context["form"] = CreateProjectForm()

        return self.render_to_response(context)

    def post(self, request, *args, **kwargs):
        select_project(request.user, request.POST['project'])
        return redirect('/index/', code=302)


class CreateProjectView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request, *args, **kwargs):
        form = CreateProjectForm(data=request.POST)
        if form.is_valid():
            project = Project.objects.create(
                name=form.cleaned_data["name"],
                user=request.user,
                preview=Project.generate_preview_token(),
            )
            member = ProjectMember.objects.create(
                role=request.user.profile.role,
                status=ProjectMember.STATUS_CREATOR,
                project=project,
                user=request.user,
            )

            thread = Thread.objects.create(
                project=project
            )
            UserThread.objects.create(
                thread=thread,
                user=member,
            )
            new_message = f'Project Management chat for {project.name}'
            Message.objects.create(
                thread=thread,
                sender=member,
                content=new_message,
            )
            print('Project')
            create_project_data_db(project.name, project.id, request.user)
            print('Project created')

            return JsonResponse({
                "msg": "Your project has been created successfully.",
                "pk": project.id,
                "name": project.name,
                "project_url": project.get_project_url(),
            })
        else:
            return JsonResponse({
                "msg": "Wrong project name."
            })


class ProjectView(LoginRequiredMixin, TemplateView):
    template_name = "projects/project.html"

    def get(self, request, *args, **kwargs):
        context = self.get_context_data()
        project = kwargs.pop("pk")
        context["screens"] = ProjectScreen.objects.filter(project=project)
        if "form" not in kwargs:
            context["form"] = ScreenUploadForm()
            context["invite_form"] = ProjectInvitationForm()
            context["add_task_form"] = AddTaskForm(project)
            context["project"] = Project.objects.get(pk=project)
            context["user_roles"] = [role[0] for role in Profile.USER_ROLE]
            context["in_hold_screens"] = ProjectScreen.objects.filter(status=ProjectScreen.SCREEN_ON_HOLD)
            context["in_progress_screens"] = ProjectScreen.objects.filter(status=ProjectScreen.SCREEN_IN_PROGRESS)
            context["in_review_screens"] = ProjectScreen.objects.filter(status=ProjectScreen.SCREEN_REVIEW)
            context["approved_screens"] = ProjectScreen.objects.filter(status=ProjectScreen.SCREEN_APPROVED)
            context["project_members"] = ProjectMember.objects.filter(project=context["project"])
            context["tasks"] = ProjectTask.objects.filter(project=context["project"])
            context["project_member_user"] = ProjectMember.objects.get(user=request.user, project=project)
            context["thread"] = Thread.ordered(Thread.inbox(context["project_member_user"], project))[0]
            context["projects"] = Project.objects.filter(user=request.user)
            context["search_user_form"] = SearchUserForm()
            context["activities"] = ProjectActivity.objects.filter(project=project).order_by('-created')
            context["screen_form"] = ScreenEventForm()
            context["project_name"] = quote_plus(context["project"].name)
            if context["screens"]:
                context["screen_events"] = ScreenEvent.objects.filter(screen=context["screens"][0])
                context["screen_comments"] = ScreenComment.objects.filter(screen=context["screens"][0])

            return self.render_to_response(context)


class ProjectPreviewView(LoginRequiredMixin, TemplateView):
    template_name = "projects/preview.html"

    def get(self, request, *args, **kwargs):
        context = self.get_context_data()
        screen_id = kwargs.pop("pk")

        screen = ProjectScreen.objects.get(id=screen_id)
        project = screen.project
        member, created = ProjectMember.objects.get_or_create(
            role=request.user.profile.role,
            project=project,
            user=request.user,
        )

        thread = Thread.objects.get(project=project)
        if member:
            UserThread.objects.create(
                thread=thread,
                user=member,
            )

        context["screen_events"] = ScreenEvent.objects.filter(screen=screen_id)
        context["screen_comments"] = ScreenComment.objects.filter(screen=screen_id)
        context["image"] = build_absolute_url(screen.get_image())
        context["url"] = build_absolute_url(screen.get_preview_url())
        context["title"] = screen.project.name
        context["screen"] = screen
        context["project_members"] = ProjectMember.objects.filter(project=project)
        context["search_user_form"] = SearchUserForm()
        context["invite_form"] = ProjectInvitationForm()
        context["project"] = project
        context["add_task_form"] = AddTaskForm(project)
        context["project_member_user"] = ProjectMember.objects.get(user=request.user, project=project)
        context["activities"] = ProjectActivity.objects.filter(project=project).order_by('-created')
        context["thread"] = Thread.ordered(Thread.inbox(context["project_member_user"], project))[0]

        return self.render_to_response(context)


class DeleteProjectView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request, *args, **kwargs):
        project = request.POST["projectId"]
        Project.objects.filter(pk=project).delete()
        projects = Project.objects.filter(user=request.user)

        delete_project_data_db(project, request.user)
        return JsonResponse({"msg": "Project has been deleted successfully.", "projects": len(projects)})