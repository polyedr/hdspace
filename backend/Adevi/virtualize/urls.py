from django.conf.urls import url
from virtualize import views
from loginMongo import views1
from colorTransfer import views2
from django.conf.urls.static import static
from django.conf import settings
from django.contrib.auth import views as auth_views


'''
print(settings.MEDIA_URL)
print(settings.MEDIA_ROOT)
print(settings.STATIC_URL)
print(settings.STATICFILES_DIRS)
print(settings.STATIC_ROOT)
print(settings.STATICFILES_FINDERS)
print(settings.BOWER_COMPONENTS_ROOT)
print(settings.BOWER_COMPONENTS_URL)
'''

urlpatterns = [
    url(r'^$', views1.login),
    url(r'^register/', views1.register, name='register'),
    url(r'^login/', auth_views.login, name='login'),
    url(r'^projects/$', views2.projects, name='projects'),
    url(r'^forgotPassword/', views.forgotPassword, name='forgotPasword'),
    url(r'^index/', views2.color, name='index'),
    url(r'^custumize/', views.customize, name='customize'),
    url(r'^logout/', auth_views.logout, {'next_page': '/login'}, name='logout'),
    url(r'^saveGuestName/', views1.saveGuestName, name='saveGuestName'),
    url(r'^guest/$', views1.guest, name='guest'),

              ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)