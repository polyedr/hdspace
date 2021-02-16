from django.contrib.auth.hashers import make_password
from factory.django import DjangoModelFactory
import factory

from apps.accounts.tests.accounts_factory import UserFactory
from apps.accounts.models import Profile, User
from apps.projects.models import *

class ProjectFactory(DjangoModelFactory):
    class Meta:
        model = Project

    user = UserFactory.create()
    name = factory.sequence(lambda n:"test project {}".format(n))
    status = Project.STATUS_PENDING