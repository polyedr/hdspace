from django.urls import path, include

from .views import screen, project, event, project_event

app_name = "projects"

project_patterns = [
    path("", project.DashboardView.as_view(), name="dashboard"),
    path("create-project/", project.CreateProjectView.as_view(), name="create_project"),
    path("project/<int:pk>/", project.ProjectView.as_view(), name="project"),
    path("preview/<str:token>/<int:pk>/", project.ProjectPreviewView.as_view(), name="preview"),
    path("delete-project/", project.DeleteProjectView.as_view(), name="delete_project"),
]

project_event_patterns = [
    path("download/<int:pk>/", project_event.DownloadProjectView.as_view(), name="download"),
    path("invite/<int:pk>/", project_event.ProjectInviteView.as_view(), name="invite"),
    path("accept-decline/<str:invitation_token>/<str:status>/",
         project_event.AcceptDeclineInvitationView.as_view(), name="accept_decline"),
    path("delete-member/", project_event.DeleteChatMemberView.as_view(), name="delete_member"),
    path("add-task/<int:pk>/", project_event.AddProjectTaskView.as_view(), name="add_project_task"),
]

event_patterns = [
    path("delete-screen-event/", event.DeleteScreenEventView.as_view(), name="delete_screen_event"),
    path("screen-events/<int:pk>/", event.ScreenEventsView.as_view(), name="screen_events"),
    path("update-event-position/<int:pk>/", event.UpdateEventPositionView.as_view(), name="update_event_position"),
]

screen_patterns = [
    path("screen/<int:project_id>/<int:screen_id>/", screen.ProjectScreenView.as_view(), name="screen"),
    path("delete-screen/", screen.DeleteScreenView.as_view(), name="delete_screen"),
    path("add-screen/", screen.AddProjectScreenView.as_view(), name="add_screen"),
    path("edit-screen/<int:project_id>/<int:screen_id>/", screen.EditScreenView.as_view(), name="edit_screen"),
    path("screen-preview/<str:token>/<int:pk>/", screen.ProjectScreenPreviewView.as_view(), name="screenpreview"),
]

urlpatterns = [
    path("", include(project_patterns)),
    path("", include(screen_patterns)),
    path("", include(event_patterns)),
    path("", include(project_event_patterns)),
]
