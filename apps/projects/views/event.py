from django.views.generic.base import View
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin

from projects.forms import PositionUpdateForm
from projects.models import ScreenEvent, ProjectScreen


__all__ = (
    "DeleteScreenEventView",
    "UpdateEventPositionView",
    "ScreenEventsView",
)


class DeleteScreenEventView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request, *args, **kwargs):
        screen_event_id = request.POST["screenEventId"]
        ScreenEvent.objects.filter(pk=screen_event_id).delete()
        return JsonResponse({"msg": "Event has been deleted successfully."})


class ScreenEventsView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
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


class UpdateEventPositionView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
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
