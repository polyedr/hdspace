from django.db import models
from django.db.models import JSONField

from apps.accounts.models import User
from apps.utils.models import TimeStampedModel


class DescribedHTML(TimeStampedModel):
    sentence = models.CharField(max_length=250, null=True, blank=True)
    struct_type = models.CharField(max_length=250, null=True, blank=True)

    styles = JSONField(blank=True, default=dict)
    parameters = JSONField(blank=True, default=dict)
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="owned_descriptions",
    )
