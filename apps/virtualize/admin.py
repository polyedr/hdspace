from django.contrib import admin, auth

# Register your DataModels here.
from django.contrib.auth.admin import UserAdmin

from django.contrib.auth.models import User


admin.site.unregister(User)

@admin.register(User)
class UserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'get_group_permissions')

# admin.site.src.register(User, UserAdmin)