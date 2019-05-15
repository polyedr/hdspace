from django.urls import path, include

from apps.virtualize_emulation.apiviews import (
    PreSegmentationList,
    PreSegmentationDetail,
)

app_name = "virtualize_emulation"

api_virtualize_emulation_scenario_patterns = [
    path(
        "presegmentations/",
        PreSegmentationList.as_view(),
        name="presegmentations",
    ),
    path(
        "presegmentations/<int:pk>/",
        PreSegmentationDetail.as_view(),
        name="presegmentations",
    ),

]


urlpatterns = [path("", include(api_virtualize_emulation_scenario_patterns))]

"""
path(
    "virtualize-emulation-scenarios/",
    ScreenScenarioList.as_view(),
    name="virtualize_emulation_scenarios",
),
path(
    "virtualize-emulation-scenarios/<int:pk>/",
    ScreenScenarioDetail.as_view(),
    name="virtualize_emulation_scenarios",
),    
"""