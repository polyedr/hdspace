from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.views.generic.base import View

from threads.forms import FileUploadForm

from projects.models import ProjectMember, Project
from .models import Thread, Message

__all__ = (
    "MessageListView",
    "ChatView",
    "DeleteView",
    "EditView",
    "AddMessageFileView",
)


class MessageListView(LoginRequiredMixin, View):

    def get(self, request, *args, **kwargs):
        thread = Thread.objects.get(pk=kwargs.get("pk"))
        messages = Message.objects.filter(thread=thread)
        member = ProjectMember.objects.get(user=request.user, project=thread.project)
        if request.GET.get("status") == "true":
            messages = messages.filter(pk__gt=request.GET.get("last_pk", 0)).exclude(sender=member)

        messages = messages.order_by("sent_at")

        context = dict()
        messages = [dict(
            username=message.sender.user.username,
            avatar=message.sender.user.profile.get_image(),
            content=message.content,
            pk=message.pk,
            sent_at=message.sent_at,
            sender_id=message.sender.id,
            status=message.sender.status,
            role=message.sender.role,
            online=message.sender.user.profile.online(),
            message_id=message.id,
            file=message.file.url if message.file else '',
            file_name=message.file_name if message.file_name is not None else '',
        ) for message in messages]
        context["messages"] = messages

        Message.objects.filter(thread=thread)\
            .exclude(sender=member).update(unread=False)

        return JsonResponse(context)


class ChatView(LoginRequiredMixin, View):

    def post(self, request, **kwargs):
        new_message = request.POST.get("message")
        thread = Thread.objects.get(pk=kwargs.get("pk"))
        member = ProjectMember.objects.get(project=thread.project, user=request.user)
        message = Message(
            thread=thread,
            sender=member,
            content=new_message,
            unread=True
        )
        message.save()
        context = dict({
            "status": True,
            "sent_at": message.sent_at,
            "avatar": message.sender.user.profile.get_image(),
            "role": message.sender.role,
            "sender_id": message.sender.id,
        })
        return JsonResponse(context)


class DeleteView(LoginRequiredMixin, View):

    def post(self, request, **kwargs):
        project = request.POST["projectId"]
        message = request.POST["messageId"]
        project = Project.objects.get(pk=project)
        if project.user == request.user:
            Message.objects.filter(pk=message).delete()
            msg = {"msg": "Message has been deleted successfully."}
        else:
            msg = {}
        return JsonResponse(msg)


class EditView(LoginRequiredMixin, View):

    def post(self, request, **kwargs):
        pass


class AddMessageFileView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request, *args, **kwargs):
        project_id = request.POST["projectId"]
        thread_id = request.POST["threadId"]
        form = FileUploadForm(request.POST, request.FILES)
        if form.is_valid():
            project = Project.objects.get(pk=project_id)
            thread = Thread.objects.get(pk=thread_id)
            member = ProjectMember.objects.get(project=project, user=request.user)
            message = form.save()
            Message.objects.filter(pk=message.pk).update(
                thread=thread,
                sender=member,
                content='',
                unread=True,
                file_name=request.FILES['file'].name,
            )
            message = Message.objects.get(pk=message.pk)
            print(message.file.name)
            context = dict({
                "status": True,
                "sent_at": message.sent_at,
                "avatar": message.sender.user.profile.get_image(),
                "role": message.sender.role,
                "file": message.file.url,
                "file_name": message.file_name,
                "sender_id": message.sender.id,
                "is_valid": True,
            })
            return JsonResponse(context)
        else:
            return JsonResponse({"is_valid": False, "msg": "Invalid File."}, status=400)
