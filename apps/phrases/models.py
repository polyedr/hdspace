from django.db import models

from jsonfield import JSONField

# Create your models here.
from apps.accounts.models import User
from apps.utils.models import TimeStampedModel


class DescribedHTML(TimeStampedModel):
    sentence = models.CharField(max_length=250, null=True, blank=True)
    struct_type = models.CharField(max_length=250, null=True, blank=True)

    # Styles and parameters
    styles = JSONField(blank=True)
    parameters = JSONField(blank=True)
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="owned_descriptions",
    )
