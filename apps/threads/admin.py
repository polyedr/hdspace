from django.contrib import admin

from .models import *  # noqa

admin.site.register(Thread)
admin.site.register(UserThread)
admin.site.register(Message)
