from django.urls import path, include
from rest_framework_bulk.routes import BulkRouter

from apps.virtualize.apiviews import ScenarioElementMultipleViewSet

router = BulkRouter()
router.register(
    r"virtualize-multi",
    ScenarioElementMultipleViewSet,
    base_name="api_virtualize",
)

api_virtualize_patterns = router.urls

urlpatterns = [

    path("", include(api_virtualize_patterns)),
]
