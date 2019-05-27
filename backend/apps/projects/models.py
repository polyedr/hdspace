import collections
import secrets
import uuid
from collections import OrderedDict

import pymongo

from django.db import models
from django.contrib.auth import get_user_model
from django.urls import reverse
from jsonfield import JSONField

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
    image = models.ImageField(
        upload_to=utils.get_file_path, blank=True, null=True, max_length=256
    )

    # Screen data should be replaced with JSON field further to save DOM

    # screen_data_char = models.CharField(max_length=1000, blank=True)
    screen_data_text = models.TextField(blank=True)
    screen_data_json = JSONField(blank=True)

    # screen_data_list = ListField(default = [])
    # screen_data_dict = DictField(default = {})
    # screen_data_formless = FormlessField(null=True)
    # screen_data_embeddeddict = EmbeddedDictField(default = {})
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
    from apps.virtualize_emulation.models import PreSegmentation

    LOGIN = "login"
    CONTACT_INFO = "contact_info"
    COMMON_FORM = "common_form"
    COMMON_SCENARIO = "common_scenario"
    SCENARIO_TYPE_CHOICES = (
        (LOGIN, "login"),
        (CONTACT_INFO, "contact_info"),
        (COMMON_FORM, "common_form"),
        (COMMON_SCENARIO, "common_scenario"),
    )

    type = models.CharField(
        choices=SCENARIO_TYPE_CHOICES, default=LOGIN, max_length=250
    )

    screen = models.ForeignKey(
        ProjectScreen,
        related_name="screenscenario",
        on_delete=models.CASCADE,
        null=True,
    )
    presegmentation = models.ForeignKey(
        PreSegmentation, related_name="scenarios", on_delete=models.CASCADE, null=True
    )

    name = models.CharField(max_length=250)

    # Styles and parameters
    styles = JSONField(blank=True)
    parameters = JSONField(blank=True)

    # Order of scenarios, or the scenario weight, buoyancy
    buoyancy = models.IntegerField(null=True, blank=True)

    """
    # Size
    scenario_height = models.IntegerField(null=True)
    scenario_width = models.IntegerField(null=True)
    # Location
    x0 = models.IntegerField()
    y0 = models.IntegerField()
    x1 = models.IntegerField()
    y1 = models.IntegerField()
    """

    def __str__(self):
        return "{}".format(self.pk)


class ScenarioElement(TimeStampedModel):
    FRAME = "frame"
    WIDGET = "widget"
    CHART = "chart"
    IMAGE = "image"
    BUTTON = "button"
    HYPERLINK = "hyperlink"
    PARAGRAPH = "paragraph"
    TEXTBOX = "textbox"
    TEXTAREA = "textarea"
    TEXTINPUT = "textinput"
    ICON = "icon"
    LOGO = "logo"
    UNORDERED_LIST = "unordered_list"
    ORDERED_LIST = "ordered_list"
    TABLE = "table"
    OCRTEXT = "ocrtext"
    DIV = "div"
    UNDEFINED = "undefined"
    HTML_ELEMENT_TYPE_CHOICES = (
        (FRAME, "frame"),
        (WIDGET, "widget"),
        (CHART, "chart"),
        (IMAGE, "image"),
        (BUTTON, "button"),
        (HYPERLINK, "hyperlink"),
        (PARAGRAPH, "paragraph"),
        (TEXTBOX, "textbox"),
        (TEXTAREA, "textarea"),
        (TEXTINPUT, "textinput"),
        (ICON, "icon"),
        (LOGO, "logo"),
        (UNORDERED_LIST, "unordered_list"),
        (ORDERED_LIST, "ordered_list"),
        (TABLE, "table"),
        (OCRTEXT, "ocrtext"),
        (DIV, "div"),
        (UNDEFINED, "undefined"),
    )

    struct_type = models.CharField(
        choices=HTML_ELEMENT_TYPE_CHOICES, default=DIV, max_length=250
    )

    PHONE = "phone"
    PASSWORD = "password"
    EMAIL = "email"
    FIRSTNAME = "firstname"
    LASTNAME = "lastname"
    END_COMPOSITE_SCENARIO = "end_composite_scenario"
    END_SIMPLE_SCENARIO = "end_simple_scenario"
    TITLE = "title"
    DESCRIPTION = "description"
    DAY = "day"
    MONTH = "month"
    YEAR = "year"
    WIDGET = "widget"
    # UNDEFINED = "undefined"
    ELEMENTS_TYPE_CHOICES = (
        (PHONE, "phone"),
        (PASSWORD, "password"),
        (EMAIL, "email"),
        (FIRSTNAME, "firstname"),
        (LASTNAME, "lastname"),
        (END_COMPOSITE_SCENARIO, "end_composite_scenario"),
        (END_SIMPLE_SCENARIO, "end_simple_scenario"),
        (TITLE, "title"),
        (DESCRIPTION, "description"),
        (DAY, "day"),
        (MONTH, "month"),
        (YEAR, "year"),
        (WIDGET, "widget"),
        (UNDEFINED, "undefined"),
    )

    func_type = models.CharField(
        choices=ELEMENTS_TYPE_CHOICES, default=UNDEFINED, max_length=250
    )

    FTH1 = "fth1"
    FTH2 = "fth2"
    FTH3 = "fth2"
    ELEMENTS_TYPE_CHOICES = (
        (FTH1, "fth1"),
        (FTH2, "fth2"),
        (FTH3, "fth3"),
        (UNDEFINED, "undefined"),
    )

    func_type_human = models.CharField(
        choices=ELEMENTS_TYPE_CHOICES, default=UNDEFINED, max_length=250
    )

    scenario = models.ForeignKey(
        ScreenScenario, related_name="elements", on_delete=models.CASCADE, null=True
    )
    # details_id = models.CharField(max_length=32)
    name = models.CharField(max_length=250, null=True)

    # Styles and parameters
    styles = JSONField(blank=True)
    parameters = JSONField(blank=True)

    # Order of elements, or the element weight, buoyancy
    buoyancy = models.IntegerField(null=True)

    def __str__(self):
        return "{}".format(self.pk)


# Non-model model to expose the scenario library
class Scenario(object):
    def __init__(self, **kwargs):
        for field in ("id", "type"):
            setattr(self, field, kwargs.get(field, None))


scenarios = {
    1: Scenario(id=1, type="login"),
    2: Scenario(id=2, type="contact_info"),
    3: Scenario(id=3, type="common_form"),
    4: Scenario(id=4, type="common_scenario"),
}


# Non-model model to expose the elements library
class Element(object):
    def __init__(self, **kwargs):
        for field in (
            "id",
            "struct_type",
            "func_type",
            "func_type_human",
            "buoyancy",
            "parameters",
            "styles",
        ):
            setattr(self, field, kwargs.get(field, None))


elements = {
    1: Element(
        id=1,
        struct_type="frame",
        func_type=[],
        func_type_human=[],
        buoyancy=[],
        parameters=[],
        styles=[],
    ),
    2: Element(
        id=2,
        struct_type="widget",
        func_type=[],
        func_type_human=[],
        buoyancy=[],
        parameters=[],
        styles=[{"width": 80, "height": 80}],
    ),
    3: Element(
        id=3,
        struct_type="chart",
        func_type=[],
        func_type_human=[],
        buoyancy=[],
        parameters=[],
        styles=[],
    ),
    4: Element(
        id=4,
        struct_type="image",
        func_type=[],
        func_type_human=[],
        buoyancy=[],
        parameters=[],
        styles=[{"width": 80, "height": 80}],
    ),
    5: Element(
        id=5,
        struct_type="button",
        func_type=["end_composite_scenario", "end_simple_scenario"],
        func_type_human=["undefined", "undefined"],
        buoyancy=[1, 0],
        parameters=[{"group": "other"}, {"group": "other"}],
        styles=[{"width": 64, "height": 36}],
    ),
    6: Element(
        id=6,
        struct_type="hyperlink",
        func_type=["end_simple_scenario"],
        func_type_human=["undefined"],
        buoyancy=[2],
        parameters=[{"group": "other"}],
        styles=[{"width": 50, "height": 25}],
    ),
    7: Element(
        id=7,
        struct_type="paragraph",
        func_type=[],
        func_type_human=[],
        buoyancy=[],
        parameters=[],
        styles=[],
    ),
    8: Element(
        id=8,
        struct_type="textbox",
        func_type=[],
        func_type_human=[],
        buoyancy=[],
        parameters=[],
        styles=[],
    ),
    9: Element(
        id=9,
        struct_type="textarea",
        func_type=[],
        func_type_human=[],
        buoyancy=[],
        parameters=[],
        styles=[],
    ),
    10: Element(
        id=10,
        struct_type="textinput",
        func_type=["email", "phone", "firstname", "lastname", "password"],
        func_type_human=[
            "undefined",
            "undefined",
            "undefined",
            "undefined",
            "undefined",
        ],
        buoyancy=[95, 86, 64, 61, 10],
        parameters=[
            {"group": "input", "placeholder": "Email"},
            {"group": "input", "placeholder": "Phone"},
            {"group": "input", "placeholder": "First name", "tags": "#username"},
            {"group": "input", "placeholder": "Last name", "tags": "#username"},
            {"group": "input", "placeholder": "Password"},
        ],
        styles=[
            {"width": 280, "height": 56},
            {"width": 280, "height": 56},
            {"width": 280, "height": 56},
            {"width": 280, "height": 56},
            {"width": 280, "height": 56},
        ],
    ),
    11: Element(
        id=11,
        struct_type="icon",
        func_type=[],
        func_type_human=[],
        buoyancy=[],
        parameters=[],
        styles=[],
    ),
    12: Element(
        id=12,
        struct_type="logo",
        func_type=[],
        func_type_human=[],
        buoyancy=[],
        parameters=[],
        styles=[],
    ),
    13: Element(
        id=13,
        struct_type="unordered_list",
        func_type=[],
        func_type_human=[],
        buoyancy=[],
        parameters=[],
        styles=[],
    ),
    14: Element(
        id=14,
        struct_type="ordered_list",
        func_type=[],
        func_type_human=[],
        buoyancy=[],
        parameters=[],
        styles=[],
    ),
    15: Element(
        id=15,
        struct_type="table",
        func_type=[],
        func_type_human=[],
        buoyancy=[],
        parameters=[],
        styles=[],
    ),
    16: Element(
        id=16,
        struct_type="ocrtext",
        func_type=["title", "description", "label"],
        func_type_human=["undefined", "undefined", "undefined"],
        buoyancy=[100, 98, 0],
        parameters=[{"group": "other"}, {"group": "other"}, {"group": "other"}],
        styles=[
            {"width": 100, "height": 40},
            {"width": 100, "height": 40},
            {"width": 100, "height": 40},
        ],
    ),
    17: Element(
        id=17,
        struct_type="div",
        func_type=[],
        func_type_human=[],
        buoyancy=[],
        parameters=[],
        styles=[],
    ),
    18: Element(
        id=18,
        struct_type="undefined",
        func_type=[],
        func_type_human=[],
        buoyancy=[],
        parameters=[],
        styles=[],
    ),
    19: Element(
        id=19,
        struct_type="select",
        func_type=["day", "month", "year"],
        func_type_human=["undefined", "undefined", "undefined"],
        buoyancy=[54, 54, 54],
        parameters=[
            {"group": "select", "tags": "#date"},
            {"group": "select", "tags": "#date"},
            {"group": "select", "tags": "#date"},
        ],
        styles=[
            {"width": 50, "height": 25},
            {"width": 50, "height": 25},
            {"width": 50, "height": 25},
        ],
    ),
}
