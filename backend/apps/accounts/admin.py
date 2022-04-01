from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import *  # noqa


class MyUserAdmin(UserAdmin):
    # override the default sort column
    ordering = ('date_joined', )
    # if you want the date they joined or other columns displayed in the list,
    # override list_display too
    list_display = ('username', 'email', 'date_joined', 'last_login', 'first_name', 'last_name', 'is_staff')

# finally replace the default UserAdmin with yours
admin.site.register(User, MyUserAdmin)
admin.site.register(Profile)
# admin.site.register(TeamMember)
# admin.site.register(Team)
