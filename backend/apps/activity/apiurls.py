from django.urls import path, include
from rest_framework import routers
import apps.activity.apiviews as views


app_name = "activity"

router = routers.DefaultRouter()

# router.register('customers', views.CustomerView)
router.register(r"columntaskhistory", views.ColumnTaskHistoryView)
router.register(r"projectscreenhistory", views.ProjectScreenHistoryView)
router.register(r"projecthistory", views.ProjectHistoryView)
router.register(r"unionhistory", views.UnionHistoryView)

urlpatterns = [path("", include(router.urls))]

urlpatterns = [
    path(r"unihistory/",views.UHistoryView.as_view(),name="unihistory"),
    path(r"listhistory/",views.HistoryListApi.as_view(),name="listhistory"),
]

urlpatterns += router.urls
