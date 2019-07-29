from django.urls import path, include
from django.views.generic import RedirectView

from .views import screen, project, event, project_event, task, comment

app_name = "projects"

project_patterns = [
    path("", RedirectView.as_view(url='/projects')),
    path("projects/", project.DashboardView.as_view(), name="dashboard"),
    path("create-project/", project.CreateProjectView.as_view(), name="create_project"),
    path("project/<int:pk>/", project.ProjectView.as_view(), name="project"),
    path("preview/<str:token>/<int:pk>/", project.ProjectPreviewView.as_view(), name="preview"),
    path("delete-project/", project.DeleteProjectView.as_view(), name="delete_project"),
]

project_event_patterns = [
    path("download/<int:pk>/", project_event.DownloadProjectView.as_view(), name="download"),
    path("invite/<int:pk>/", project_event.ProjectInviteView.as_view(), name="invite"),
    path("invite-user/", project_event.UserInviteView.as_view(), name="invite_user"),
    path("edite-role/", project_event.EditMemberRoleView.as_view(), name="edite_role"),
    path("accept-decline/<str:invitation_token>/<str:status>/",
         project_event.AcceptDeclineInvitationView.as_view(), name="accept_decline"),
    path("delete-member/", project_event.DeleteChatMemberView.as_view(), name="delete_member"),
]

event_patterns = [
    path("delete-screen-event/", event.DeleteScreenEventView.as_view(), name="delete_screen_event"),
    path("screen-events/<int:pk>/", event.ScreenEventsView.as_view(), name="screen_events"),
    path("update-event-position/<int:pk>/", event.UpdateEventPositionView.as_view(), name="update_event_position"),
]

task_patterns = [
    path("add-task/<int:pk>/", task.AddProjectTaskView.as_view(), name="add_project_task"),
    path("add-sub-tusk/", task.AddSubTaskView.as_view(), name="add_sub_task"),
    path("assign-task/", task.AssignTaskView.as_view(), name="assign_task"),
    path("delete-task/", task.DeleteTaskView.as_view(), name="delete_task"),
    path("edit-task/", task.EditTaskView.as_view(), name="edit_task"),
    path("management/", task.TaskManagementView.as_view(), name="management"),
    path("tracking/", task.TaskTimeTrackingView.as_view(), name="tracking"),
    path("stop-tracking/", task.StopTaskTimeTrackingView.as_view(), name="stop_tracking"),
]

screen_patterns = [
    path("screen/<int:project_id>/<int:screen_id>/", screen.ProjectScreenView.as_view(), name="screen"),
    path("delete-screen/", screen.DeleteScreenView.as_view(), name="delete_screen"),
    path("add-screen/", screen.AddProjectScreenView.as_view(), name="add_screen"),
    path("assign-screen/", screen.AssignScreenView.as_view(), name="assign_screen"),
    path("change-status/", screen.ChangeScreenStatusView.as_view(), name="change_status"),
    path("share-screen/", screen.ShareScreenView.as_view(), name="share_screen"),
    path("edit-screen/<int:project_id>/<int:screen_id>/", screen.EditScreenView.as_view(), name="edit_screen"),
    path("screen-preview/<str:token>/<int:pk>/", screen.ProjectScreenPreviewView.as_view(), name="screenpreview"),
]

comment_patterns = [
    path("screen-comments/<int:screen_id>/<int:pk>/", comment.ScreenCommentsView.as_view(), name="screen_events"),
    path("new-comment/", comment.ScreenCommentView.as_view(), name="new_comment"),
    path("edit-comment/", comment.EditView.as_view(), name="edit_comment"),
    path("delete-comment/", comment.DeleteCommentView.as_view(), name="delete_comment"),
]

urlpatterns = []
'''
urlpatterns = [
    path("", include(project_patterns)),
    path("", include(screen_patterns)),
    path("", include(event_patterns)),
    path("", include(project_event_patterns)),
    path("", include(task_patterns)),
    path("", include(comment_patterns)),
]
'''