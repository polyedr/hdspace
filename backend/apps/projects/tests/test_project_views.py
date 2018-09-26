import pytest
import json

from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.messages import get_messages

from core.tests.utils import create_image
from projects.factories import ProjectFactory, ProjectMemberFactory, ProjectScreenFactory, ScreenEventFactory


@pytest.mark.django_db
def test_project_dashboard(client, user_with_password):
    client.login(username=user_with_password.username, password="password")
    project = ProjectFactory()
    ProjectMemberFactory(user=user_with_password, project=project)
    response = client.get(reverse("projects:dashboard"))
    assert len(response.context["projects"]) == 1


@pytest.mark.django_db
def test_create_project(client, user_with_password):

    client.login(username=user_with_password.username, password="password")

    payload = dict(name="test")

    response = client.post(reverse("projects:create_project"), payload)
    assert response.status_code == 302
    assert response["Location"] == reverse("projects:dashboard")

    messages = list(get_messages(response.wsgi_request))
    assert str(messages[0]) == "Your project has been created successfully."


@pytest.mark.django_db
def test_create_project_invalid(client, user_with_password):
    client.login(username=user_with_password.username, password="password")

    payload = dict(name="")

    response = client.post(reverse("projects:create_project"), payload)
    assert response.status_code == 302
    assert response["Location"] == reverse("projects:dashboard")

    messages = list(get_messages(response.wsgi_request))
    assert str(messages[0]) == "Wrong project name."


@pytest.mark.django_db
def test_project(client, user_with_password):
    client.login(username=user_with_password.username, password="password")
    project = ProjectFactory()
    response = client.get(reverse("projects:project", kwargs={"pk": project.pk}))
    assert response.context["project"].name == project.name


@pytest.mark.django_db
def test_add_project_screen(client, user_with_password):
    client.login(username=user_with_password.username, password="password")

    screen = create_image()
    project = ProjectFactory()
    screen_img = SimpleUploadedFile("screen.png", screen.getvalue(), content_type="image/png")
    payload = dict(
        image=screen_img
    )

    response = client.post(reverse("projects:add_screen", kwargs={"pk": project.pk}), payload)

    assert response.status_code == 302
    assert response["Location"] == reverse("projects:project", kwargs={"pk": project.pk})

    messages = list(get_messages(response.wsgi_request))
    assert str(messages[0]) == "Project screen successfully added."


@pytest.mark.django_db
def test_add_project_screen_invalid(client, user_with_password):
    client.login(username=user_with_password.username, password="password")

    screen = create_image()
    project = ProjectFactory()
    screen_img = SimpleUploadedFile("screen.docx", screen.getvalue(), content_type="image/png")
    payload = dict(
        image=screen_img
    )

    response = client.post(reverse("projects:add_screen", kwargs={"pk": project.pk}), payload)

    assert response.status_code == 302
    assert response["Location"] == reverse("projects:project", kwargs={"pk": project.pk})

    messages = list(get_messages(response.wsgi_request))
    assert str(messages[0]) == "Invalid Image File."


@pytest.mark.django_db
def test_delete_screen_event(client, user_with_password):
    client.login(username=user_with_password.username, password="password")

    project = ProjectFactory()
    screen = ProjectScreenFactory(project=project)
    evant = ScreenEventFactory(screen=screen)
    payload = dict(
        screenEventId=evant.pk
    )

    response = client.post(reverse("projects:delete_screen_event"), payload)
    assert response.status_code == 200
    response = json.loads(response.content)
    assert response["msg"] == "Event has been deleted successfully."


@pytest.mark.django_db
def test_update_screen_position(client, user_with_password):
    client.login(username=user_with_password.username, password="password")

    project = ProjectFactory()
    screen = ProjectScreenFactory(project=project)
    evant = ScreenEventFactory(screen=screen)
    payload = dict(
        x=200,
        y=200,
    )
    response = client.post(reverse("projects:update_event_position", kwargs={"pk": evant.pk}), payload)
    assert response.status_code == 200
    response = json.loads(response.content)
    assert response["msg"] == "Positions have been updated successfully."


@pytest.mark.django_db
def test_update_screen_position_invalid(client, user_with_password):
    client.login(username=user_with_password.username, password="password")

    project = ProjectFactory()
    screen = ProjectScreenFactory(project=project)
    evant = ScreenEventFactory(screen=screen)
    payload = dict(
        x="invalid",
        y=200,
    )
    response = client.post(reverse("projects:update_event_position", kwargs={"pk": evant.pk}), payload)
    response = json.loads(response.content)
    assert response["msg"] == "Invalid data."


@pytest.mark.django_db
def test_screen_evnets(client, user_with_password):
    client.login(username=user_with_password.username, password="password")

    project = ProjectFactory()
    screen = ProjectScreenFactory(project=project)
    ScreenEventFactory(screen=screen)
    response = client.get(reverse("projects:screen_events", kwargs={"pk": screen.pk}))
    assert response.status_code == 200
    response = json.loads(response.content)
    assert "screen_events" in response
    assert "save_url" in response
