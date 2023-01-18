from django.urls import path
from apps.uploadapps.apiviews import FileUploadView, RobotsView, WpgSavedView, ProjectImageUploadView

app_name = "uploadapps"

urlpatterns = [
    path("", FileUploadView.as_view()),
    path("projectimages/", ProjectImageUploadView.as_view()),
    # path("webpages/", WebpageSavedView.as_view()),
    path("wpg/", WpgSavedView.as_view()),
    path("robots/", RobotsView.as_view()),
]
