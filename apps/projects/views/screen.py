from django.views.generic.base import View
from django.views.generic import TemplateView
from django.urls import reverse
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core import serializers

from projects.forms import ScreenEventForm, ScreenUploadForm
from projects.models import Project, ProjectScreen, ScreenEvent


__all__ = (
    "AddProjectScreenView",
    "ProjectScreenView",
    "DeleteScreenView",
    "ProjectScreenPreviewView",
    "EditScreenView",
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
        screen_events = ScreenEvent.objects.filter(screen=screen_id).values(
            "href",
            "x",
            "y",
            "width",
            "height",
            "event",
            "link_to",
            "new_window",
            "pk",
            "link_screen",
            "screen__project__preview",
        )
        screen = ProjectScreen.objects.get(id=screen_id)
        context = dict(
            image=screen.get_image(),
            events=list(screen_events),
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

        return self.render_to_response(context)
