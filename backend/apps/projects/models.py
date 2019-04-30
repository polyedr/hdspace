import secrets
import uuid
from collections import OrderedDict

import pymongo

from django.db import models
from django.contrib.auth import get_user_model
from django.urls import reverse
from djongo.models import ListField, DictField
from rest_framework.fields import Field, JSONField

from apps.core.models import TimeStampedModel
from apps.accounts.utils import utils

client = pymongo.MongoClient("localhost", 27017)  # maxPoolSize=50
db_main = client.mainDB


__all__ = (
    "Project",
    "ProjectMember",
    "ProjectScreen",
    "ScreenEvent",
    "ProjectTask",
    "ProjectActivity",
    "ProjectInvitation",
    "ScreenAssignee",
    "TaskTime",
    "ScreenComment",
    "Comment",
)


class Project(TimeStampedModel):
    STATUS_PAID = "paid"
    STATUS_PENDING = "pending"
    STATUS_CHOICES = ((STATUS_PAID, "Paid"), (STATUS_PENDING, "Pending"))

    name = models.CharField(max_length=250)
    preview = models.CharField(max_length=60)
    status = models.CharField(
        choices=STATUS_CHOICES, default=STATUS_PENDING, max_length=20
    )
    duplicated = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True
    )
    user = models.ForeignKey(
        get_user_model(), related_name="user", on_delete=models.CASCADE
    )
    members = models.ManyToManyField(
        get_user_model(), related_name="members", through="ProjectMember"
    )

    @staticmethod
    def generate_preview_token():
        return secrets.token_urlsafe(16)

    def get_project_url(self):
        return reverse("projects:project", kwargs={"pk": self.pk})

    def __str__(self):
        return self.name


class ProjectScreen(TimeStampedModel):
    SCREEN_ON_HOLD = "on_hold"
    SCREEN_IN_PROGRESS = "in_progress"
    SCREEN_REVIEW = "review"
    SCREEN_APPROVED = "approved"
    SCREEN_STATUS = (
        (SCREEN_ON_HOLD, "ON_HOLD"),
        (SCREEN_IN_PROGRESS, "IN_PROGRESS"),
        (SCREEN_REVIEW, "REVIEW"),
        (SCREEN_APPROVED, "APPROVED"),
    )

    name = models.CharField(max_length=250, blank=True)
    status = models.CharField(
        choices=SCREEN_STATUS, default=SCREEN_IN_PROGRESS, max_length=32
    )
    project = models.ForeignKey(
        Project, related_name="projectscreen", on_delete=models.CASCADE
    )
    # project = models.ForeignKey(Project, on_delete=models.CASCADE)
    details_id = models.CharField(max_length=32)
    image = models.ImageField(upload_to=utils.get_file_path, blank=True, max_length=256)

    # Screen data should be replaced with JSON field further to save DOM

    # screen_data = models.CharField(max_length=2048, blank=True)
    # screen_data = JSONField(blank=True)
    # screen_data = OrderedDict(blank=True)
    # screen_data = DictField(default={}, blank=True, null=True)

    def get_image(self):
        # return self.image.url
        return True

    def get_screen_url(self):
        return reverse(
            "projects:screen",
            kwargs={"project_id": self.project.id, "screen_id": self.pk},
        )

    def get_preview_url(self):
        return reverse(
            "projects:preview", kwargs={"token": self.project.preview, "pk": self.pk}
        )

    def get_edit_screen_url(self):
        return reverse(
            "projects:edit_screen",
            kwargs={"project_id": self.project.pk, "screen_id": self.pk},
        )

    def __str__(self):
        return "{}".format(self.pk)


class ScreenEvent(TimeStampedModel):

    EVENT_CLICK = "click"
    EVENT_HOVER = "hover"
    EVENT_CHOICES = ((EVENT_CLICK, "CLICK"), (EVENT_HOVER, "HOVER"))

    LINK_TO_URL = "external"
    LINK_TO_SCREEN = "screen"
    LINK_TO_CHOICES = (
        ("", "Select a destination"),
        (LINK_TO_URL, "External Url"),
        (LINK_TO_SCREEN, "Another Screen"),
    )

    event = models.CharField(choices=EVENT_CHOICES, default=EVENT_CLICK, max_length=32)
    link_to = models.CharField(
        choices=LINK_TO_CHOICES, default=LINK_TO_URL, max_length=32
    )
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
        return reverse("projects:update_event_position", kwargs={"pk": self.pk})

    def __str__(self):
        return self.screen.project.name


class ScreenComment(TimeStampedModel):
    x = models.IntegerField()
    y = models.IntegerField()

    screen = models.ForeignKey(ProjectScreen, on_delete=models.CASCADE)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)


class Comment(TimeStampedModel):
    text = models.TextField()
    comment = models.ForeignKey(
        ScreenComment, related_name="comment", on_delete=models.CASCADE
    )


class ProjectInvitation(TimeStampedModel):
    invitation_token = models.CharField(max_length=16)
    is_active = models.BooleanField(default=False)
    email = models.CharField(max_length=250)
    role = models.CharField(max_length=250, null=True, blank=True)

    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)

    @staticmethod
    def generate_token():
        return uuid.uuid4()


class ProjectMember(TimeStampedModel):
    STATUS_CREATOR = "creator"
    STATUS_MEMBER = "member"
    MEMBER_STATUS = ((STATUS_CREATOR, "CREATOR"), (STATUS_MEMBER, "MEMBER"))
    role = models.CharField(max_length=250, null=True, blank=True)
    status = models.CharField(
        choices=MEMBER_STATUS, default=STATUS_MEMBER, max_length=32
    )
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)

    def __str__(self):
        return self.project.name


class ProjectTask(TimeStampedModel):

    TASK_CREATED = "created"
    TASK_COMPLETED = "completed"
    TASK_STATUS = ((TASK_CREATED, "CREATED"), (TASK_COMPLETED, "COMPLETED"))

    title = models.CharField(max_length=250)
    description = models.TextField()
    status = models.CharField(choices=TASK_STATUS, default=TASK_CREATED, max_length=32)

    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    creator = models.ForeignKey(
        ProjectMember, related_name="creator", on_delete=models.CASCADE
    )
    owner = models.ForeignKey(
        ProjectMember, related_name="owner", on_delete=models.CASCADE
    )
    sub_task = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="subtask"
    )

    def __str__(self):
        return self.title


class TaskTime(TimeStampedModel):

    track_time = models.IntegerField(default=0)
    started = models.DateTimeField(blank=True)
    stoped = models.BooleanField(default=True)
    task = models.ForeignKey(ProjectTask, on_delete=models.CASCADE)
    member = models.ForeignKey(ProjectMember, on_delete=models.CASCADE)

    def __str__(self):
        return self.member.user.username


class ScreenAssignee(TimeStampedModel):
    screen = models.ForeignKey(ProjectScreen, on_delete=models.CASCADE)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username


class ProjectActivity(models.Model):
    TASK_CREATED = "task_created"
    CHAT_TASK_CREATED = "chat_task_created"
    TASK_REMOVED = "task_removed"
    ADDED_SCREEN = "screen_added"
    USER_INVITED = "user_invited"
    SHARED_PROTOTYPE = "shared_prototype"
    SCREEN_COMMENT = "screen_comment"
    ACTIVITY_TYPES = (
        (TASK_CREATED, "task created"),
        (TASK_REMOVED, "task completed"),
        (CHAT_TASK_CREATED, "task removed"),
        (ADDED_SCREEN, "screen added"),
        (USER_INVITED, "user invited"),
        (SHARED_PROTOTYPE, "shared prototype"),
        (SCREEN_COMMENT, "screen comment"),
    )
    type = models.CharField(
        choices=ACTIVITY_TYPES, default=TASK_CREATED, max_length=250
    )

    member = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, null=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.type


def get_screen_id(screenid):
    collection = db_main.projects_projectscreen
    id = collection.find_one({"details_id": screenid})["id"]
    return id


class ScreenScenario(TimeStampedModel):
    SCENARIO_TYPE_CHOICES = (
        (1, "login"),
        (2, "contact_info"),
        (3, "common_form"),
        (4, "common_scenario"),
    )

    scenario_type = models.PositiveSmallIntegerField(
        choices=SCENARIO_TYPE_CHOICES, default=4
    )

    screen = models.ForeignKey(
        ProjectScreen, related_name="screenscenario", on_delete=models.CASCADE
    )
    name = models.CharField(max_length=250)

    # Location
    x0 = models.IntegerField()
    y0 = models.IntegerField()
    x1 = models.IntegerField()
    y1 = models.IntegerField()

    def __str__(self):
        return "{}".format(self.pk)


class ScenarioElement(TimeStampedModel):
    HTML_ELEMENT_TYPE_CHOICES = (
        (1, "frame"),
        (2, "widget"),
        (3, "chart"),
        (4, "image"),
        (5, "button"),
        (6, "hyperlink"),
        (7, "paragraph"),
        (8, "textbox"),
        (9, "textarea"),
        (10, "textinput"),
        (11, "icon"),
        (12, "logo"),
        (13, "unordered_list"),
        (14, "ordered_list"),
        (15, "table"),
        (16, "ocrtext"),
        (17, "div"),
    )

    html_element_type = models.PositiveSmallIntegerField(
        choices=HTML_ELEMENT_TYPE_CHOICES, default=17
    )

    scenario = models.ForeignKey(
        ScreenScenario, related_name="scenarioelement", on_delete=models.CASCADE
    )
    details_id = models.CharField(max_length=32)
    name = models.CharField(max_length=250)
    # Location
    x0 = models.IntegerField()
    y0 = models.IntegerField()
    x1 = models.IntegerField()
    y1 = models.IntegerField()

    def __str__(self):
        return "{}".format(self.pk)
