from rest_framework.test import APITestCase

from apps.projects.models import Project
from apps.projects.serializers import ProjectSerializer
from apps.accounts.models import User, Profile

class ProjectAPITest(APITestCase):
    def setUp(self):
        self.User = User.objects.create(email="q1210201368@gmail.com")

        self.project_attributes = {"name": "testproject", "status": "pending","user":self.User}

        self.serializer_data = {"name": "projecttest", "status": "paid","user":self.User}

        self.project = Project.objects.create(**self.project_attributes)
        self.serializer = ProjectSerializer(instance=self.project)

    def test_contains_expected_fields(self):
        pass
        # data = self.serializer.data

        # self.assertEqual(set(data.keys()), set(["name", "status"]))

    def test_name_field_content(self):
        data = self.serializer.data

        self.assertEqual(data["name"], self.project_attributes["name"])

    def test_status_field_content(self):
        data = self.serializer.data

        self.assertEqual(data["status"], self.project_attributes["status"])

    def test_status_must_be_in_choices(self):
        self.project_attributes["status"] = "unpaid"

        serializer = ProjectSerializer(
            instance=self.project, data=self.project_attributes
        )

        self.assertFalse(serializer.is_valid())
        self.assertEqual(set(serializer.errors.keys()), set(["status","projectscreen"]))

    def tearDown(self):
        for project in Project.objects.all():
            project.delete()
