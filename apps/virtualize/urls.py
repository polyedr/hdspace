from django.urls import re_path, path

from apps.virtualize import views

app_name = "virtualize"
urlpatterns = [
    re_path(r'^virtualize-projects/$', views.projects, name='projects'),
    path('index/', views.main_request_core, name='index')
    # path('prototypePage/', views.prototypePage, name='index'),
    # path('customize/', views.customize, name='customize')
]