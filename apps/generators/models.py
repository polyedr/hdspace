from django.db import models

# Create your models here.
from jsonfield import JSONField
from mptt.fields import TreeForeignKey
from mptt.models import MPTTModel

from apps.projects.models import ScreenScenario
from apps.utils.models import TimeStampedModel


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
