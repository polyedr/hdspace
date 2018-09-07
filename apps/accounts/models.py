import uuid

from django.urls import reverse
from django.db import models
from django.contrib.auth.models import User

from core.models import TimeStampedModel
from .utils import utils

__all__ = (
    "Profile",
)


class Profile(TimeStampedModel):
    email_confirmation_token = models.CharField(max_length=64, editable=False, null=True)
    reset_password_token = models.CharField(max_length=64, editable=False, null=True)
    avatar = models.ImageField(upload_to=utils.get_file_path, blank=True)

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def get_confirmation_url(self) -> str:
        return reverse(
            "accounts:confirmation",
            kwargs=dict(confirmation_token=self.email_confirmation_token),
        )

    def get_reset_password_url(self) -> str:
        return reverse(
            "accounts:reset_password",
            kwargs=dict(reset_token=self.reset_password_token),
        )

    @staticmethod
    def generate_token() -> uuid:
        return uuid.uuid4()

    def __str__(self):
        return self.user.email
