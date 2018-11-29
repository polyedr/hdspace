from django.urls import re_path, path
from django.conf import settings

from virtualize import views

app_name = "virtualize"
urlpatterns = [
    re_path(r'^virtualize-projects/$', views.projects, name='projects'),
    path('index/', views.main_request_core, name='index'),
    path('prototypePage/', views.prototypePage, name='index'),
    path('custumize/', views.customize, name='customize')
]