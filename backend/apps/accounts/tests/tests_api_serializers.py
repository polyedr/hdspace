from rest_framework.test import APITestCase

from apps.accounts.models import Profile, User
from apps.accounts.serializers import ProfileSerializer, UserSerializer
from django.contrib.auth.hashers import make_password


class UserAPITest(APITestCase):
    def setUp(self):
        self.user_attributes = {
            "is_active": True,
            "username": "cnmbj8d",
            "first_name": "Nelly",
            "last_name": "Li",
            "email": "q1210201368@gmail.com",
            "password": make_password("Zsedc123"),
        }

        self.serializer_data = {
            "is_active": False,
            "username": "testusernext",
            "first_name": "Jane",
            "last_name": "Doe",
            "email": "testuser@gmail.com",
            "password": ".2V:zt.W",
        }

        self.user = User.objects.create(**self.user_attributes)
        self.serializer = UserSerializer(instance=self.user)

    def check_created(self):
        self.assertEqual(User.objects.filter(email="q1210201368@gmail.com").exists(), True)

    def test_contains_expected_fields(self):
        data = self.serializer.data

        self.assertEqual(
            set(data.keys()),
            set(
                [
                    "is_active",
                    "username",
                    "first_name",
                    "last_name",
                    "email",
                    "password",
                    "date_joined",
                    "id",
                    "profile"
                ]
            ),
        )

    def test_is_active_field_content(self):
        data = self.serializer.data

        self.assertEqual(data["is_active"], self.user_attributes["is_active"])

    def test_username_field_content(self):
        data = self.serializer.data

        self.assertEqual(data["username"], self.user_attributes["username"])

    def tearDown(self):
        for user in User.objects.all():
            user.delete()


class ProfileAPITest(APITestCase):
    def setUp(self):
        self.profile_attributes = {
            "approved": True,
            "role": Profile.ROLE_ADMINISTRATOR,
            "hourly_rate": 1,
            "avatar": "String",
            "user_id": 6
        }

        self.serializer_data = {
            "approved": False,
            "role": "Administrator",
            "hourly_rate": 1,
            "avatar": "string",
        }

        self.profile = Profile.objects.create(**self.profile_attributes)
        self.serializer = ProfileSerializer(instance=self.profile)

    def test_contains_expected_fields(self):
        data = self.serializer.data

        self.assertEqual(
            set(data.keys()), set(["id", "approved", "role", "hourly_rate", "avatar", "experienced", "parameters"])
        )

    def test_approved_field_content(self):
        data = self.serializer.data

        self.assertEqual(data["approved"], self.profile_attributes["approved"])

    def test_role_field_content(self):
        data = self.serializer.data

        self.assertEqual(data["role"], self.profile_attributes["role"])

    def test_role_must_be_in_choices(self):
        self.profile_attributes["role"] = "iDesigner"

        serializer = ProfileSerializer(
            instance=self.profile, data=self.profile_attributes
        )

        self.assertFalse(serializer.is_valid())
        self.assertEqual(set(serializer.errors.keys()), set(serializer.errors.keys()))
        self.assertEqual(set(serializer.errors.keys()), set(["avatar", "role", "parameters"]))

    def tearDown(self):
        for profile in Profile.objects.all():
            profile.delete()
