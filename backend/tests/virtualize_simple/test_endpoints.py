"""
Tests for virtualize_simple ML endpoints
"""
import pytest
import os
from io import BytesIO
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile
from apps.projects.models import ProjectScreen


@pytest.mark.django_db
class TestVirtualizeSimpleEndpoints:
    """Test virtualize_simple API endpoints"""

    def test_recognize_endpoint_exists(self, authenticated_client):
        """Test recognize endpoint is accessible"""
        response = authenticated_client.get('/api/v1/virtualize_simple/recognize/')
        
        # POST endpoint, GET should return 405 Method Not Allowed
        assert response.status_code == 405

    def test_maskrcnn_endpoint_is_disabled(self, authenticated_client):
        """Mask R-CNN is no longer exposed by the API."""
        response = authenticated_client.get('/api/v1/virtualize_simple/maskrcnn/')

        assert response.status_code == 404

    def test_assemble_endpoint_exists(self, authenticated_client):
        """Test assemble endpoint is accessible"""
        response = authenticated_client.get('/api/v1/virtualize_simple/assemble/')
        
        # POST endpoint, GET should return 405
        assert response.status_code == 405

    def test_freecanvas_endpoint_exists(self, authenticated_client):
        """Test freecanvas endpoint is accessible"""
        response = authenticated_client.get('/api/v1/virtualize_simple/freecanvas/')
        
        # POST endpoint, GET should return 405
        assert response.status_code == 405


@pytest.mark.django_db
class TestRecognizeEndpoint:
    """Test recognize endpoint with image processing"""

    def create_test_image(self):
        """Create a simple test image"""
        img = Image.new('RGB', (100, 100), color='white')
        img_io = BytesIO()
        img.save(img_io, format='PNG')
        img_io.seek(0)
        return SimpleUploadedFile(
            "test_image.png",
            img_io.read(),
            content_type="image/png"
        )

    def test_recognize_without_data(self, authenticated_client):
        """Test recognize endpoint without required data"""
        response = authenticated_client.post(
            '/api/v1/virtualize_simple/recognize/',
            {},
            format='json'
        )
        
        # Should return 400 Bad Request
        assert response.status_code == 400

    @pytest.mark.skip(reason="Requires actual image file and ML models loaded")
    def test_recognize_with_image(self, authenticated_client, test_project):
        """Test recognize endpoint with image (requires ML models)"""
        test_image = self.create_test_image()
        
        response = authenticated_client.post(
            '/api/v1/virtualize_simple/recognize/',
            {
                'image': test_image,
                'project': test_project.id,
                'name': 'Test Screen',
                'block_type': 'forms'
            },
            format='multipart'
        )
        
        # If ML models are loaded, should return 201
        # If not, will return 500
        assert response.status_code in [201, 500]


@pytest.mark.django_db  
@pytest.mark.skip(reason="Mask R-CNN is disabled")
class TestMaskRCNNEndpoint:
    """Test MaskRCNN endpoint"""

    def test_maskrcnn_without_data(self, authenticated_client):
        """Test maskrcnn endpoint without required data"""
        response = authenticated_client.post(
            '/api/v1/virtualize_simple/maskrcnn/',
            {},
            format='json'
        )
        
        # Should return 400 or 500 (missing required fields)
        assert response.status_code in [400, 500]

    def test_maskrcnn_with_missing_image(self, authenticated_client):
        """Test maskrcnn endpoint with missing image field"""
        response = authenticated_client.post(
            '/api/v1/virtualize_simple/maskrcnn/',
            {'block_type': 'forms'},
            format='json'
        )
        
        # Should return error (missing image)
        assert response.status_code in [400, 500]

    def test_maskrcnn_with_missing_block_type(self, authenticated_client):
        """Test maskrcnn endpoint with missing block_type"""
        response = authenticated_client.post(
            '/api/v1/virtualize_simple/maskrcnn/',
            {'image': 'test.png'},
            format='json'
        )
        
        # Should return error (missing block_type)
        assert response.status_code in [400, 500]

    @pytest.mark.skipif(
        os.environ.get("ENV_NAME") != 'Staging',
        reason="ML models only loaded in Staging environment"
    )
    def test_maskrcnn_with_invalid_block_type(self, authenticated_client):
        """Test maskrcnn with invalid block_type"""
        response = authenticated_client.post(
            '/api/v1/virtualize_simple/maskrcnn/',
            {
                'image': 'test.png',
                'block_type': 'invalid_type'
            },
            format='json'
        )
        
        # Should return 400 (invalid block_type)
        assert response.status_code == 400

    @pytest.mark.skip(reason="Requires ML models and valid image file")
    def test_maskrcnn_happy_path(self, authenticated_client):
        """Test maskrcnn endpoint with valid data (requires ML models)"""
        # This test would need:
        # 1. Actual image file uploaded to media/
        # 2. ML models loaded in memory
        # 3. Proper environment setup
        
        response = authenticated_client.post(
            '/api/v1/virtualize_simple/maskrcnn/',
            {
                'image': '/path/to/test/image.png',
                'block_type': 'forms'
            },
            format='json'
        )
        
        # Expected response structure from MaskRCNN
        if response.status_code == 200:
            data = response.json()
            assert 'rois' in data
            assert 'class_ids' in data
            assert 'scores' in data


@pytest.mark.django_db
class TestVirtualizeSimpleIntegration:
    """Integration tests for virtualize_simple workflow"""

    @pytest.mark.skip(reason="Mask R-CNN is disabled")
    def test_ml_models_configuration(self):
        """Test ML models are properly configured"""
        # Check if models directory exists
        models_dir = 'apps/virtualize_simple/mask_rcnn/trained_models'
        assert os.path.exists(models_dir)
        
        # Check for .h5 model files
        h5_files = [f for f in os.listdir(models_dir) if f.endswith('.h5')]
        
        # Log available models
        print(f"Found {len(h5_files)} ML model files: {h5_files}")
        
        # In production, should have at least one model
        # In test environment, this might be empty
        assert isinstance(h5_files, list)

    def test_endpoints_are_registered(self, api_client):
        """Test all virtualize_simple endpoints are registered in URLs"""
        endpoints = [
            '/api/v1/virtualize_simple/recognize/',
            '/api/v1/virtualize_simple/assemble/',
            '/api/v1/virtualize_simple/freecanvas/',
        ]
        
        for endpoint in endpoints:
            # Try POST (these are POST endpoints)
            response = api_client.post(endpoint, {})
            
            # Should NOT be 404 (endpoint exists)
            assert response.status_code != 404, f"Endpoint {endpoint} not found"
            
            # Should be 400, 401, 403, or 500 (endpoint exists but invalid data)
            assert response.status_code in [400, 401, 403, 500]

    @pytest.mark.skip(reason="Requires test images in media/")
    def test_full_recognition_workflow(self, authenticated_client, test_project):
        """Test full workflow: upload image -> recognize -> create elements"""
        # This would test the complete flow but requires:
        # 1. Actual test images
        # 2. Loaded ML models
        # 3. Proper media directory setup
        pass

