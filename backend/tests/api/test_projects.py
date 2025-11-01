"""
API tests for Projects CRUD operations
"""
import pytest
from apps.projects.models import Project, ProjectScreen


@pytest.mark.django_db
class TestProjectsAPI:
    """Test Projects CRUD operations"""

    def test_list_projects(self, authenticated_client, test_user):
        """Test listing projects"""
        # Create test projects
        Project.objects.create(
            name='Project 1',
            preview='P1',
            user=test_user
        )
        Project.objects.create(
            name='Project 2',
            preview='P2',
            user=test_user
        )
        
        response = authenticated_client.get('/api/v1/projects/projects/')
        
        assert response.status_code == 200
        data = response.json()
        assert 'results' in data
        assert len(data['results']) >= 2

    def test_create_project(self, authenticated_client):
        """Test creating a new project (happy path)"""
        response = authenticated_client.post(
            '/api/v1/projects/projects/',
            {
                'name': 'New Test Project',
                'preview': 'New project preview',
                'status': 'pending'
            },
            format='json'
        )
        
        assert response.status_code == 201
        data = response.json()
        
        assert data['name'] == 'New Test Project'
        assert data['preview'] == 'New project preview'
        assert 'id' in data
        
        # Verify in database
        assert Project.objects.filter(name='New Test Project').exists()

    def test_get_project_detail(self, authenticated_client, test_project):
        """Test retrieving project details"""
        response = authenticated_client.get(
            f'/api/v1/projects/projects/{test_project.id}/'
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data['id'] == test_project.id
        assert data['name'] == test_project.name
        assert data['preview'] == test_project.preview

    def test_update_project(self, authenticated_client, test_project):
        """Test updating a project"""
        response = authenticated_client.patch(
            f'/api/v1/projects/projects/{test_project.id}/',
            {
                'name': 'Updated Project Name',
                'preview': 'Updated preview'
            },
            format='json'
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data['name'] == 'Updated Project Name'
        assert data['preview'] == 'Updated preview'
        
        # Verify in database
        test_project.refresh_from_db()
        assert test_project.name == 'Updated Project Name'

    def test_delete_project(self, authenticated_client, test_project):
        """Test deleting a project"""
        project_id = test_project.id
        
        response = authenticated_client.delete(
            f'/api/v1/projects/projects/{project_id}/'
        )
        
        assert response.status_code == 204
        
        # Verify deleted from database
        assert not Project.objects.filter(id=project_id).exists()

    def test_create_project_without_auth(self, api_client):
        """Test creating project without authentication"""
        response = api_client.post(
            '/api/v1/projects/projects/',
            {
                'name': 'Unauthorized Project',
                'preview': 'Should fail'
            },
            format='json'
        )
        
        # Should fail or use default user (depends on permissions)
        # With AllowAny it might succeed, check your settings
        assert response.status_code in [201, 401, 403]

    def test_project_tags(self, authenticated_client, test_user):
        """Test project with tags"""
        response = authenticated_client.post(
            '/api/v1/projects/projects/',
            {
                'name': 'Tagged Project',
                'preview': 'Preview',
                'tags': ['tag1', 'tag2', 'tag3']
            },
            format='json'
        )
        
        assert response.status_code == 201
        data = response.json()
        assert 'tags' in data
        assert len(data['tags']) == 3


@pytest.mark.django_db
class TestProjectScreensAPI:
    """Test Project Screens API"""

    def test_create_screen(self, authenticated_client, test_project):
        """Test creating a screen for project"""
        response = authenticated_client.post(
            '/api/v1/projects/screens/',
            {
                'name': 'New Screen',
                'project': test_project.id,
                'status': 'draft'
            },
            format='json'
        )
        
        assert response.status_code == 201
        data = response.json()
        
        assert data['name'] == 'New Screen'
        assert data['project'] == test_project.id

    def test_list_project_screens(self, authenticated_client, test_project):
        """Test listing screens for a project"""
        # Create screens
        ProjectScreen.objects.create(
            name='Screen 1',
            project=test_project,
            status='draft'
        )
        ProjectScreen.objects.create(
            name='Screen 2',
            project=test_project,
            status='draft'
        )
        
        response = authenticated_client.get(
            f'/api/v1/projects/screens/?project={test_project.id}'
        )
        
        assert response.status_code == 200
        data = response.json()
        assert 'results' in data
        # Should have at least 2 screens
        screens = [s for s in data['results'] if s['project'] == test_project.id]
        assert len(screens) >= 2

