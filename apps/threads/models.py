from django.contrib.auth.models import User
from django.db import models
from django.urls import reverse
from django.utils import timezone

from .utils import cached_property

__all__ = (
    "Thread",
    "Message",
    "UserThread",
)


class Thread(models.Model):

    subject = models.CharField(max_length=150)
    users = models.ManyToManyField(User, through="UserThread")

    def __str__(self):
        return self.subject

    @classmethod
    def inbox(cls, user):
        cls.current_user = user
        return cls.objects.filter(userthread__user=user)

    def get_absolute_url(self):
        return reverse("threads:list", args=[self.pk])

    def get_chat_url(self):
        return reverse("threads:chat", args=[self.pk])

    def thread_messages(self):
        return self.messages.all()

    @property
    @cached_property
    def first_message(self):
        return self.messages.all()[0]

    @property
    @cached_property
    def latest_message(self):
        return self.messages.order_by("-sent_at")[0]

    def user_short_name(self):
        return ", ".join(["{} {}".format(u.first_name[0], u.last_name[0]).upper()
                          for u in self.users.all() if u.pk != self.current_user.pk])

    def user_avatar(self):
        return self.current_user.avatar.url

    def user_full_name(self):
        return ", ".join(["{} {}".format(u.first_name, u.last_name)
                          for u in self.users.all() if u.pk != self.current_user.pk])

    def get_latest_message_content(self):
        return self.messages.order_by("-sent_at")[0].content

    @classmethod
    def ordered(cls, objs):
        objs = list(objs)
        objs.sort(key=lambda o: o.latest_message.sent_at, reverse=True)
        return objs


class Message(models.Model):

    thread = models.ForeignKey(Thread, related_name="messages", on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    sent_at = models.DateTimeField(default=timezone.now)
    content = models.TextField()
    unread = models.BooleanField(default=True)

    def __str__(self):
        return self.content


class UserThread(models.Model):

    thread = models.ForeignKey(Thread, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
