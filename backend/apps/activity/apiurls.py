from django.urls import path, include
from rest_framework import routers
import apps.activity.apiviews as views


app_name = "activity"

router = routers.DefaultRouter()

# router.register('customers', views.CustomerView)
router.register(r"columntaskhistory", views.ColumnTaskHistoryView)
router.register(r"projectscreenhistory", views.ProjectScreenHistoryView)
router.register(r"projecthistory", views.ProjectHistoryView)

urlpatterns = [path("", include(router.urls))]
