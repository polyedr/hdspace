"""Urls for the projects api"""

from django.urls import path, include
from rest_framework import routers
from rest_framework_bulk.routes import BulkRouter

from .apiviews import (
    ProjectScreenList,
    ScreenEventList,
    ProjectTaskList,
    ProjectInvitationList,
    ScreenCommentList,
    ProjectScreenDetail,
    ScreenEventDetail,
    ProjectTaskDetail,
    ProjectInvitationDetail,
    ScreenCommentDetail,
    # ElementList,
    ElementViewSet,
    ScenarioViewSet,
    ScenarioElementCreateMultiple,
    ScenarioElementMultipleViewSet,
    ScreenScenarioMultipleView,
    ProjectScreenMultipleView,
    ScreenScenarioDestroyCascadeViewSet,
    ScreeScenarioViewSet,
    ScenarioElementViewSet,
    ProjectViewSet, ScenarioElementRecursiveViewSet, ProjectWithScreensViewSet, ProjectWithTasksViewSet,
    ElementCommentList, ElementCommentDetail, ProjectIllustrationSetList, ProjectIllustrationSetDetail)

app_name = "projects"

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
    path("screen-events/", ScreenEventList.as_view(),
         name="api_screen_events"),
    path(
        "screen-events/<int:pk>/", ScreenEventDetail.as_view(),
        name="api_screen_event"
    ),
]

api_project_task_patterns = [
    path("project-tasks/", ProjectTaskList.as_view(),
         name="api_project_tasks"),
    path(
        "project-tasks/<int:pk>/", ProjectTaskDetail.as_view(),
        name="api_project_task"
    ),
]

api_project_screen_patterns = [
    path("project-screens/", ProjectScreenList.as_view(),
         name="api_project_screens"),
    path(
        "project-screens-multiple/",
        ProjectScreenMultipleView.as_view(),
        name="api_project_screens_multiple",
    ),
    path(
        "project-screens/<int:pk>/",
        ProjectScreenDetail.as_view(),
        name="api_project_screen",
    ),
]

api_screen_scenario_patterns = [
    path(
        "screen-scenarios-multiple/",
        ScreenScenarioMultipleView.as_view(),
        name="api_screen_scenarios_multiple",
    ),
]

api_scenario_element_patterns = [
    path(
        "scenario-elements-multiple/",
        ScenarioElementCreateMultiple.as_view(),
        name="api_scenario_elements_multiple",
    ),
]


api_element_comment_patterns = [
    path("element-comments/", ElementCommentList.as_view(),
         name="api_element_comments"),
    path(
        "element_comments/<int:pk>/", ElementCommentDetail.as_view(),
        name="api_element_comment"
    ),
]


router = routers.DefaultRouter()
router.register(r"screen-scenarios", ScreeScenarioViewSet)
router.register(r"scenario-elements", ScenarioElementViewSet)
router.register(r"scenario-elements-recursive", ScenarioElementRecursiveViewSet)
router.register(r"projects", ProjectViewSet)
router.register(r"screens-for-project", ProjectWithScreensViewSet)
router.register(r"tasks-for-project", ProjectWithTasksViewSet)

router.register(r"library-elements", ElementViewSet,
                base_name="api_library_elements")
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

router = BulkRouter()
router.register(
    r"screen-scenarios-delete-cascade",
    ScreenScenarioDestroyCascadeViewSet,
    base_name="api_screen_scenarios_delete_cascade",
)

api_screen_scenario_cascade_multi_patterns = router.urls

api_screen_comment_patterns = [
    path("screen-comments/", ScreenCommentList.as_view(),
         name="api_screen_comments"),
    path(
        "screen-comments/<int:pk>/",
        ScreenCommentDetail.as_view(),
        name="api_screen_comment",
    ),
]

api_illustration_set_patterns = [
    path(
        "illustrations/",
        ProjectIllustrationSetList.as_view(),
        name="api_illustration_set_list",
    ),
    path(
        "illustrations/<int:pk>/",
        ProjectIllustrationSetDetail.as_view(),
        name="api_illustration_set_list_detail",
    ),
]


urlpatterns = [
    # path("", include(api_project_invitation_patterns)),
    # path("", include(api_screen_event_patterns)),
    path("", include(api_element_comment_patterns)),
    path("", include(api_project_task_patterns)),
    path("", include(api_illustration_set_patterns)),
    path("", include(api_project_screen_patterns)),
    path("", include(api_screen_scenario_patterns)),
    path("", include(api_scenario_element_patterns)),
    # path("", include(api_library_element_patterns)),
    path("", include(api_library_scenario_element_patterns)),
    path("", include(api_screen_comment_patterns)),
    path("", include(api_scenario_element_multi_patterns)),
    path("", include(api_screen_scenario_cascade_multi_patterns)),
]
