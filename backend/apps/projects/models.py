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
)


class Project(TimeStampedModel):
    STATUS_PAID = "paid"
    STATUS_PENDING = "pending"
    STATUS_CHOICES = (
        (STATUS_PAID, "Paid"),
        (STATUS_PENDING, "Pending"),
    )

    name = models.CharField(max_length=250)
    status = models.CharField(choices=STATUS_CHOICES, default=STATUS_PENDING, max_length=20)
    members = models.ManyToManyField(User, through="ProjectMember")

    def get_project_url(self):
        return reverse("projects:project",
                       kwargs={"pk": self.pk})

    def __str__(self):
        return self.name


class ProjectScreen(TimeStampedModel):
    image = models.ImageField(upload_to=utils.get_file_path, blank=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    def get_image(self):
        return self.image.url

    def get_screen_url(self):
        return reverse("projects:screen",
                       kwargs={"project_id": self.project.id, "screen_id": self.pk})

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
    LINK_TO_POINT = "point"
    LINK_TO_SCREEN = "screen"
    LINK_TO_CHOICES = (
        ("", "Select a destination"),
        (LINK_TO_URL, "External Url"),
    )

    event = models.CharField(choices=EVENT_CHOICES, default=EVENT_CLICK, max_length=32)
    link_to = models.CharField(choices=LINK_TO_CHOICES, default=LINK_TO_URL, max_length=32)
    href = models.CharField(max_length=250)
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


class ProjectMember(TimeStampedModel):
    ROLE_OWNER = "owner"
    ROLE_MEMBER = "member"
    ROLE_CHOICES = (
        (ROLE_OWNER, "OWNER"),
        (ROLE_MEMBER, "MEMBER"),
    )
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(choices=ROLE_CHOICES, default=ROLE_OWNER, max_length=32)
    is_active = models.BooleanField(default=False)
    date_joined = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.project.name
