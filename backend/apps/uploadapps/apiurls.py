from django.urls import path
from apps.uploadapps.apiviews import FileUploadView


app_name = "uploadapps"

urlpatterns = [path("", FileUploadView.as_view())]
