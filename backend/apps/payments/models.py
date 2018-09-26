from django.db import models
from django.urls import reverse
from django.contrib.auth.models import User

from core.models import TimeStampedModel


__all__ = (
    "Package",
)


class Package(TimeStampedModel):
    name = models.CharField(max_length=60)
    project = models.IntegerField()
    user = models.IntegerField()
    full_price = models.IntegerField()
    promotional = models.IntegerField()
    extra_project = models.IntegerField()
    tech_support = models.BooleanField(default=False)
    project_price = models.IntegerField()
    max_user_discount = models.IntegerField()

    def __str__(self):
        return self.name

    def get_package_url(self):
        return reverse(
            "payments:paypal",
            kwargs=dict(pk=self.pk),
        )


class UserSubscription(TimeStampedModel):
    active = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    package = models.ForeignKey(Package, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username
