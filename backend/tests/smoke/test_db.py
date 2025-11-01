"""
Smoke tests for database connectivity
"""
import pytest
from django.contrib.auth import get_user_model
from django.db import connection
from apps.projects.models import Project, ProjectScreen
from apps.accounts.models import Profile


User = get_user_model()


@pytest.mark.django_db
class TestDatabaseConnectivity:
    """Test basic database operations"""

    def test_db_connection(self):
        """Test database connection is alive"""
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            assert result == (1,)

    def test_can_create_user(self):
        """Test can create User (critical model)"""
        user = User.objects.create_user(
            username='dbtest',
            email='dbtest@example.com',
            password='testpass'
        )
        
        assert user.id is not None
        assert user.username == 'dbtest'
        assert user.email == 'dbtest@example.com'
        assert User.objects.filter(username='dbtest').exists()

    def test_can_create_profile(self, test_user):
        """Test Profile creation (OneToOne with User)"""
        # Profile should be created automatically via signal
        assert hasattr(test_user, 'profile')
        assert test_user.profile.user == test_user

    def test_can_create_project(self, test_user):
        """Test can create Project (critical business model)"""
        project = Project.objects.create(
            name='DB Test Project',
            preview='Test preview',
            status=Project.STATUS_PENDING,
            user=test_user
        )
        
        assert project.id is not None
        assert project.name == 'DB Test Project'
        assert project.user == test_user
        assert Project.objects.filter(name='DB Test Project').exists()

    def test_can_create_screen(self, test_user):
        """Test can create ProjectScreen (nested model)"""
        project = Project.objects.create(
            name='Screen Test Project',
            preview='Test',
            status=Project.STATUS_PENDING,
            user=test_user
        )
        
        screen = ProjectScreen.objects.create(
            name='Test Screen',
            status='draft',
            project=project
        )
        
        assert screen.id is not None
        assert screen.project == project
        assert ProjectScreen.objects.filter(project=project).count() == 1

    def test_user_projects_relationship(self, test_user):
        """Test User -> Projects relationship"""
        # Create multiple projects
        project1 = Project.objects.create(
            name='Project 1',
            preview='P1',
            user=test_user
        )
        project2 = Project.objects.create(
            name='Project 2',
            preview='P2',
            user=test_user
        )
        
        # Check relationship
        user_projects = Project.objects.filter(user=test_user)
        assert user_projects.count() == 2
        assert project1 in user_projects
        assert project2 in user_projects

    def test_db_transactions(self, test_user):
        """Test database transactions work correctly"""
        initial_count = Project.objects.count()
        
        try:
            with connection.cursor():
                Project.objects.create(
                    name='Transaction Test',
                    preview='Test',
                    user=test_user
                )
        except Exception:
            pytest.fail("Transaction failed")
        
        assert Project.objects.count() == initial_count + 1

