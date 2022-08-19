import secrets
import uuid
from django.db import models
from mptt.models import MPTTModel, TreeForeignKey
from django.contrib.auth import get_user_model
from django.urls import reverse
from jsonfield import JSONField
from simple_history.models import HistoricalRecords
from taggit.managers import TaggableManager

from apps.utils.models import TimeStampedModel
from apps.accounts.utils import utils
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver

# from rest_framework import permissions  # Django-Gardian testing Custom Permission


__all__ = (
    "Project",
    "ProjectMember",
    "ProjectScreen",
    "ScreenEvent",
    "ColumnTask",
    "ProjectActivity",
    "ProjectInvitation",
    "ScreenAssignee",
    "TaskTime",
    "ScreenComment",
    "Comment",
)


class Roles:
    # external role should be project dependent
    EXTERNAL_ROLE_PROJECT_OWNER = "PROJECT OWNER"
    EXTERNAL_ROLE_PROJECT_MANAGER = "PROJECT MANAGER"
    EXTERNAL_ROLE_PRODUCT_MANAGER = "PRODUCT MANAGER"
    EXTERNAL_ROLE_BA = "BUSINESS ANALYST"
    EXTERNAL_ROLE_BACKEND_DEVELOPER = "BACKEND DEVELOPER"
    EXTERNAL_ROLE_FRONTEND_DEVELOPER = "FRONTEND DEVELOPER"
    EXTERNAL_ROLE_ANNOTATOR = "ANNOTATOR"
    EXTERNAL_ROLE_CONTENT_MANAGER = "CONTENT MANAGER"
    USER_EXTERNAL_ROLE = (
        (EXTERNAL_ROLE_PROJECT_OWNER, "Creates Projects"),
        (EXTERNAL_ROLE_PROJECT_MANAGER, "Is Project Mangers Planning Assistant"),
        (EXTERNAL_ROLE_PRODUCT_MANAGER, "Is Project Manager's Executive Assistant"),
        (EXTERNAL_ROLE_BA, "Can edit the project"),
        (EXTERNAL_ROLE_BACKEND_DEVELOPER, "Can apply backend constructor"),
        (EXTERNAL_ROLE_FRONTEND_DEVELOPER, "Can apply frontend constructor"),
        (EXTERNAL_ROLE_ANNOTATOR, "Can Annotate HTML elements and components"),
        (EXTERNAL_ROLE_CONTENT_MANAGER, "Can Manage contents from project text blocks"),
    )


class Project(TimeStampedModel):
    STATUS_PAID = "paid"
    STATUS_PENDING = "pending"
    STATUS_CHOICES = ((STATUS_PAID, "Paid"), (STATUS_PENDING, "Pending"))
    roles = Roles()
    # external_role = models.CharField(
    #     choices=roles.USER_EXTERNAL_ROLE, default="any", max_length=500
    # )
    name = models.CharField(max_length=250)
    preview = models.CharField(max_length=60)
    favicon = models.ImageField(
        upload_to=utils.get_file_path, blank=True, null=True, max_length=256
    )
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
        get_user_model(), related_name="members", through="ProjectMember", blank=True
    )

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    tags = TaggableManager(blank=True)

    project_data_text = models.TextField(blank=True)
    project_data_json = JSONField(blank=True, default=[])
    project_data_activity_json = JSONField(blank=True, default=[])
    project_data_zulip_json = JSONField(blank=True, default=[])
    project_data_trello_json = JSONField(blank=True, default=[])

    history = HistoricalRecords()

    @staticmethod
    def generate_preview_token():
        return secrets.token_urlsafe(16)

    def get_project_url(self):
        return reverse("projects:project", kwargs={"pk": self.pk})

    def __str__(self):
        return self.name

    # User needs to be part of a group that has the following permission:
    # Add custom permissions here
    class Meta:
        permissions = [
            ("assign_project", "Can Assign Projects"),
        ]


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
    buoyancy = models.IntegerField(null=True, blank=True)
    status = models.CharField(
        choices=SCREEN_STATUS, default=SCREEN_IN_PROGRESS, max_length=32
    )
    project = models.ForeignKey(
        Project, related_name="projectscreen", on_delete=models.CASCADE, null=True
    )

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    tags = TaggableManager(blank=True)

    image = models.ImageField(
        upload_to=utils.get_file_path, blank=True, null=True, max_length=256
    )

    screen_data_text = models.TextField(blank=True)
    screen_data_json = JSONField(blank=True, default=[])

    history = HistoricalRecords()

    def get_screen_url(self):
        return reverse(
            "projects:screen",
            kwargs={"project_id": self.project.id, "screen_id": self.pk},
        )

    def get_preview_url(self):
        return reverse(
            "projects:preview", kwargs={"token": self.project.preview, "pk": self.pk}
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
    project = models.ForeignKey(Project, related_name="projectmember", on_delete=models.CASCADE)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['project', 'user'], name='unique_membership')
        ]

    def __str__(self):
        return self.user.email


class ProjectColumn(TimeStampedModel):
    title = models.CharField(max_length=250)
    description = models.TextField(null=True, blank=True)
    project = models.ForeignKey(Project, related_name="projectcolumn", on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class ColumnTask(TimeStampedModel):
    TASK_INPROGRESS = "in progress"
    TASK_PAUSED = "paused"
    TASK_ACCEPTED = "accepted"
    TASK_WAITINGFORREVIEW = "waiting for review"
    TASK_STATUS = ((TASK_INPROGRESS, "INPROGRESS"), (TASK_PAUSED, "PAUSED"), (TASK_ACCEPTED, "ACCEPTED"), (TASK_WAITINGFORREVIEW, "WAITINGFORREVIEW"))

    TASK_MEDIUM = "medium"
    TASK_HIGHEST = "highest"
    TASK_HIGH = "high"
    TASK_LOW = "low"
    TASK_LOWEST = "lowest"
    TASK_PRIORITY = ((TASK_MEDIUM, "MEDIUM"), (TASK_HIGHEST, "HIGHEST"), (TASK_HIGH, "HIGH"), (TASK_LOW, "LOW"), (TASK_LOWEST, "LOWEST"))

    title = models.CharField(max_length=250)
    description = models.TextField(null=True, blank=True)
    status = models.CharField(choices=TASK_STATUS, default=TASK_INPROGRESS, max_length=32)
    priority = models.CharField(choices=TASK_PRIORITY, default=TASK_MEDIUM, max_length=32)
    tags = TaggableManager(blank=True)

    column = models.ForeignKey(ProjectColumn, related_name="columntask", on_delete=models.CASCADE)

    author = models.ForeignKey(get_user_model(), related_name="author", null=True, blank=True, on_delete=models.CASCADE)
    assignee = models.ForeignKey(get_user_model(), related_name="assignee", null=True, blank=True, on_delete=models.CASCADE)
    responsible = models.ForeignKey(
        get_user_model(), related_name="responsible", null=True, blank=True, on_delete=models.CASCADE
    )
    related_task = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="relatedtask"
    )
    story_points = models.IntegerField(default=0)
    due_date = models.DateField(auto_now_add=True)
    time = models.DurationField(null=True, blank=True)

    history = HistoricalRecords()

    def __str__(self):
        return self.title

    class Meta:  # Only people with the following permissions can work on this task.
        permissions = (
            ("Dummy permission 1", "Can do dummy action 1"),
            ("Dummy permission 2", "Can do dummy action 2"),
            ("Dummy permission 3", "Can do dummy action 3"),
            ("Dummy permission 4", "Can do dummy action 4"),
            ("Dummy permission 5", "Can do dummy action 5"),
        )


class ColumnTaskComment(TimeStampedModel):
    text = models.TextField()

    columntask = models.ForeignKey(ColumnTask, on_delete=models.CASCADE)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)


class TaskTime(TimeStampedModel):
    track_time = models.IntegerField(default=0)
    started = models.DateTimeField(blank=True)
    stoped = models.BooleanField(default=True)
    task = models.ForeignKey(ColumnTask, on_delete=models.CASCADE)
    member = models.ForeignKey(ProjectMember, on_delete=models.CASCADE)

    def __str__(self):
        return self.member.user.username


# List of illustrations saved
class ProjectIllustrationSet(TimeStampedModel):
    name = models.CharField(max_length=255)
    illustrationList = models.ImageField(
        upload_to="uploads/", blank=True, null=True, max_length=256
    )
    project = models.ForeignKey(Project, related_name="projectillustrationset", on_delete=models.CASCADE)


class ProjectImage(TimeStampedModel):
    image = models.ImageField(
        upload_to="uploads/", blank=True, null=True, max_length=256
    )
    palette = JSONField(blank=True)
    image_url = models.CharField(max_length=255, null=True, blank=True)
    illustration_set = models.ForeignKey(
        ProjectIllustrationSet, default=None, related_name="images", null=True, blank=True, on_delete=models.CASCADE
    )


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


class ScreenScenario(TimeStampedModel):
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
        choices=SCENARIO_TYPE_CHOICES, default=LOGIN, max_length=250, blank=True
    )

    SCENARIO = "scenario"
    BLOCK = "block"
    GROUP = "group"
    CONTAINER = "container"
    UNDEFINED = "undefined"

    SCENARIO_STRUCT_TYPE_CHOICES = (
        (SCENARIO, "scenario"),
        (BLOCK, "block"),
        (GROUP, "group"),
        (CONTAINER, "container"),
        (UNDEFINED, "undefined"),
    )

    struct_type = models.CharField(
        choices=SCENARIO_STRUCT_TYPE_CHOICES, default=SCENARIO, max_length=50
    )

    screen = models.ForeignKey(
        ProjectScreen,
        related_name="screenscenario",
        on_delete=models.CASCADE,
        null=True,
    )

    name = models.CharField(max_length=250)

    # Styles and parameters
    styles = JSONField(blank=True)
    parameters = JSONField(blank=True)

    # Image field
    image = models.ImageField(
        upload_to="uploads/", blank=True, null=True, max_length=256
    )

    # Parent id and type
    parent_id = models.IntegerField(null=True, blank=True)

    # Elements positioning
    VERTICAL = "vertical"
    HORIZONTAL = "horizontal"

    SCENARIO_DIRECTION_TYPE_CHOICES = (
        (VERTICAL, "vertical"),
        (HORIZONTAL, "horizontal"),
    )

    direction = models.CharField(
        choices=SCENARIO_DIRECTION_TYPE_CHOICES, default=VERTICAL, max_length=50
    )

    # Order of scenarios, or the scenario weight, buoyancy
    buoyancy = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return "{}".format(self.pk)


class ScenarioElement(MPTTModel, TimeStampedModel):
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
    LIST_ITEM = "list_item"
    TABLE = "table"
    OCRTEXT = "ocrtext"
    DIV = "div"
    UNDEFINED = "undefined"
    SELECT = "select"
    LABEL = "label"
    MAP = "map"
    CALENDAR = "calendar"
    CLOCK = "clock"
    CHECKBOX = "checkbox"
    RADIOBUTTON = "radiobutton"

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
        (SELECT, "select"),
        (LABEL, "label"),
        (MAP, "map"),
        (CALENDAR, "calendar"),
        (CLOCK, "clock"),
        (CHECKBOX, "checkbox"),
        (RADIOBUTTON, "radiobutton"),
    )

    struct_type = models.CharField(max_length=250)

    PHONE = "phone"
    PASSWORD = "password"
    EMAIL = "email"
    FIRSTNAME = "firstname"
    LASTNAME = "lastname"
    USERNAME = "username"
    END_COMPOSITE_SCENARIO = "end_composite_scenario"
    END_SIMPLE_SCENARIO = "end_simple_scenario"
    TITLE = "title"
    DESCRIPTION = "description"
    DAY = "day"
    MONTH = "month"
    YEAR = "year"
    WIDGET = "widget"
    MAP = "map"
    CALENDAR = "calendar"
    CLOCK = "clock"
    CHECKBOX = "checkbox"
    RADIOBUTTON = "radiobutton"

    ELEMENTS_TYPE_CHOICES = (
        (PHONE, "phone"),
        (PASSWORD, "password"),
        (EMAIL, "email"),
        (FIRSTNAME, "firstname"),
        (LASTNAME, "lastname"),
        (USERNAME, "username"),
        (END_COMPOSITE_SCENARIO, "end_composite_scenario"),
        (END_SIMPLE_SCENARIO, "end_simple_scenario"),
        (TITLE, "title"),
        (DESCRIPTION, "description"),
        (DAY, "day"),
        (MONTH, "month"),
        (YEAR, "year"),
        (WIDGET, "widget"),
        (IMAGE, "image"),
        (UNDEFINED, "undefined"),
        (LABEL, "label"),
        (MAP, "map"),
        (CALENDAR, "calendar"),
        (CLOCK, "clock"),
        (CHECKBOX, "checkbox"),
        (RADIOBUTTON, "radiobutton"),
    )

    # func_type = models.CharField(
    #     choices=ELEMENTS_TYPE_CHOICES, default=UNDEFINED, max_length=250
    # )
    func_type = models.CharField(max_length=250)

    # Elements positioning
    VERTICAL = "vertical"
    HORIZONTAL = "horizontal"

    SCENARIO_DIRECTION_TYPE_CHOICES = (
        (VERTICAL, "vertical"),
        (HORIZONTAL, "horizontal"),
    )

    direction = models.CharField(
        choices=SCENARIO_DIRECTION_TYPE_CHOICES,
        default=VERTICAL,
        max_length=50,
        null=True,
    )

    scenario = models.ForeignKey(
        ScreenScenario, related_name="elements", on_delete=models.CASCADE, null=True
    )

    parent = TreeForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="children"
    )

    name = models.CharField(max_length=250, null=True)

    # Styles and parameters
    styles = JSONField(blank=True)
    parameters = JSONField(blank=True)

    # Order of elements, or the element weight, buoyancy
    buoyancy = models.IntegerField(null=True)

    # Image field
    image = models.ImageField(
        upload_to="uploads/", blank=True, null=True, max_length=256
    )

    # Sharing the element flag
    shared = models.BooleanField(default=False, null=True)

    def __str__(self):
        return "{}".format(self.pk)

    class MPTTMeta:
        level_attr = "mptt_level"


class ElementComment(TimeStampedModel):
    text = models.TextField()
    element = models.ForeignKey(ScenarioElement, on_delete=models.CASCADE)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)


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
                "buoyancy",
                "image",
                "parameters",
                "styles",
        ):
            setattr(self, field, kwargs.get(field, None))


elements = {
    1: Element(
        id=1,
        struct_type="frame",
        func_type=["undefined"],
        buoyancy=[0],
        image="null",
        parameters=[],
        styles=[],
    ),
    2: Element(
        id=2,
        struct_type="widget",
        func_type=["image"],
        buoyancy=[0],
        image="null",
        parameters=[],
        styles=[{"width": "80px", "height": "80px"}],
    ),
    3: Element(
        id=3,
        struct_type="chart",
        func_type=["undefined"],
        buoyancy=[0],
        image="null",
        parameters=[],
        styles=[],
    ),
    4: Element(
        id=4,
        struct_type="image",
        func_type=["undefined"],
        buoyancy=[0],
        image="null",
        parameters=[],
        styles=[{"width": "80px", "height": "80px"}],
    ),
    5: Element(
        id=5,
        struct_type="button",
        func_type=["end_composite_scenario", "end_simple_scenario"],
        buoyancy=[1, 0],
        image="null",
        parameters=[{"group": "button"}],
        styles=[{"width": "64px", "height": "36px"}],
    ),
    6: Element(
        id=6,
        struct_type="hyperlink",
        func_type=["end_simple_scenario"],
        buoyancy=[2],
        image="null",
        parameters=[{"group": "other"}],
        styles=[{"width": "50px", "height": "25px"}],
    ),
    7: Element(
        id=7,
        struct_type="paragraph",
        func_type=["undefined"],
        buoyancy=[0],
        image="null",
        parameters=[],
        styles=[],
    ),
    8: Element(
        id=8,
        struct_type="textbox",
        func_type=["undefined"],
        buoyancy=[0],
        image="null",
        parameters=[],
        styles=[],
    ),
    9: Element(
        id=9,
        struct_type="textarea",
        func_type=["undefined"],
        buoyancy=[0],
        image="null",
        parameters=[],
        styles=[],
    ),
    10: Element(
        id=10,
        struct_type="textinput",
        func_type=["email", "phone", "username", "firstname", "lastname", "password"],
        buoyancy=[95, 86, 65, 64, 61, 10],
        image="null",
        parameters=[
            {"group": "input", "placeholder": "Email"},
            {"group": "input", "placeholder": "Phone"},
            {
                "group": "input",
                "placeholder": "Username",
                "tags": "#username_horizontal",
            },
            {
                "group": "input",
                "placeholder": "First name",
                "tags": "#username_horizontal",
            },
            {
                "group": "input",
                "placeholder": "Last name",
                "tags": "#username_horizontal",
            },
            {"group": "input", "placeholder": "Password"},
        ],
        styles=[
            {"width": "280px", "height": "56px"},
            {"width": "280px", "height": "56px"},
            {"width": "280px", "height": "56px"},
            {"width": "280px", "height": "56px"},
            {"width": "280px", "height": "56px"},
            {"width": "280px", "height": "56px"},
        ],
    ),
    11: Element(
        id=11,
        struct_type="icon",
        func_type=["undefined"],
        buoyancy=[0],
        image="null",
        parameters=[],
        styles=[],
    ),
    12: Element(
        id=12,
        struct_type="logo",
        func_type=["undefined"],
        buoyancy=[0],
        image="null",
        parameters=[],
        styles=[],
    ),
    13: Element(
        id=13,
        struct_type="unordered_list",
        func_type=["undefined"],
        buoyancy=[0],
        image="null",
        parameters=[],
        styles=[],
    ),
    14: Element(
        id=14,
        struct_type="ordered_list",
        func_type=["undefined"],
        buoyancy=[0],
        image="null",
        parameters=[],
        styles=[],
    ),
    15: Element(
        id=15,
        struct_type="table",
        func_type=["undefined"],
        buoyancy=[0],
        image="null",
        parameters=[],
        styles=[],
    ),
    16: Element(
        id=16,
        struct_type="ocrtext",
        func_type=["title", "description", "label"],
        buoyancy=[100, 98, 0],
        image="null",
        parameters=[{"group": "other"}, {"group": "other"}, {"group": "other"}],
        styles=[
            {"width": "100px", "height": "40px"},
            {"width": "100px", "height": "40px"},
            {"width": "100px", "height": "40px"},
        ],
    ),
    17: Element(
        id=17,
        struct_type="div",
        func_type=["undefined"],
        buoyancy=[0],
        image="null",
        parameters=[],
        styles=[],
    ),
    18: Element(
        id=18,
        struct_type="undefined",
        func_type=["undefined"],
        buoyancy=[0],
        image="null",
        parameters=[],
        styles=[],
    ),
    19: Element(
        id=19,
        struct_type="select",
        func_type=["day", "month", "year"],
        buoyancy=[54, 54, 54],
        image="null",
        parameters=[
            {"group": "select", "tags": "#date_horizontal"},
            {"group": "select", "tags": "#date_horizontal"},
            {"group": "select", "tags": "#date_horizontal"},
        ],
        styles=[
            {"width": "50px", "height": "25px"},
            {"width": "50px", "height": "25px"},
            {"width": "50px", "height": "25px"},
        ],
    ),
    20: Element(
        id=20,
        struct_type="map",
        func_type=["map"],
        buoyancy=[0],
        image="null",
        parameters=[{"group": "widget"}],
        styles=[{"width": "500px", "height": "250px"}],
    ),
    21: Element(
        id=21,
        struct_type="calendar",
        func_type=["calendar"],
        buoyancy=[0],
        image="null",
        parameters=[{"group": "widget"}],
        styles=[{"width": "350px", "height": "300px"}],
    ),
    22: Element(
        id=22,
        struct_type="clock",
        func_type=["clock"],
        buoyancy=[0],
        image="null",
        parameters=[{"group": "widget"}],
        styles=[{"width": "150px", "height": "150px"}],
    ),
    23: Element(
        id=23,
        struct_type="checkbox",
        func_type=["checkbox"],
        buoyancy=[0],
        image="null",
        parameters=[],
        styles=[{"width": "16px", "height": "16px"}],
    ),
    24: Element(
        id=24,
        struct_type="radiobutton",
        func_type=["radiobutton"],
        buoyancy=[0],
        image="null",
        parameters=[],
        styles=[{"width": "16px", "height": "16px"}],
    ),
    25: Element(
        id=25,
        struct_type="list_item",
        func_type=["undefined"],
        buoyancy=[0],
        image="null",
        parameters=[],
        styles=[],
    ),
}


""" Whenever ANY model is deleted, if it has a file field on it, delete the associated file too"""


@receiver(post_delete)
def delete_files_when_row_deleted_from_db(sender, instance, **kwargs):
    for field in sender._meta.concrete_fields:
        if isinstance(field, models.FileField):
            instance_file_field = getattr(instance, field.name)
            delete_file_if_unused(sender, instance, field, instance_file_field)


""" Delete the file if something else get uploaded in its place"""


@receiver(pre_save)
def delete_files_when_file_changed(sender, instance, **kwargs):
    # Don't run on initial save
    if not instance.pk:
        return
    for field in sender._meta.concrete_fields:
        if isinstance(field, models.FileField):
            # its got a file field. Let's see if it changed
            try:
                instance_in_db = sender.objects.get(pk=instance.pk)
            except sender.DoesNotExist:
                # We are probably in a transaction and the PK is just temporary
                # Don't worry about deleting attachments if they aren't actually saved yet.
                return
            instance_in_db_file_field = getattr(instance_in_db, field.name)
            instance_file_field = getattr(instance, field.name)
            if instance_in_db_file_field.name != instance_file_field.name:
                delete_file_if_unused(sender, instance, field, instance_in_db_file_field)


""" Only delete the file if no other instances of that model are using it"""


def delete_file_if_unused(model, instance, field, instance_file_field):
    dynamic_field = {}
    dynamic_field[field.name] = instance_file_field.name
    other_refs_exist = model.objects.filter(**dynamic_field).exclude(pk=instance.pk).exists()
    if not other_refs_exist:
        instance_file_field.delete(False)
