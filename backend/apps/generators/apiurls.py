from django.conf.urls import url
from rest_framework import routers
from .apiviews import GeneratorAPIView

app_name = 'generators'

router = routers.DefaultRouter()

urlpatterns = [
    url('', GeneratorAPIView.as_view()),
]
