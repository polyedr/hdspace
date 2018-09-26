from django.views.generic.base import View
from django.views.generic import TemplateView
from django.urls import reverse
from django.http import HttpResponseRedirect, JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from django.core import serializers

from core.views.seo import SEOViewMixin
from .forms import CreateProjectForm, ScreenUploadForm, ScreenEventForm, PositionUpdateForm
from .models import *  # noqa

__all__ = (
    "DashboardView",
    "CreateProjectView",
    "ProjectView",
    "AddProjectScreenView",
    "ProjectScreenView",
    "DeleteScreenEventView",
    "UpdateEventPositionView",
    "ScreenEventsView",
    "DeleteProjectView",
)


class DashboardView(LoginRequiredMixin, SEOViewMixin, TemplateView):
    template_name = "projects/dashboard.html"
    page_title = "Projects"

    def get_context_data(self, **kwargs):
        context = super(DashboardView, self).get_context_data(**kwargs)
        context["projects"] = ProjectMember.objects.filter(user=self.request.user, is_active=True)
        if "form" not in kwargs:
            context["form"] = CreateProjectForm()

        return context


class CreateProjectView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request, *args, **kwargs):
        form = CreateProjectForm(data=request.POST)
        if form.is_valid():
            project = Project.objects.create(
                name=form.cleaned_data["name"]
            )
            ProjectMember.objects.create(
                project=project,
                user=request.user,
                role=ProjectMember.ROLE_OWNER,
                is_active=True,
            )
            messages.success(request, "Your project has been created successfully.")
        else:
            messages.error(request, "Wrong project name.")
        return HttpResponseRedirect(reverse("projects:dashboard"))


class ProjectView(LoginRequiredMixin, TemplateView):
    template_name = "projects/project.html"

    def get(self, request, *args, **kwargs):
        context = self.get_context_data()
        project = kwargs.pop("pk")
        context["screens"] = ProjectScreen.objects.filter(project=project)
        screen = None
        if context["screens"]:
            screen = context["screens"][0]
            context["screen_events"] = ScreenEvent.objects.filter(screen=screen.id)
        if "form" not in kwargs:
            context["form"] = ScreenUploadForm()
            context["screen_form"] = ScreenEventForm()
            context["screen"] = screen
            context["project"] = Project.objects.get(pk=project)
        return self.render_to_response(context)


class DeleteProjectView(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        project = kwargs.pop("pk")
        Project.objects.filter(pk=project).delete()
        messages.success(request, "Project has been deleted successfully.")
        return HttpResponseRedirect(reverse("projects:dashboard"))


class AddProjectScreenView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request, *args, **kwargs):
        project_id = kwargs.pop("pk")
        form = ScreenUploadForm(request.POST, request.FILES)
        if form.is_valid():
            project = Project.objects.get(pk=project_id)
            ProjectScreen.objects.create(
                project=project,
                image=form.cleaned_data["image"],
            )
            messages.success(request, "Project screen successfully added.")
        else:
            messages.error(request, "Invalid Image File.")

        return HttpResponseRedirect(reverse("projects:project", kwargs={"pk": project_id}))


class ProjectScreenView(LoginRequiredMixin, View):

    def post(self, request, *args, **kwargs):
        form = ScreenEventForm(data=request.POST)
        if form.is_valid():
            data = form.cleaned_data
            screen_id = kwargs.pop("screen_id")
            screen = ProjectScreen.objects.get(pk=screen_id)
            screen_event_id = data.get("screen_event_id", "")
            screen_data = dict(
                screen=screen,
                href=data["href"],
                x=data["x"],
                y=data["y"],
                height=data["height"],
                width=data["width"],
                new_window=data["new_window"],
                event=data["event"],
                link_to=data["link_to"],
            )
            if screen_event_id:
                ScreenEvent.objects.filter(pk=data["screen_event_id"]).update(**screen_data)
                screen_event = ScreenEvent.objects.get(pk=data["screen_event_id"])
            else:
                screen_event = ScreenEvent.objects.create(**screen_data)
            return JsonResponse({
                "screen_event": serializers.serialize("json", [screen_event]),
                "update_url": screen_event.get_update_event_position_url(),
                "delete_url": screen_event.get_event_delete_url(),
            }, safe=False)


class DeleteScreenEventView(LoginRequiredMixin, View):

    def post(self, request, *args, **kwargs):
        screen_event_id = request.POST["screenEventId"]
        ScreenEvent.objects.filter(pk=screen_event_id).delete()
        return JsonResponse({"msg": "Event has been deleted successfully."})


class UpdateEventPositionView(LoginRequiredMixin, View):

    def post(self, request, *args, **kwargs):
        form = PositionUpdateForm(data=request.POST)
        event_id = kwargs.pop("pk")
        if form.is_valid():
            ScreenEvent.objects.filter(pk=event_id).update(
                x=form.cleaned_data["x"],
                y=form.cleaned_data["y"],
            )
            msg = "Positions have been updated successfully."
        else:
            msg = "Invalid data."
        return JsonResponse({"msg": msg})


class ScreenEventsView(LoginRequiredMixin, View):

    def get(self, request, *args, **kwargs):
        screen_id = kwargs.pop("pk")
        screen = ProjectScreen.objects.get(pk=screen_id)
        events = ScreenEvent.objects.filter(screen=screen_id)
        screen_events = []
        for event in events:
            screen_event = dict(
                event=event.event,
                link_to=event.link_to,
                href=event.href,
                new_window=event.new_window,
                height=event.height,
                width=event.width,
                x=event.x,
                y=event.y,
                pk=event.pk,
                delete_url=event.get_event_delete_url(),
                update_url=event.get_update_event_position_url(),
            )
            screen_events.append(screen_event)
        return JsonResponse({"screen_events": screen_events, "save_url": screen.get_screen_url()}, safe=False)
