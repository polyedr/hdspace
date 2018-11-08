from django.views.generic.base import View
from django.views.generic import TemplateView
from django.urls import reverse
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core import serializers
from django.contrib.auth.models import User

from core.utils import build_absolute_url
from projects.forms import ScreenEventForm, ScreenUploadForm
from projects.models import (
    Project, ProjectScreen, ScreenEvent,
    ScreenAssignee, ProjectActivity
)
from projects.utils import emails


__all__ = (
    "AddProjectScreenView",
    "ProjectScreenView",
    "DeleteScreenView",
    "ProjectScreenPreviewView",
    "EditScreenView",
    "AssignScreenView",
    "ChangeScreenStatusView",
    "ShareScreenView",
)


class ProjectScreenView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
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
                link_screen=data["link_screen"],
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
                "project_id": screen.project.pk,
            }, safe=False)


class DeleteScreenView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request, *args, **kwargs):
        screen_id = request.POST["screenId"]
        ProjectScreen.objects.get(pk=screen_id).delete()
        return JsonResponse({"msg": "Screen has been deleted successfully."})


class AddProjectScreenView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request, *args, **kwargs):
        project_id = request.POST["projectId"]
        form = ScreenUploadForm(request.POST, request.FILES)
        if form.is_valid():
            screen = form.save()
            project = Project.objects.get(pk=project_id)
            screen.project = project
            screen.save()
            ScreenAssignee.objects.create(
                screen=screen,
                user=request.user,
            )
            ProjectActivity.objects.create(
                type=ProjectActivity.ADDED_SCREEN,
                member=request.user,
                project=project,
            )

            return JsonResponse({
                "is_valid": True,
                "msg": "Project screen successfully added.",
                "pk": screen.pk,
                "url": screen.image.url,
                "preview_url": screen.get_preview_url(),
                "save_url": screen.get_screen_url(),
                "edit_screen_url": screen.get_edit_screen_url(),
                "event_url": reverse("projects:screen_events", kwargs={"pk": screen.pk}),
            })
        else:
            return JsonResponse({"is_valid": False, "msg": "Invalid Image File."}, status=400)


class ProjectScreenPreviewView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def get(self, request, *args, **kwargs):
        screen_id = kwargs.pop("pk")
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
                link_screen=event.link_screen,
                screen__project__preview=event.screen.project.preview,
                screen__project__pk=event.screen.project.pk,
            )
            screen_events.append(screen_event)

        screen = ProjectScreen.objects.get(id=screen_id)
        context = dict(
            image=screen.get_image(),
            preview_absolute_url=build_absolute_url(screen.get_preview_url()),
            screen_save_url=build_absolute_url(screen.get_screen_url()),
            events=screen_events,
        )

        return JsonResponse(context)


class EditScreenView(LoginRequiredMixin, TemplateView):
    template_name = "projects/edit-screen.html"

    def get(self, request, *args, **kwargs):
        context = self.get_context_data()

        screen = kwargs.pop("screen_id")
        project = kwargs.pop("project_id")
        context["screen_form"] = ScreenEventForm()
        context["screen"] = ProjectScreen.objects.get(pk=screen)
        context["screens"] = ProjectScreen.objects.filter(project=project)
        context["screen_events"] = ScreenEvent.objects.filter(screen=screen)
        context["project_id"] = project

        return self.render_to_response(context)


class AssignScreenView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request, *args, **kwargs):
        screen_id = request.POST["screenId"]
        assignee = request.POST["assignee"]
        screen = ProjectScreen.objects.get(id=screen_id)
        user = User.objects.get(pk=assignee)
        ScreenAssignee.objects.filter(screen=screen).update(user=user)
        return JsonResponse({"msg": "Screen has been successfully assigned."})


class ChangeScreenStatusView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request, *args, **kwargs):
        screen_id = request.POST["screenId"]
        status = request.POST["status"]
        ProjectScreen.objects.filter(pk=screen_id).update(status=status)
        return JsonResponse({"msg": "Screen status has been successfully changed."})


class ShareScreenView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request, *args, **kwargs):
        screen_id = request.POST["screenId"]
        email = request.POST["email"]
        screen = ProjectScreen.objects.get(pk=screen_id)
        emails.share_link_email(
            email=email,
            project=screen.project.name,
            share_link=screen.get_preview_url(),
            username=request.user.get_full_name()
        )
        return JsonResponse({"msg": "Screen has been successfully shared."})
