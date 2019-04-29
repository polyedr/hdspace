from django.test import TestCase
from ..models import Profile


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
