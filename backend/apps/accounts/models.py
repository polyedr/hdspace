import uuid
import datetime

from django.urls import reverse
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.staticfiles.templatetags.staticfiles import static
from django.core.cache import cache
from django.conf import settings

from apps.utils.models import TimeStampedModel
from .utils import utils

__all__ = ("User", "Profile", "Team", "TeamMember")

'''
# The abstract class converts MongoDB _id to the integer with auto-incremented value
# Not for the Postgres
class MongoModel(models.Model):
    id = models.IntegerField(primary_key=True)

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if self.id is None:
            self.id = self.__get_id()
        super(MongoModel, self).save(*args, **kwargs)

    def __get_id(self):
        name = self.__class__.__name__
        if not db_main.sequences.find_one(dict(name=name)):
            db_main.sequences.insert_one(dict(name=name, next_id=1))
            return 0
        else:
            sq = db_main.sequences.find_one_and_update(
                {"name": name}, {"$inc": {"next_id": 1}}
            )
            return sq["next_id"]
'''


class User(AbstractUser):
    pass


class Profile(TimeStampedModel):
    ROLE_DESIGNER = "Designer"
    ROLE_DEVELOPER = "Developer"
    ROLE_ADMINISTRATOR = "Administrator"
    ROLE_MARKETING = "Marketing"
    ROLE_EXPERT = "Expert"
    ROLE_COMMUNICATION = "Communication"
    USER_ROLE = (
        (ROLE_DESIGNER, "DESIGNER"),
        (ROLE_DEVELOPER, "DEVELOPER"),
        (ROLE_ADMINISTRATOR, "ADMINISTRATOR"),
        (ROLE_MARKETING, "MARKETING"),
        (ROLE_EXPERT, "EXPERT"),
        (ROLE_COMMUNICATION, "COMMUNICATION"),
    )
    email_confirmation_token = models.CharField(
        max_length=64, editable=False, null=True
    )
    reset_password_token = models.CharField(max_length=64, editable=False, null=True)
    invitation_token = models.CharField(max_length=64, editable=False, null=True)
    avatar = models.ImageField(upload_to=utils.get_file_path, blank=True, null=True)
    approved = models.BooleanField(default=False)
    role = models.CharField(choices=USER_ROLE, default=ROLE_DESIGNER, max_length=32)
    hourly_rate = models.IntegerField(default=0)
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

    def get_image(self) -> str:
        if not self.avatar:
            return static("/img/profile_empty.png")
        return self.avatar.url

    @staticmethod
    def generate_token() -> uuid:
        return uuid.uuid4()

    def last_seen(self):
        return cache.get("seen_%s" % self.user.username)

    def online(self):
        if self.last_seen():
            now = datetime.datetime.now()
            if now > self.last_seen() + datetime.timedelta(
                seconds=settings.USER_ONLINE_TIMEOUT
            ):
                return False
            else:
                return True
        else:
            return False

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"


class TeamMember(TimeStampedModel):

    ROLE_ADMIN = "admin"
    ROLE_MEMBER = "member"
    MEMBER_ROLE = ((ROLE_ADMIN, "ADMIN"), (ROLE_MEMBER, "MEMBER"))

    charge = models.DecimalField(max_digits=10, decimal_places=2)
    time_log = models.DecimalField(max_digits=10, decimal_places=2)
    position = models.CharField(max_length=250)
    date_joined = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=False)
    role = models.CharField(choices=MEMBER_ROLE, default=ROLE_MEMBER, max_length=32)

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.get_full_name()


class Team(TimeStampedModel):
    description = models.TextField()
    logo = models.ImageField(upload_to=utils.get_file_path, blank=True)
    team_name = models.CharField(max_length=250)
    available = models.BooleanField(default=False)

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    members = models.ManyToManyField(TeamMember)

    def get_image(self) -> str:
        return self.logo.url

    def __str__(self):
        return self.team_name
