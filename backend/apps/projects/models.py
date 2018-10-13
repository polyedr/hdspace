import secrets
import uuid

from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse

from core.models import TimeStampedModel
from accounts.utils import utils


__all__ = (
    "Project",
    "ProjectMember",
    "ProjectScreen",
    "ScreenEvent",
    "ProjectTask",
    "ProjectActivity",
    "ProjectInvitation",
)


class Project(TimeStampedModel):
    STATUS_PAID = "paid"
    STATUS_PENDING = "pending"
    STATUS_CHOICES = (
        (STATUS_PAID, "Paid"),
        (STATUS_PENDING, "Pending"),
    )

    name = models.CharField(max_length=250)
    preview = models.CharField(max_length=60)
    status = models.CharField(choices=STATUS_CHOICES, default=STATUS_PENDING, max_length=20)
    user = models.ForeignKey(User, related_name="user", on_delete=models.CASCADE)
    members = models.ManyToManyField(User, related_name="members", through="ProjectMember")

    @staticmethod
    def generate_preview_token():
        return secrets.token_urlsafe(16)

    def get_project_url(self):
        return reverse("projects:project",
                       kwargs={"pk": self.pk})

    def __str__(self):
        return self.name


class ProjectTask(TimeStampedModel):
    title = models.CharField(max_length=250)
    description = models.TextField()

    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    creator = models.ForeignKey(User, related_name="creator", on_delete=models.CASCADE)
    owner = models.ForeignKey(User, related_name="owner", on_delete=models.CASCADE)


class ProjectActivity(TimeStampedModel):
    EVENT_CREATE = "create"
    ACTIVITY_TYPES = (
        (EVENT_CREATE, "CREATE"),
    )

    type = models.CharField(choices=ACTIVITY_TYPES, default=EVENT_CREATE, max_length=32)

    project = models.ForeignKey(Project, on_delete=models.CASCADE)


class ProjectScreen(TimeStampedModel):
    image = models.ImageField(upload_to=utils.get_file_path, blank=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    def get_image(self):
        return self.image.url

    def get_screen_url(self):
        return reverse("projects:screen", kwargs={"project_id": self.project.id, "screen_id": self.pk})

    def get_preview_url(self):
        return reverse("projects:preview", kwargs={"token": self.project.preview, "pk": self.pk})

    def __str__(self):
        return self.project.name


class ScreenEvent(TimeStampedModel):

    EVENT_CLICK = "click"
    EVENT_HOVER = "hover"
    EVENT_CHOICES = (
        (EVENT_CLICK, "CLICK"),
        (EVENT_HOVER, "HOVER"),
    )

    LINK_TO_URL = "external"
    LINK_TO_SCREEN = "screen"
    LINK_TO_CHOICES = (
        ("", "Select a destination"),
        (LINK_TO_URL, "External Url"),
        (LINK_TO_SCREEN, "Another Screen"),
    )

    event = models.CharField(choices=EVENT_CHOICES, default=EVENT_CLICK, max_length=32)
    link_to = models.CharField(choices=LINK_TO_CHOICES, default=LINK_TO_URL, max_length=32)
    href = models.CharField(max_length=250)
    link_screen = models.IntegerField(default=0)
    new_window = models.BooleanField(default=False)
    height = models.IntegerField()
    width = models.IntegerField()
    x = models.IntegerField()
    y = models.IntegerField()

    screen = models.ForeignKey(ProjectScreen, on_delete=models.CASCADE)

    @staticmethod
    def get_event_delete_url():
        return reverse("projects:delete_screen_event")

    def get_update_event_position_url(self):
        return reverse("projects:update_event_position",
                       kwargs={"pk": self.pk})

    def __str__(self):
        return self.screen.project.name


class ProjectInvitation(TimeStampedModel):
    invitation_token = models.CharField(max_length=16)
    is_active = models.BooleanField(default=False)
    email = models.CharField(max_length=250)

    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    @staticmethod
    def generate_token() -> uuid:
        return uuid.uuid4()


class ProjectMember(TimeStampedModel):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.project.name
