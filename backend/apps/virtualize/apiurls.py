from django.urls import path, include
from apps.virtualize.apiviews import ScenarioElementList, ScenarioElementDetail


# from rest_framework_bulk.routes import BulkRouter
# from apps.virtualize.apiviews import ScenarioElementMultipleViewSet
#
# router = BulkRouter()
# router.register(
#     r"virtualize-multi",
#     ScenarioElementMultipleViewSet,
#     base_name="api_virtualize",
# )
#
# api_virtualize_patterns = router.urls
#
# urlpatterns = [
#
#     path("", include(api_virtualize_patterns)),
# ]
#


app_name = "virtualize_elements"

api_virtualize_elements_patterns = [
    path(
        "virtualize-elements/",
        ScenarioElementList.as_view(),
        name="virtualize_elements",
    ),
    path(
        "virtualize-elements/<int:pk>/",
        ScenarioElementDetail.as_view(),
        name="presegmentations",
    ),
]


urlpatterns = [path("", include(api_virtualize_elements_patterns))]
