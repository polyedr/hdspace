from django.urls import path, include
from apps.virtualize_simple.apiviews import (
    ProjectScreenList,
    ScenarioElementAssemblingList,
    ScenarioElementFreecanvasList,
)

app_name = "virtualize_simple"

api_virtualize_simple_patterns = [
    # path("virtualize-simple/", ScenarioElementList.as_view(), name="virtualize_simple"),
    path("recognize/", ProjectScreenList.as_view(), name="recognize"),
    path("assemble/", ScenarioElementAssemblingList.as_view(), name="assemble"),
    path(
        "freecanvas/",
        ScenarioElementFreecanvasList.as_view(),
        name="freecanvas_assemble",
    ),
    # path("virtualize-simple/<int:pk>/", ScenarioElementDetail.as_view(), name="virtualize_simple_detail"),
]


urlpatterns = [path("", include(api_virtualize_simple_patterns))]
