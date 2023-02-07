from django.contrib import admin
from guardian.admin import GuardedModelAdmin
from mptt.admin import MPTTModelAdmin
from simple_history.admin import SimpleHistoryAdmin


from apps.projects.models import ScreenScenario, ScenarioElement, ElementComment, ProjectIllustrationSet, \
    ProjectImage, ProjectColumn, ColumnTaskCheckitem, ColumnTaskCustomTag, ColumnTaskLabel, PCategory
from .models import *  # noqa

class ScenarioElementAdmin(MPTTModelAdmin):
    exclude = ('parent',)

# admin.site.register(Project, GuardedModelAdmin)
admin.site.register(Project, SimpleHistoryAdmin)
admin.site.register(PCategory)
# admin.site.register(ScreenEvent)
admin.site.register(ProjectScreen)
admin.site.register(ScreenScenario)
admin.site.register(ScenarioElement, ScenarioElementAdmin)
admin.site.register(ProjectMember)
# admin.site.register(ScreenAssignee)
# admin.site.register(ProjectInvitation)
# admin.site.register(ProjectActivity)
admin.site.register(ProjectColumn)
admin.site.register(ColumnTask)
admin.site.register(ColumnTaskCheckitem)
admin.site.register(ProjectIllustrationSet)
admin.site.register(ProjectImage)
# admin.site.register(TaskTime)
# admin.site.register(Comment)
# admin.site.register(ScreenComment)
admin.site.register(ElementComment)
# admin.site.register(ColumnTaskCustomTag)
admin.site.register(ColumnTaskLabel)


