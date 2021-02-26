from django.test import TestCase

from ..tests.accounts_factory import UserFactory, ProfileFactory
from ..models import Profile, User


class UserTest(TestCase):
    """ Test module for User model """

    def setUp(self):
        self.user = UserFactory.create()
        self.user_created = User.objects.get(username=self.user.username)

    def check_created(self):
        self.assertEqual(User.objects.filter(email=self.user.email).exists(), True)

    def test_user_username(self):
        # profile_test2 = Profile.objects.get(role="Developer")
        self.assertEqual(self.user_created.username, self.user.username)
        # self.assertEqual(profile_test2.online(), False)

    def test_user_first_name(self):
        # profile_test2 = Profile.objects.get(role="Developer")
        self.assertEqual(self.user_created.first_name, self.user.first_name)
        # self.assertEqual(profile_test2.online(), False)

    def test_user_last_name(self):
        # profile_test2 = Profile.objects.get(role="Developer")
        self.assertEqual(self.user_created.last_name, self.user.last_name)
        # self.assertEqual(profile_test2.online(), False)

    def test_user_email(self):
        # profile_test2 = Profile.objects.get(role="Developer")
        self.assertEqual(self.user_created.email, self.user.email)
        # self.assertEqual(profile_test2.online(), False)

    def test_user_password(self):
        # profile_test2 = Profile.objects.get(role="Developer")
        self.assertEqual(self.user.email, self.user_created.email)
        # self.assertEqual(profile_test2.online(), False)

    def tearDown(self):
        for user in User.objects.all():
            user.delete()


class ProfileTest(TestCase):
    """ Test module for Profile model """

    def setUp(self):

        self.profile = ProfileFactory.create()
        self.profile_created = Profile.objects.get(user_id=self.profile.user_id)

    def test_profile_role(self):
        self.assertEqual(self.profile_created.role, "ADMINISTRATOR")

    def test_profile_approved(self):
        self.assertEqual(self.profile_created.approved, self.profile.approved)

    def test_profile_hourly_rate(self):
        self.assertEqual(self.profile_created.hourly_rate, self.profile.hourly_rate)

    def tearDown(self):
        for profile in Profile.objects.all():
            profile.delete()
#

