from django.urls import path, include
from apps.virtualize_simple.apiviews import ScreenScenarioList, ScreenScenarioDetail


app_name = "virtualize_simple"

api_virtualize_simple_patterns = [
    path("virtualize-simple/", ScreenScenarioList.as_view(), name="virtualize_simple"),
    path(
        "virtualize-simple/<int:pk>/",
        ScreenScenarioDetail.as_view(),
        name="virtualize_simple_detail",
    ),
]


urlpatterns = [path("", include(api_virtualize_simple_patterns))]
