from django.contrib import admin

from .models import *  # noqa

admin.site.register(ScreenEvent)
admin.site.register(ProjectScreen)
admin.site.register(ProjectMember)
admin.site.register(Project)
