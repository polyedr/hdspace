from django.urls import path, include
from rest_framework import routers
import apps.activity.apiviews as views


app_name = "activity"

router = routers.DefaultRouter(trailing_slash=False)

# router.register('customers', views.CustomerView)
router.register("columntaskhistory/", views.ColumnTaskHistoryView)
router.register("projectscreenhistory/", views.ProjectScreenHistoryView)
router.register("projecthistory/", views.ProjectHistoryView)

urlpatterns = [path("", include(router.urls))]
