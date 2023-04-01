from django.urls import path
from apps.uploadapps.apiviews import (
    FileUploadView,
    RobotsView,
    WpgSavedView,
    ObjectsMoveView,
)

app_name = "uploadapps"

urlpatterns = [
    path("", FileUploadView.as_view()),
    path("move/", ObjectsMoveView.as_view()),
    path("wpg/", WpgSavedView.as_view()),
    path("robots/", RobotsView.as_view()),
]
