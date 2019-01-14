import pytest

from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.messages import get_messages

from core.tests.utils import create_image


@pytest.mark.django_db
def test_change_password(client, user_with_password):
    client.login(username=user_with_password.username, password="password")

    payload = dict(
        old_password="password",
        password1="$2017$design%",
        password2="$2017$design%",
    )

    response = client.post(reverse("accounts:change_password"), payload)

    assert response.status_code == 302
    assert response["Location"] == reverse("accounts:profile")


@pytest.mark.django_db
def test_change_password_match_invalid(client, user_with_password):
    client.login(username=user_with_password.username, password="password")

    payload = dict(
        old_password="password",
        password1="$2017$design%",
        password2="$2018$design%",
    )

    response = client.post(reverse("accounts:change_password"), payload)

    assert response.status_code == 302
    assert response["Location"] == reverse("accounts:profile")

    messages = list(get_messages(response.wsgi_request))
    assert str(messages[0]) == "Passwords didn't match."


@pytest.mark.django_db
def test_change_password_invalid_current(client, user_with_password):
    client.login(username=user_with_password.username, password="password")

    payload = dict(
        old_password="wpassword",
        password1="$2017$design%",
        password2="$2017$design%",
    )

    response = client.post(reverse("accounts:change_password"), payload)

    assert response.status_code == 302
    assert response["Location"] == reverse("accounts:profile")

    messages = list(get_messages(response.wsgi_request))
    assert str(messages[0]) == "Invalid password provided."


@pytest.mark.django_db
def test_change_avatar(client, user_with_password):
    client.login(username=user_with_password.username, password="password")

    avatar = create_image()
    avatar_file = SimpleUploadedFile("avatar.png", avatar.getvalue(), content_type="image/png")
    payload = dict(
        avatar=avatar_file
    )

    response = client.post(reverse("accounts:change_avatar"), payload)

    assert response.status_code == 302


@pytest.mark.django_db
def test_change_avatar_invalid(client, user_with_password):
    client.login(username=user_with_password.username, password="password")

    avatar = create_image()
    avatar_file = SimpleUploadedFile("avatar.docx", avatar.getvalue(), content_type="text/plain")
    payload = dict(
        avatar=avatar_file
    )

    response = client.post(reverse("accounts:change_avatar"), payload)

    assert response.status_code == 302

    messages = list(get_messages(response.wsgi_request))
    assert str(messages[0]) == "Invalid Image File."
