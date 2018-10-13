from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.views.generic.base import View

from .models import Thread, Message

__all__ = (
    "MessageListView",
    "ChatView",
)


class MessageListView(LoginRequiredMixin, View):

    def get(self, request, *args, **kwargs):
        messages = Message.objects.filter(thread=kwargs.get("pk"))

        if request.GET.get("status") == "true":
            messages = messages.filter(pk__gt=request.GET.get("last_pk", 0)).exclude(sender=request.user)

        messages = messages.order_by("sent_at")

        context = dict()
        messages = [dict(
            username=message.sender.username,
            avatar=message.sender.profile.get_image(),
            content=message.content,
            pk=message.pk,
            sent_at=message.sent_at,
            sender_id=message.sender.id,
            online=message.sender.profile.online(),
        ) for message in messages]
        context["messages"] = messages

        Message.objects.filter(thread=kwargs.get("pk"))\
            .exclude(sender=self.request.user).update(unread=False)

        return JsonResponse(context)


class ChatView(LoginRequiredMixin, View):

    def post(self, request, **kwargs):
        new_message = request.POST.get("message")
        message = Message(
            thread=Thread.objects.get(pk=kwargs.get("pk")),
            sender=request.user,
            content=new_message,
            unread=True
        )
        message.save()
        context = dict({
            "status": True
        })
        context["sent_at"] = message.sent_at
        context["avatar"] = message.sender.profile.get_image()
        return JsonResponse(context)
