from django.views.generic.base import View
from django.views.generic import TemplateView
from django.db.models import Q, Count
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin

from payments.cart import Cart
from core.views.seo import SEOViewMixin
from threads.models import Thread, UserThread, Message
from projects.forms import (
    CreateProjectForm, ScreenUploadForm, ProjectInvitationForm,
    AddTaskForm
)

from accounts.forms import SearchUserForm
from projects.models import (
    Project, ProjectScreen, ScreenEvent,
    ProjectMember, ProjectTask
)
from accounts.models import Profile


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
            context["project_members"] = ProjectMember.objects.filter(project=project)
            context["tasks"] = ProjectTask.objects.filter(project=project)
            context["project_member_user"] = ProjectMember.objects.get(user=request.user, project=project)
            context["thread"] = Thread.ordered(Thread.inbox(context["project_member_user"], project))[0]
            context["projects"] = Project.objects.filter(user=request.user)
            context["search_user_form"] = SearchUserForm()
            return self.render_to_response(context)


class ProjectPreviewView(LoginRequiredMixin, TemplateView):
    template_name = "projects/preview.html"

    def get(self, request, *args, **kwargs):
        context = self.get_context_data()
        screen_id = kwargs.pop("pk")

        context["screen_events"] = ScreenEvent.objects.filter(screen=screen_id)
        context["screen"] = ProjectScreen.objects.get(id=screen_id)

        return self.render_to_response(context)


class DeleteProjectView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request, *args, **kwargs):
        project = request.POST["projectId"]
        Project.objects.filter(pk=project).delete()
        return JsonResponse({"msg": "Project has been deleted successfully."})
