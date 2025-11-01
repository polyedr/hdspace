"""
Pytest configuration and fixtures
"""
import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.projects.models import Project


User = get_user_model()


@pytest.fixture
def api_client():
    """Return API client for testing"""
    return APIClient()


@pytest.fixture
def test_user(db):
    """Create a test user"""
    user = User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123',
        first_name='Test',
        last_name='User'
    )
    return user


@pytest.fixture
def authenticated_client(api_client, test_user):
    """Return authenticated API client"""
    api_client.force_authenticate(user=test_user)
    return api_client


@pytest.fixture
def admin_user(db):
    """Create admin user"""
    user = User.objects.create_superuser(
        username='admin_test',
        email='admin_test@example.com',
        password='admin123',
    )
    return user


@pytest.fixture
def authenticated_admin_client(api_client, admin_user):
    """Return authenticated admin API client"""
    api_client.force_authenticate(user=admin_user)
    return api_client


@pytest.fixture
def test_project(test_user):
    """Create a test project"""
    project = Project.objects.create(
        name='Test Project',
        preview='Test preview',
        status=Project.STATUS_PENDING,
        user=test_user
    )
    return project


@pytest.fixture
def jwt_tokens(api_client, test_user):
    """Get JWT tokens for test user"""
    response = api_client.post(
        '/api/v1/djauth/jwt/create/',
        {
            'username': test_user.username,
            'password': 'testpass123'
        },
        format='json'
    )
    return response.data

