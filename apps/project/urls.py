from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^projectDetails', views.projectDetails, name='projectDetails'),
    url(r'^projectComments', views.projectComments, name='projectComments'),
    url(r'^editComment', views.editComment, name='editComment'),
    url(r'^completeProject', views.completeProject, name='completeProject'),
    url(r'^getPercentage', views.getPercentage, name='getPercentage'),
    url(r'^acceptedProject', views.acceptedProject, name='acceptedProject'),
    url(r'^declinedProject', views.declinedProject, name='declinedProject'),
    url(r'^sendOutsideHireEmail', views.sendOutsideHireEmail, name='sendOutsideHireEmail'),
    url(r'^projects/$', views.projects, name='projects'),
    url(r'^userContacts', views.userContacts, name='userContacts'),
    url(r'^commentsActivity', views.commentsActivity, name='commentsActivity')
]
