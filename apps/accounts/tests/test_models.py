from django.test import TestCase
from ..models import Profile, User


class ProfileTest(TestCase):
    """ Test module for Profile model """

    def setUp(self):
        self.profile_attributes = {"role": "Designer", "approved": True}
        self.profile = Profile.objects.create(**self.profile_attributes)
        #
        # self.profile_attributes2 = {"role": "Developer", "approved": True}
        # self.profile = Profile.objects.create(**self.profile_attributes2)

    def test_profile_role(self):
        profile_test = Profile.objects.get(role="Designer")
        # profile_test2 = Profile.objects.get(role="Developer")
        self.assertEqual(profile_test.role, "Designer")
        # self.assertEqual(profile_test2.online(), False)

    def test_profile_approved(self):
        profile_test = Profile.objects.get(role="Designer")
        # profile_test2 = Profile.objects.get(role="Developer")
        self.assertEqual(profile_test.approved, True)
        # self.assertEqual(profile_test2.online(), False)

    def tearDown(self):
        for profile in Profile.objects.all():
            profile.delete()


class UserTest(TestCase):
    """ Test module for User model """

    def setUp(self):
        self.user_attributes = {
            "username": "testuser",
            "first_name": "John",
            "last_name": "Doe",
            "email": "testuser@gmail.com",
            "password": ".2V:zt.W",
        }
        self.user = User.objects.create(**self.user_attributes)

    def test_user_username(self):
        user_test = User.objects.get(username="testuser")
        # profile_test2 = Profile.objects.get(role="Developer")
        self.assertEqual(user_test.username, "testuser")
        # self.assertEqual(profile_test2.online(), False)

    def test_user_first_name(self):
        user_test = User.objects.get(username="testuser")
        # profile_test2 = Profile.objects.get(role="Developer")
        self.assertEqual(user_test.first_name, "John")
        # self.assertEqual(profile_test2.online(), False)

    def test_user_last_name(self):
        user_test = User.objects.get(username="testuser")
        # profile_test2 = Profile.objects.get(role="Developer")
        self.assertEqual(user_test.last_name, "Doe")
        # self.assertEqual(profile_test2.online(), False)

    def test_user_email(self):
        user_test = User.objects.get(username="testuser")
        # profile_test2 = Profile.objects.get(role="Developer")
        self.assertEqual(user_test.email, "testuser@gmail.com")
        # self.assertEqual(profile_test2.online(), False)

    def test_user_password(self):
        user_test = User.objects.get(username="testuser")
        # profile_test2 = Profile.objects.get(role="Developer")
        self.assertEqual(user_test.password, ".2V:zt.W")
        # self.assertEqual(profile_test2.online(), False)

    def tearDown(self):
        for user in User.objects.all():
            user.delete()
