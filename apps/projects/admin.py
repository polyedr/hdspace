from django.contrib import admin

from apps.projects.models import ScreenScenario, ScenarioElement, ElementComment, ProjectIllustrationSet, ProjectImage
from .models import *  # noqa

admin.site.register(ScreenEvent)
admin.site.register(ProjectScreen)
admin.site.register(Project)
admin.site.register(ScreenScenario)
admin.site.register(ScenarioElement)
admin.site.register(ProjectMember)
admin.site.register(ScreenAssignee)
admin.site.register(ProjectInvitation)
admin.site.register(ProjectActivity)
admin.site.register(ProjectTask)
admin.site.register(ProjectIllustrationSet)
admin.site.register(ProjectImage)
admin.site.register(TaskTime)
admin.site.register(Comment)
admin.site.register(ScreenComment)
admin.site.register(ElementComment)
