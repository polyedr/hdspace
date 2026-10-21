"""
Characterization tests for core API paths used by the editor.
"""
import pytest
from apps.projects.models import Project, ProjectScreen


@pytest.mark.django_db
@pytest.mark.api
class TestCoreContract:
    def test_health_urls(self, api_client):
        for path in ("/health/", "/health/detailed/"):
            response = api_client.get(path)
            assert response.status_code == 200
            assert response.json()["status"] == "ok"

    def test_jwt_create_shape(self, api_client, test_user):
        response = api_client.post(
            "/api/v1/djauth/jwt/create/",
            {"username": test_user.username, "password": "testpass123"},
            format="json",
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("access")
        assert data.get("refresh")

    def test_projects_list_with_jwt(self, api_client, jwt_tokens):
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {jwt_tokens['access']}")
        response = api_client.get("/api/v1/projects/projects/")
        assert response.status_code == 200

    def test_create_project_and_screen(self, authenticated_client, test_user):
        project_resp = authenticated_client.post(
            "/api/v1/projects/projects/",
            {"name": "Contract Project", "preview": "preview", "status": Project.STATUS_PENDING},
            format="json",
        )
        assert project_resp.status_code in (200, 201)
        project_id = project_resp.json().get("id") or Project.objects.filter(
            name="Contract Project"
        ).values_list("id", flat=True).first()
        assert project_id

        screen_resp = authenticated_client.post(
            "/api/v1/projects/project-screens/",
            {"name": "Screen 1", "project": project_id},
            format="json",
        )
        assert screen_resp.status_code in (200, 201, 400)

        bootstrap = authenticated_client.get(
            f"/api/v1/projects/screens-for-project/{project_id}/"
        )
        assert bootstrap.status_code in (200, 404)

    def test_virtualize_simple_core_routes_exist(self, authenticated_client):
        for path in (
            "/api/v1/virtualize_simple/recognize/",
            "/api/v1/virtualize_simple/assemble/",
            "/api/v1/virtualize_simple/freecanvas/",
        ):
            response = authenticated_client.post(path, {}, format="json")
            assert response.status_code != 404

    def test_maskrcnn_disabled(self, authenticated_client):
        response = authenticated_client.get("/api/v1/virtualize_simple/maskrcnn/")
        assert response.status_code == 404

    def test_stripe_and_subscriptions_disabled_or_absent(self, api_client):
        for path in ("/api/v1/stripe/", "/api/v1/subscriptions/"):
            response = api_client.get(path)
            assert response.status_code in (404, 401, 403, 405)
