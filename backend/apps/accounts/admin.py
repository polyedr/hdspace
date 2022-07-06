from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import *  # noqa


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'
    fk_name = 'user'


class MyUserAdmin(UserAdmin):
    # Adding inline profiles
    inlines = (ProfileInline,)
    # override the default sort column
    ordering = ("date_joined",)
    # if you want the date they joined or other columns displayed in the list,
    # override list_display too
    list_display = (
        "username",
        "email",
        "date_joined",
        "last_login",
        "first_name",
        "last_name",
        "is_active",
        "is_staff",
        "is_superuser",
    )
    def get_inline_instances(self, request, obj=None):
        if not obj:
            return list()
        return super(MyUserAdmin, self).get_inline_instances(request, obj)


# finally replace the default UserAdmin with yours
admin.site.register(User, MyUserAdmin)
admin.site.register(Profile)
# admin.site.register(TeamMember)
# admin.site.register(Team)
