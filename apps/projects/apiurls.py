"""Urls for the projects api"""

from django.urls import path, include

from .apiviews import (
    ProjectList,
    ProjectMemberList,
    ProjectScreenList,
    ScreenEventList,
    ProjectTaskList,
    ProjectActivityList,
    ProjectInvitationList,
    ScreenAssigneeList,
    TaskTimeList,
    ScreenCommentList,
    CommentList,
    ProjectDetail,
    ProjectMemberDetail,
    ProjectScreenDetail,
    ScreenEventDetail,
    ProjectTaskDetail,
    ProjectActivityDetail,
    ProjectInvitationDetail,
    ScreenAssigneeDetail,
    TaskTimeDetail,
    ScreenCommentDetail,
    CommentDetail,
)

app_name = "projects"

api_project_patterns = [
    path("projects/", ProjectList.as_view(), name="api_projects"),
    path("projects/<int:pk>/", ProjectDetail.as_view(), name="api_project"),
]

api_project_invitation_patterns = [
    path(
        "project-invitations/",
        ProjectInvitationList.as_view(),
        name="api_project_invitations",
    ),
    path(
        "project-invitations/<int:pk>/",
        ProjectInvitationDetail.as_view(),
        name="api_project_invitation",
    ),
]

api_screen_event_patterns = [
    path("screen-events/", ScreenEventList.as_view(), name="api_screen_events"),
    path(
        "screen-events/<int:pk>/", ScreenEventDetail.as_view(), name="api_screen_event"
    ),
]

api_project_task_patterns = [
    path("project-tasks/", ProjectTaskList.as_view(), name="api_project_tasks"),
    path(
        "project-tasks/<int:pk>/", ProjectTaskDetail.as_view(), name="api_project_task"
    ),
]

api_project_screen_patterns = [
    path("project-screens/", ProjectScreenList.as_view(), name="api_project_screens"),
    path(
        "project-screens/<int:pk>/",
        ProjectScreenDetail.as_view(),
        name="api_project_screen",
    ),
]

api_screen_comment_patterns = [
    path("screen-comments/", ScreenCommentList.as_view(), name="api_screen_comments"),
    path(
        "screen-comments/<int:pk>/",
        ScreenCommentDetail.as_view(),
        name="api_screen_comment",
    ),
]


urlpatterns = [
    path("", include(api_project_patterns)),
    # path("", include(api_project_invitation_patterns)),
    # path("", include(api_screen_event_patterns)),
    # path("", include(api_project_task_patterns)),
    path("", include(api_project_screen_patterns)),
    # path("", include(api_screen_comment_patterns)),
]
