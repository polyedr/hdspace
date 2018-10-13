from django.contrib import admin

from .models import *  # noqa

admin.site.register(Team)
admin.site.register(TeamMember)
