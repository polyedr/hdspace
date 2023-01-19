from django.db import models


# Create your models here.
from apps.accounts.models import User


class Fileupload(models.Model):
    filename = models.FileField(
        upload_to="uploads/", blank=True, null=True, max_length=256
    )
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="owned_files",
    )

    def __str__(self):
        return self.filename.name


class WebpageSaved(models.Model):
    wpname = models.FileField(
        upload_to="uploads/", blank=True, null=True, max_length=256
    )
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="owned_webpages",
    )

    def __str__(self):
        return self.wpname.name


class WpgSaved(models.Model):
    wpname = models.CharField(max_length=250, null=True, blank=True)
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="owned_wpgs",
    )


class ObjectsMove(models.Model):
    wpname = models.CharField(max_length=250, null=True, blank=True)
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="owned_objects_moved",
    )
