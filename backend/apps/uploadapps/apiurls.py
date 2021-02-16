from django.urls import path
from apps.uploadapps.apiviews import FileUploadView, WebpageSavedView

app_name = "uploadapps"

urlpatterns = [
    path("", FileUploadView.as_view()),
    path("webpages/", WebpageSavedView.as_view()),
]
