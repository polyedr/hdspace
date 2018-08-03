from django.conf.urls import url
from users import views
from colorTransfer import views2

urlpatterns = [
    url(r'^allUsers', views.allUsers, name='allUsers'),
    
    url(r'^sendHireEmail', views.sendHireEmail, name='sendHireEmail'),
    url(r'^deleteproject', views.deleteproject, name='deleteproject'),
]