"""Urls for the projects api"""

from django.urls import path, include
from rest_framework import routers
from rest_framework_bulk import BulkModelViewSet
from rest_framework_bulk.routes import BulkRouter

from apps.projects.models import ScenarioElement
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
    ScreenScenarioDetail,
    ScenarioElementDetail,
    ScreenScenarioList,
    ScenarioElementList,
    # ElementList,
    ElementViewSet,
    ScenarioViewSet,
    ScenarioElementCreateMultiple,
    ScenarioElementMultipleViewSet,
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

api_screen_scenario_patterns = [
    path(
        "screen-scenarios/", ScreenScenarioList.as_view(), name="api_screen_scenarios"
    ),
    path(
        "screen-scenarios/<int:pk>/",
        ScreenScenarioDetail.as_view(),
        name="api_screen_scenario",
    ),
]

api_scenario_element_patterns = [
    path(
        "scenario-elements/",
        ScenarioElementList.as_view(),
        name="api_scenario_elements",
    ),
    path(
        "scenario-elements-multiple/",
        ScenarioElementCreateMultiple.as_view(),
        name="api_scenario_elements_multiple",
    ),
    path(
        "scenario-elements/<int:pk>/",
        ScenarioElementDetail.as_view(),
        name="api_scenario_element",
    ),
]

#
# api_library_element_patterns = [
#     path("library-elements/", ElementList.as_view(), name="api_library_elements")
# ]

router = routers.DefaultRouter()
router.register(r"library-elements", ElementViewSet, base_name="api_library_elements")
# api_library_element_patterns = router.urls

router.register(
    r"library-scenarios", ScenarioViewSet, base_name="api_library_scenarios"
)
api_library_scenario_element_patterns = router.urls


router = BulkRouter()
router.register(
    r"scenario-elements-multi",
    ScenarioElementMultipleViewSet,
    base_name="api_scenario_element_multi",
)
api_scenario_element_multi_patterns = router.urls


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
    path("", include(api_screen_scenario_patterns)),
    path("", include(api_scenario_element_patterns)),
    # path("", include(api_library_element_patterns)),
    path("", include(api_library_scenario_element_patterns)),
    # path("", include(api_screen_comment_patterns)),
    path("", include(api_scenario_element_multi_patterns)),
]
