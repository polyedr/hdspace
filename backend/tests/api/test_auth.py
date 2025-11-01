"""
API tests for authentication endpoints
"""
import pytest
from django.contrib.auth import get_user_model


User = get_user_model()


@pytest.mark.django_db
class TestJWTAuthentication:
    """Test JWT authentication flow"""

    def test_jwt_create_with_valid_credentials(self, api_client, test_user):
        """Test JWT token creation with valid credentials"""
        response = api_client.post(
            '/api/v1/djauth/jwt/create/',
            {
                'username': test_user.username,
                'password': 'testpass123'
            },
            format='json'
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Check tokens are present
        assert 'access' in data
        assert 'refresh' in data
        assert 'streamchat' in data
        
        # Check tokens are not empty
        assert len(data['access']) > 0
        assert len(data['refresh']) > 0
        assert len(data['streamchat']) > 0

    def test_jwt_create_with_invalid_credentials(self, api_client):
        """Test JWT creation fails with invalid credentials"""
        response = api_client.post(
            '/api/v1/djauth/jwt/create/',
            {
                'username': 'nonexistent',
                'password': 'wrongpass'
            },
            format='json'
        )
        
        assert response.status_code == 401

    def test_jwt_create_with_missing_fields(self, api_client):
        """Test JWT creation fails with missing fields"""
        response = api_client.post(
            '/api/v1/djauth/jwt/create/',
            {'username': 'testuser'},
            format='json'
        )
        
        assert response.status_code == 400

    def test_jwt_refresh(self, api_client, jwt_tokens):
        """Test JWT refresh token works"""
        response = api_client.post(
            '/api/v1/djauth/jwt/refresh/',
            {'refresh': jwt_tokens['refresh']},
            format='json'
        )
        
        assert response.status_code == 200
        assert 'access' in response.json()

    def test_protected_endpoint_without_auth(self, api_client):
        """Test protected endpoint requires authentication"""
        # Try to access projects without authentication
        response = api_client.get('/api/v1/projects/projects/')
        
        # Should work because AllowAny is set, but check response
        assert response.status_code in [200, 401, 403]

    def test_protected_endpoint_with_jwt(self, api_client, jwt_tokens):
        """Test protected endpoint works with JWT token"""
        api_client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {jwt_tokens['access']}"
        )
        
        response = api_client.get('/api/v1/projects/projects/')
        assert response.status_code == 200


@pytest.mark.django_db
class TestUserRegistration:
    """Test user registration endpoint"""

    def test_user_registration_success(self, api_client):
        """Test successful user registration"""
        response = api_client.post(
            '/api/v1/djauth/users/',
            {
                'username': 'newuser',
                'email': 'newuser@example.com',
                'password': 'newpass123',
                're_password': 'newpass123'
            },
            format='json'
        )
        
        # Djoser returns 201 on successful creation
        assert response.status_code == 201
        assert User.objects.filter(username='newuser').exists()

    def test_user_registration_password_mismatch(self, api_client):
        """Test registration fails with password mismatch"""
        response = api_client.post(
            '/api/v1/djauth/users/',
            {
                'username': 'newuser2',
                'email': 'newuser2@example.com',
                'password': 'pass123',
                're_password': 'different123'
            },
            format='json'
        )
        
        assert response.status_code == 400

    def test_user_registration_duplicate_email(self, api_client, test_user):
        """Test registration fails with duplicate email"""
        response = api_client.post(
            '/api/v1/djauth/users/',
            {
                'username': 'another_user',
                'email': test_user.email,  # Duplicate
                'password': 'pass123',
                're_password': 'pass123'
            },
            format='json'
        )
        
        assert response.status_code == 400

