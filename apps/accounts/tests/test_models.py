from django.test import TestCase
from ..models import Profile, User
from django.contrib.auth.hashers import make_password


class UserTest(TestCase):
    """ Test module for User model """

    def setUp(self):
        self.user_attributes = {
            "username": "cnmbj8d",
            "first_name": "Nelly",
            "last_name": "Li",
            "email": "q1210201368@gmail.com",
            "password": make_password("Zsedc123"),
        }
        self.user = User.objects.create(**self.user_attributes)

    def check_created(self):
        self.assertEqual(User.objects.filter(email="q1210201368@gmail.com").exists(), True)

    def test_user_username(self):
        user_test = User.objects.get(username="cnmbj8d")
        # profile_test2 = Profile.objects.get(role="Developer")
        self.assertEqual(user_test.username, "cnmbj8d")
        # self.assertEqual(profile_test2.online(), False)

    def test_user_first_name(self):
        user_test = User.objects.get(username="cnmbj8d")
        # profile_test2 = Profile.objects.get(role="Developer")
        self.assertEqual(user_test.first_name, "Nelly")
        # self.assertEqual(profile_test2.online(), False)

    def test_user_last_name(self):
        user_test = User.objects.get(username="cnmbj8d")
        # profile_test2 = Profile.objects.get(role="Developer")
        self.assertEqual(user_test.last_name, "Li")
        # self.assertEqual(profile_test2.online(), False)

    def test_user_email(self):
        user_test = User.objects.get(username="cnmbj8d")
        # profile_test2 = Profile.objects.get(role="Developer")
        self.assertEqual(user_test.email, "q1210201368@gmail.com")
        # self.assertEqual(profile_test2.online(), False)

    def test_user_password(self):
        user_test = User.objects.get(username="testuser")
        # profile_test2 = Profile.objects.get(role="Developer")
        self.assertEqual(user_test.password, make_password("Zsedc123"))
        # self.assertEqual(profile_test2.online(), False)

    def tearDown(self):
        for user in User.objects.all():
            user.delete()


class ProfileTest(TestCase):
    """ Test module for Profile model """

    def setUp(self):
        self.profile_attributes = {
            "approved": True,
            "role": Profile.ROLE_ADMINISTRATOR,
            "hourly_rate": 1,
            "avatar": "String",
            "user_id": 6
        }
        self.profile = Profile.objects.create(**self.profile_attributes)
        #
        # self.profile_attributes2 = {"role": "Developer", "approved": True}
        # self.profile = Profile.objects.create(**self.profile_attributes2)

    def test_profile_role(self):
        profile_test = Profile.objects.get(role="ADMINISTRATOR")
        # profile_test2 = Profile.objects.get(role="Developer")
        self.assertEqual(profile_test.role, "ADMINISTRATOR")
        # self.assertEqual(profile_test2.online(), False)

    def test_profile_approved(self):
        profile_test = Profile.objects.get(role="ADMINISTRATOR")
        # profile_test2 = Profile.objects.get(role="Developer")
        self.assertEqual(profile_test.approved, True)
        # self.assertEqual(profile_test2.online(), False)

    def tearDown(self):
        for profile in Profile.objects.all():
            profile.delete()
#
