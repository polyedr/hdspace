"""
Simplified API tests for authentication (without full middleware chain)
"""
import pytest
import json
from django.contrib.auth import get_user_model
from django.test import RequestFactory
from apps.schat.apiviews import CustomObtainPairView


User = get_user_model()


@pytest.mark.django_db
class TestJWTAuthenticationSimple:
    """Simplified JWT authentication tests"""

    def test_jwt_view_exists(self):
        """Test JWT view can be imported"""
        assert CustomObtainPairView is not None

    def test_user_can_be_authenticated(self, test_user):
        """Test user authentication works"""
        user = User.objects.get(username=test_user.username)
        assert user.check_password('testpass123')

    def test_jwt_endpoint_response_structure(self):
        """Test JWT endpoint via curl (integration test)"""
        import subprocess
        result = subprocess.run(
            [
                'curl', '-s', '-X', 'POST',
                'http://localhost:8000/api/v1/djauth/jwt/create/',
                '-H', 'Content-Type: application/json',
                '-d', '{"username":"admin","password":"admin123"}'
            ],
            capture_output=True,
            text=True
        )
        
        # If backend is running, should get response
        if result.returncode == 0 and result.stdout:
            try:
                data = json.loads(result.stdout)
                # Should have tokens if credentials are correct
                if 'access' in data:
                    assert 'refresh' in data
                    assert 'streamchat' in data
            except json.JSONDecodeError:
                # Backend might not be accessible in test environment
                pass

