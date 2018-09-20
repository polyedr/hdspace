from django.urls import path

from .views import *  # noqa

app_name = "projects"
urlpatterns = [
    path("", DashboardView.as_view(), name="dashboard"),
    path("create-project/", CreateProjectView.as_view(), name="create_project"),
    path("project/<int:pk>/", ProjectView.as_view(), name="project"),
    path("add-screen/<int:pk>/", AddProjectScreenView.as_view(), name="add_screen"),
    path("delete-screen-event/", DeleteScreenEventView.as_view(), name="delete_screen_event"),
    path("update-event-position/<int:pk>/", UpdateEventPositionView.as_view(), name="update_event_position"),
    path("screen/<int:project_id>/<int:screen_id>/", ProjectScreenView.as_view(), name="screen"),
]
