import pytest

from apps.accounts.factories import UserFactory


@pytest.fixture
def user_with_password():
    user = UserFactory()
    user.set_password("password")
    user.save()
    return user
