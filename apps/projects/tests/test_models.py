from django.test import TestCase
from ..models import Project


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
