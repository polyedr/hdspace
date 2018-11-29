from django.contrib import admin

from .models import Package, UserSubscription

admin.site.register(Package)
admin.site.register(UserSubscription)
