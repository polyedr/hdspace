from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.views.generic.base import View

from .models import Thread, Message

__all__ = (
    "MessageListView",
    "ChatView",
    "ThreadsListView",
)


class MessageListView(LoginRequiredMixin, View):

    def get(self, request, *args, **kwargs):
        messages = Message.objects.filter(thread=kwargs.get("pk"))

        if request.GET.get("status") == "true":
            messages = messages.filter(pk__gt=request.GET.get("last_pk", 0)).exclude(sender=self.request.user)

        messages = messages.order_by("sent_at").values(
            "sender__first_name",
            "sender__last_name",
            "content", "pk",
            "sent_at", "sender__id",
        )

        context = dict()
        context["messages"] = list(messages)

        Message.objects.filter(thread=kwargs.get("pk"))\
            .exclude(sender=self.request.user).update(unread=False)

        return JsonResponse(context)


class ChatView(LoginRequiredMixin, View):

    def post(self, request, **kwargs):
        new_message = request.POST.get("message")
        message = Message(
            thread=Thread.objects.get(pk=kwargs.get("pk")),
            sender=self.request.user,
            content=new_message,
            unread=True
        )
        message.save()
        context = dict({
            "status": True
        })
        context["sent_at"] = message.sent_at
        return JsonResponse(context)


class ThreadsListView(LoginRequiredMixin, View):

    def get(self, request, *args, **kwargs):
        threads = Thread.ordered(Thread.inbox(self.request.user))
        data = []
        for thread in threads:
            thread_data = dict()
            thread_data["url_path"] = thread.get_absolute_url()
            thread_data["chat_url"] = thread.get_chat_url()
            thread_data["user_short_name"] = thread.user_short_name()
            thread_data["user_full_name"] = thread.user_full_name()
            thread_data["avatar"] = thread.user_avatar()
            thread_data["subject"] = thread.subject
            thread_data["latest_message"] = thread.get_latest_message_content()
            data.append(thread_data)
        context = dict()
        context["threads"] = data
        return JsonResponse(context)
