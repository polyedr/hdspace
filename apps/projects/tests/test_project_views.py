import pytest

from django.urls import reverse
from django.contrib.messages import get_messages


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
