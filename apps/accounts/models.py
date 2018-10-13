import uuid
import datetime

from django.urls import reverse
from django.db import models
from django.contrib.auth.models import User
from django.contrib.staticfiles.templatetags.staticfiles import static
from django.core.cache import cache
from django.conf import settings

from core.models import TimeStampedModel
from .utils import utils

__all__ = (
    "Profile",
    "Team",
    "TeamMember",
)


class Profile(TimeStampedModel):
    email_confirmation_token = models.CharField(max_length=64, editable=False, null=True)
    reset_password_token = models.CharField(max_length=64, editable=False, null=True)
    invitation_token = models.CharField(max_length=64, editable=False, null=True)
    avatar = models.ImageField(upload_to=utils.get_file_path, blank=True)

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def get_confirmation_url(self) -> str:
        return reverse(
            "accounts:confirmation",
            kwargs=dict(confirmation_token=self.email_confirmation_token),
        )

    def get_reset_password_url(self) -> str:
        return reverse(
            "accounts:reset_password",
            kwargs=dict(reset_token=self.reset_password_token),
        )

    def get_image(self) -> str:
        if not self.avatar:
            return static("/img/profile_empty.png")
        return self.avatar.url

    @staticmethod
    def generate_token() -> uuid:
        return uuid.uuid4()

    def last_seen(self):
        return cache.get('seen_%s' % self.user.username)

    def online(self):
        if self.last_seen():
            now = datetime.datetime.now()
            if now > self.last_seen() + datetime.timedelta(
                    seconds=settings.USER_ONLINE_TIMEOUT):
                return False
            else:
                return True
        else:
            return False

    def __str__(self):
        return self.user.email


class TeamMember(TimeStampedModel):
    charge = models.DecimalField(max_digits=10, decimal_places=2)
    time_log = models.DecimalField(max_digits=10, decimal_places=2)
    position = models.CharField(max_length=250)
    description = models.TextField()
    available = models.BooleanField(default=False)
    date_joined = models.DateField(auto_now_add=True)
    logo = models.ImageField(upload_to=utils.get_file_path, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.charge


class Team(TimeStampedModel):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    team_name = models.CharField(max_length=250)
    logo = models.ImageField(upload_to=utils.get_file_path, blank=True)
    members = models.ManyToManyField(TeamMember)

    def __str__(self):
        return self.owner.email
