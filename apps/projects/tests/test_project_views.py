import pytest
import json

from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.messages import get_messages

from core.tests.utils import create_image
from apps.projects.factories import ProjectFactory, ProjectMemberFactory, ProjectScreenFactory, ScreenEventFactory


@pytest.mark.django_db
def test_project_dashboard(client, user_with_password):
    client.login(username=user_with_password.username, password="password")
    project = ProjectFactory()
    ProjectMemberFactory(user=user_with_password, project=project)
    response = client.get(reverse("projects:dashboard"))
    assert len(response.context["projects"]) == 1

