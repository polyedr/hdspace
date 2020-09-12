from django.test import TestCase
from ..models import Project, ScreenScenario
from guardian.shortcuts import assign_perm
from apps.accounts.models import Profile, User


class UserPermissionTest(TestCase):
    """ Test if user has permission to a project """

    def setUp(self):
        self.User = User.objects.create(email="yamamoto265@gmail.com")
        self.project_attributes1 = {
            "user_id": 1,
            "name": "testproject",
            "status": "pending",
        }
        self.project = Project.objects.create(**self.project_attributes1)

    def test_user_has_permission(self):
        assign_perm("assign_project", self.User, self.project)
        self.assertEqual(True, self.User.has_perm("assign_project", self.project))

# Create more test cases showing object level permission


class ProjectTest(TestCase):
    """ Test module for Project model """

    def setUp(self):
        self.project_attributes1 = {"name": "testproject", "status": "pending"}
        self.project = Project.objects.create(**self.project_attributes1)

        self.project_attributes2 = {"name": "testproject2", "status": "review"}
        self.project = Project.objects.create(**self.project_attributes2)

    def test_project_str(self):
        project_test1 = Project.objects.get(name="testproject")
        project_test2 = Project.objects.get(name="testproject2")
        self.assertEqual(project_test1.__str__(), project_test1.name)
        self.assertEqual(project_test2.__str__(), project_test2.name)

    def tearDown(self):
        for project in Project.objects.all():
            project.delete()


class ScreenScenarioTest(TestCase):
    """ Test module for ScreenScenario model """

    def setUp(self):
        self.ScreenScenarioattributes1 = {"name": "testscreenscenario", "type": "login"}
        self.screenscenario = ScreenScenario.objects.create(
            **self.ScreenScenarioattributes1
        )

        self.ScreenScenarioattributes2 = {
            "name": "testscreenscenario2",
            "type": "contact_info",
        }
        self.screenscenario = ScreenScenario.objects.create(
            **self.ScreenScenarioattributes2
        )

    def test_ScreenScenariostr(self):
        ScreenScenariotest1 = ScreenScenario.objects.get(name="testscreenscenario")
        ScreenScenariotest2 = ScreenScenario.objects.get(name="testscreenscenario2")
        self.assertEqual(ScreenScenariotest1.__str__(), str(ScreenScenariotest1.pk))
        self.assertEqual(ScreenScenariotest2.__str__(), str(ScreenScenariotest2.pk))

    def tearDown(self):
        for screenscenario in ScreenScenario.objects.all():
            screenscenario.delete()
