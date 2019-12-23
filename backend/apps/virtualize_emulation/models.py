from django.db import models
from apps.utils.models import TimeStampedModel
from apps.accounts.utils import utils

from apps.projects.models import ProjectScreen


class PreSegmentation(TimeStampedModel):
    screen = models.ForeignKey(
        ProjectScreen,
        related_name="presegmentation",
        on_delete=models.CASCADE,
        null=True,
    )
    image = models.ImageField(
        upload_to=utils.get_file_path, blank=True, null=True, max_length=256
    )

    def __str__(self):
        return "{}".format(self.pk)
