from django.urls import path
from rest_framework import routers
from .apiviews import GeneratorAPIView

app_name = "generators"

router = routers.DefaultRouter()

urlpatterns = [
    path("", GeneratorAPIView.as_view()),
]
