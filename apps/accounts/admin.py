from django.contrib import admin

from .models import *  # noqa

admin.site.register(User)
admin.site.register(Profile)
# admin.site.register(TeamMember)
# admin.site.register(Team)
