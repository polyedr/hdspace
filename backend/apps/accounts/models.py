import uuid
import datetime

from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import ArrayField
from django.urls import reverse
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.staticfiles.templatetags.staticfiles import static
from django.core.cache import cache
from django.conf import settings
from jsonfield import JSONField
from apps.utils.models import TimeStampedModel
from .utils import utils
import ast

__all__ = ("User", "Profile", "Team", "TeamMember")

class User(AbstractUser):
    email = models.EmailField(verbose_name="email address", max_length=255, unique=True)


class Profile(TimeStampedModel):
    ROLE_STAFF = "STAFF"
    ROLE_ADMINISTRATOR = "ADMINISTRATOR"
    ROLE_LIBRARIAN = "LIBRARIAN"
    ROLE_EXTERNAL = "EXTERNAL"
    USER_ROLE = (
        (ROLE_STAFF, "Staff"),
        (ROLE_ADMINISTRATOR, "Administrator"),
        (ROLE_LIBRARIAN, "Librarian"),
        (ROLE_EXTERNAL, "External"),
    )

    UEXP_BEGINNER = "BEGINNER"
    UEXP_EXPERIENCED = "EXPERIENCED"

    USER_EXP = (
        (UEXP_BEGINNER, "Beginner"),
        (UEXP_EXPERIENCED, "Experienced"),
    )
    role = models.CharField(
        max_length=32, choices=USER_ROLE, default=ROLE_STAFF, null=True
    )
    experienced = models.CharField(
        max_length=32, choices=USER_EXP, default=UEXP_BEGINNER, null=True
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email_confirmation_token = models.CharField(
        max_length=64, editable=False, null=True
    )
    reset_password_token = models.CharField(max_length=64, editable=False, null=True)
    invitation_token = models.CharField(max_length=64, editable=False, null=True)
    avatar = models.ImageField(upload_to=utils.get_file_path, blank=True, null=True)
    approved = models.BooleanField(default=False)
    hourly_rate = models.IntegerField(default=0)
    projects_max = models.IntegerField(default=0)
    parameters = JSONField(blank=True)

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
        return cache.get("seen_%s" % self.user.username)

    def online(self):
        if self.last_seen():
            now = datetime.datetime.now()
            if now > self.last_seen() + datetime.timedelta(
                seconds=settings.USER_ONLINE_TIMEOUT
            ):
                return False
            else:
                return True
        else:
            return False

    def __str__(self):
        # return f"{self.user.first_name} {self.user.last_name}"
        return self.user.email


class TeamMember(TimeStampedModel):

    ROLE_ADMIN = "admin"
    ROLE_MEMBER = "member"
    ADMIN_OR_MEMBER = ((ROLE_ADMIN, "ADMIN"), (ROLE_MEMBER, "MEMBER"))

    charge = models.DecimalField(max_digits=10, decimal_places=2)
    time_log = models.DecimalField(max_digits=10, decimal_places=2)
    position = models.CharField(max_length=250)
    date_joined = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=False)
    team_member_role = models.CharField(
        choices=ADMIN_OR_MEMBER, default=ROLE_MEMBER, max_length=64
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.get_full_name()


class Team(TimeStampedModel):
    description = models.TextField()
    logo = models.ImageField(upload_to=utils.get_file_path, blank=True)
    team_name = models.CharField(max_length=250)
    available = models.BooleanField(default=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    members = models.ManyToManyField(TeamMember)

    def get_image(self) -> str:
        return self.logo.url

    def __str__(self):
        return self.team_name


class SharedLink(TimeStampedModel):
    ROLE_VIEWER = "view"
    ROLE_EDITOR = "edit"
    VIEWER_OR_EDITOR = ((ROLE_VIEWER, "view"), (ROLE_EDITOR, "edit"))

    pmap = models.CharField(
        choices=VIEWER_OR_EDITOR, default=ROLE_VIEWER, max_length=64
    )
    # permissions = ArrayField(models.CharField(max_length=20, editable=False, null=True), size=10, )
    permissions = JSONField(blank=True)
    shortuuid_token = models.CharField(max_length=64, editable=False, null=True)
    access_token = models.CharField(max_length=256, editable=False, null=True)
    project_id = models.IntegerField(default=0)
    screen_id = models.IntegerField(default=0)
    task_id = models.IntegerField(default=0)
    element_id = models.IntegerField(default=0)

    creator = models.ForeignKey(get_user_model(), related_name="linkcreator", null=True, blank=True,
                                on_delete=models.CASCADE)
    owner = models.ForeignKey(
        get_user_model(), related_name="linkowner", null=True, blank=True, on_delete=models.CASCADE
    )

    def __str__(self):
        return self.shortuuid_token
