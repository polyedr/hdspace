import pytest
import parse

from django.urls import reverse
from django.contrib.messages import get_messages

from core.utils import build_absolute_url
from accounts.factories import UserFactory
from accounts.models import Profile


@pytest.mark.django_db
def test_login(client, user_with_password):
    payload = dict(
        username=user_with_password.username,
        password="password",
    )

    response = client.post(reverse("accounts:login"), payload)
    assert response.status_code == 200


@pytest.mark.django_db
def test_invalid_login(client, user_with_password):
    payload = dict(
        username=user_with_password.username,
        password="invalid_password",
    )

    response = client.post(reverse("accounts:login"), payload)
    assert response.status_code == 400


@pytest.mark.django_db
def test_signup(client, mailoutbox, settings):

    payload = dict(
        username="username",
        email="mail@example.com",
        first_name="firstName",
        last_name="lastName",
        password1="pa88word",
        password2="pa88word",
    )

    response = client.post(reverse("accounts:registration"), payload)
    assert response.status_code == 302
    messages = list(get_messages(response.wsgi_request))
    assert str(messages[0]) == "You have successfully registered."
    assert response["Location"] == reverse("accounts:login")
    assert len(mailoutbox) == 1

    msg = mailoutbox[0]

    assert msg.subject == "Confirm your registration at {site_name}".format(
        site_name=settings.SITE_NAME
    )
    assert msg.to == [payload["email"]]

    profile = Profile.objects.filter(user__email=payload["email"]).first()

    assert build_absolute_url(profile.get_confirmation_url()) in msg.body


@pytest.mark.django_db
def test_signup_duplicate_email(client, user_with_password):

    payload = dict(
        username="username",
        email=user_with_password.email,
        first_name="firstName",
        last_name="lastName",
        password1="pa88word",
        password2="pa88word",
    )

    response = client.post(reverse("accounts:registration"), payload)
    assert response.status_code == 400


@pytest.mark.django_db
def test_signup_duplicate_username(client, user_with_password):

    payload = dict(
        username=user_with_password.username,
        email="mail@example.com",
        first_name="firstName",
        last_name="lastName",
        password1="pa88word",
        password2="pa88word",
    )

    response = client.post(reverse("accounts:registration"), payload)
    assert response.status_code == 400


@pytest.mark.django_db
def test_signup_password_match_invalid(client):

    payload = dict(
        username="username",
        email="mail@example.com",
        first_name="firstName",
        last_name="lastName",
        password1="pa88word",
        password2="pa88word1",
    )

    response = client.post(reverse("accounts:registration"), payload)
    assert response.status_code == 400


@pytest.mark.django_db
def test_email_confirmation(client):
    user = UserFactory(is_active=False)
    user.profile.email_confirmation_token = Profile.generate_token()
    user.profile.save()

    response = client.get(
        reverse("accounts:confirmation",
                kwargs=dict(confirmation_token=user.profile.email_confirmation_token))
    )
    assert response.status_code == 302

    profile = Profile.objects.filter(user=user).first()

    assert profile.email_confirmation_token is None
    assert profile.user.is_active is True


@pytest.mark.django_db
def test_email_confirmation_invalid(client):
    user = UserFactory(is_active=False)
    user.profile.email_confirmation_token = Profile.generate_token()
    user.profile.save()

    response = client.get(
        reverse("accounts:confirmation",
                kwargs=dict(confirmation_token=Profile.generate_token()))
    )

    assert response.status_code == 302
    assert response["Location"] == reverse("accounts:login")


@pytest.mark.django_db
def test_forgot_password(client, mailoutbox, settings, user_with_password):

    payload = dict(email=user_with_password.email)

    response = client.post(reverse("accounts:forgot_password"), payload)
    assert response.status_code == 302
    assert response["Location"] == reverse("accounts:login")

    assert len(mailoutbox) == 1

    msg = mailoutbox[0]

    assert msg.subject == "Reset your {site_name} password".format(
        site_name=settings.SITE_NAME
    )
    assert msg.to == [payload["email"]]

    profile = Profile.objects.filter(user__email=payload["email"]).first()

    assert build_absolute_url(profile.get_reset_password_url()) in msg.body


@pytest.mark.django_db
def test_forgot_password_invalid(client):
    payload = dict(email="email@example.com")

    response = client.post(reverse("accounts:forgot_password"), payload)
    assert response.status_code == 400

    user = UserFactory(is_active=False)
    payload = dict(email=user.email)

    response = client.post(reverse("accounts:forgot_password"), payload)
    assert response.status_code == 400