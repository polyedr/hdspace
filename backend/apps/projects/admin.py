from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from apps.projects.models import (
    ScreenScenario,
    ScenarioElement,
    ElementComment,
    ProjectIllustrationSet,
    ProjectImage,
    ProjectColumn,
    ColumnTaskCheckitem,
    ColumnTaskCustomTag,
    ColumnTaskLabel,
    PCategory,
)
from .models import *  # noqa


class ScenarioElementAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "struct_type", "parent", "scenario")
    list_filter = ("struct_type",)
    search_fields = ("name", "struct_type")


admin.site.register(Project, SimpleHistoryAdmin)
admin.site.register(PCategory)
admin.site.register(ProjectScreen)
admin.site.register(ScreenScenario)
admin.site.register(ScenarioElement, ScenarioElementAdmin)
admin.site.register(ProjectMember)
admin.site.register(ProjectColumn)
admin.site.register(ColumnTask)
admin.site.register(ColumnTaskCheckitem)
admin.site.register(ProjectIllustrationSet)
admin.site.register(ProjectImage)
admin.site.register(ColumnTaskCustomTag)
admin.site.register(ColumnTaskLabel)
admin.site.register(ElementComment)
