from django.contrib.auth.hashers import make_password
from factory.django import DjangoModelFactory
import factory

from apps.accounts.models import *

class UserFactory(DjangoModelFactory):
    class Meta:
        model = User

    email = factory.Faker("ascii_free_email")
    username = email
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    password = make_password(factory.Faker("password"))

class ProfileFactory(DjangoModelFactory):
    class Meta:
        model = Profile

    approved = factory.Faker("boolean")
    role = Profile.ROLE_ADMINISTRATOR
    hourly_rate = factory.Faker("random_int")
    avatar = "String"
    user_id = factory.Faker("random_int")