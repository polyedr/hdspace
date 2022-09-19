from django.db import models
from model_clone import CloneMixin


__all__ = (
    "TimeStampedModel",
)


class TimeStampedModel(CloneMixin, models.Model):
    """
    An abstract base class model that provides self-updating
    ``created`` and ``modified`` fields.
    """
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
