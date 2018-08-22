from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^allUsers', views.all_users, name='allUsers'),
    url(r'^sendHireEmail', views.send_hire_email, name='sendHireEmail'),
    url(r'^deleteproject', views.deleteproject, name='deleteproject'),
]
