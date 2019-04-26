from rest_framework.test import APITestCase

from apps.accounts.models import Profile
from apps.accounts.serializers import ProfileSerializer


class ProfileAPITest(APITestCase):
    def setUp(self):
        self.profile_attributes = {
            "approved": True,
            "role": "Developer",
            "hourly_rate": 1,
            "avatar": "string",
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
            set(data.keys()), set(["approved", "role", "hourly_rate", "avatar"])
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
        self.assertEqual(set(serializer.errors.keys()), set(["avatar", "role"]))

    def tearDown(self):
        for profile in Profile.objects.all():
            profile.delete()