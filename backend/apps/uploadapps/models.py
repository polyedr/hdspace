from django.db import models
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
        User, on_delete=models.CASCADE, blank=True, null=True, related_name="owned_wpgs"
    )


class ObjectMove(models.Model):
    EXPORT = "export"
    IMPORT = "import"
    ACTION_TYPE = ((EXPORT, "EXPORT"), (IMPORT, "IMPORT"))

    SCENARIO = "scenario"
    SCREEN = "screen"
    PROJECT = "project"
    PROJECTIMAGE = "projectimage"
    PROJECTIMAGESET = "projectimageset"
    OBJECT_TYPE = (
        (SCENARIO, "SCENARIO"),
        (SCREEN, "SCREEN"),
        (PROJECT, "PROJECT"),
        (PROJECTIMAGE, "PROJECTIMAGE"),
        (PROJECTIMAGESET, "PROJECTIMAGESET"),
    )

    action = models.CharField(choices=ACTION_TYPE, default=EXPORT, max_length=32)

    object_type = models.CharField(choices=OBJECT_TYPE, default=SCENARIO, max_length=32)
    link = models.CharField(max_length=250, null=True, blank=True)

    # Parent id and type, it is important while importing
    parent_id = models.IntegerField(null=True, blank=True)

    # Object id defined while exporting and displayed while importing
    object_id = models.IntegerField(null=True, blank=True)
