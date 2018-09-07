from django.urls import path

from apps.core.views import home

app_name = "core"
urlpatterns = [
    path("", home.LandingView.as_view(), name="landing"),
]
