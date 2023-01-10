"""Urls for the projects api"""

from django.urls import path, include
from rest_framework import routers
from rest_framework_bulk.routes import BulkRouter

from .apiviews import (
    ProjectScreenList,
    ScreenEventList,
    ProjectColumnList,
    ProjectColumnDetail,
    ProjectMemberList,
    ProjectMemberDetail,
    ProjectWithColumnsViewSet,
    ColumnTaskList,
    ColumnTaskDetail,
    ColumnWithTasksViewSet,

    ProjectInvitationList,
    ScreenCommentList,
    ProjectScreenDetail,
    ScreenEventDetail,
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
    ProjectViewSet, ScenarioElementRecursiveViewSet, ProjectWithScreensViewSet,
    ElementCommentList, ElementCommentDetail, ProjectIllustrationSetList, ProjectIllustrationSetDetail,
    IllustrationSetImageList, IllustrationSetImageDetail, ScenarioElementMultipleRecursiveViewSet,
    RemovePermissionsProject,
    AssignPermissionsProject, DisplayPermissionsProject, DisplayPermissionsAllusers, AssignPermissionsmapProject,
    ProjectWithMembersViewSet, IllustrationSetImagePaletteList, IllustrationSetImagePaletteDetail, ProjectcopyView,
    ScreencopyView, ElementcopyView, ElementmpttcopyView, ColumnsReorder, TasksReorder, ColumnTaskCheckitemList,
    ColumnTaskCheckitemDetail, ColumnTaskCommentList, ColumnTaskCommentDetail, ColumnTaskLabelList,
    ColumnTaskLabelDetail, ColumnTaskCheckitemDelete, AssignPermissionsmapsProject, ProjectScreenExportDetail,
    ProjectScreenImportDetail, ScreeScenarioImportExportViewSet, ProjectImportExportViewSet)

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

api_project_member_patterns = [
    path("project-members/", ProjectMemberList.as_view(),
         name="api_project_members"),
    path(
        "project-members/<int:pk>/", ProjectMemberDetail.as_view(),
        name="api_project_member"
    ),
]

api_project_column_patterns = [
    path("project-columns/", ProjectColumnList.as_view(),
         name="api_project_columns"),
    path(
        "project-columns/<int:pk>/", ProjectColumnDetail.as_view(),
        name="api_project_column"
    ),
]

api_column_task_patterns = [
    path("column-tasks/", ColumnTaskList.as_view(),
         name="api_column_tasks"),
    path(
        "column-tasks/<int:pk>/", ColumnTaskDetail.as_view(),
        name="api_column_task"
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
    path(
        "project-exportscreens/<int:pk>/",
        ProjectScreenExportDetail.as_view(),
        name="api_project_exportscreen",
    ),
    path(
        "project-importscreens/<int:pk>/",
        ProjectScreenImportDetail.as_view(),
        name="api_project_importscreen",
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

api_columntask_comment_patterns = [
    path("columntask-comments/", ColumnTaskCommentList.as_view(),
         name="api_columntask_comments"),
    path(
        "columntask_comments/<int:pk>/", ColumnTaskCommentDetail.as_view(),
        name="api_columntask_comment"
    ),
]

api_columntask_checkitem_patterns = [
    path("columntask-checkitems/", ColumnTaskCheckitemList.as_view(),
         name="api_columntask_checkitems"),
    path("columntask-checkitems-delete/", ColumnTaskCheckitemDelete.as_view(),
         name="api_columntask_checklist"),
    path(
        "columntask_checkitems/<int:pk>/", ColumnTaskCheckitemDetail.as_view(),
        name="api_columntask_checkitem"
    ),
]

api_columntask_label_patterns = [
    path("columntask-labels/", ColumnTaskLabelList.as_view(),
         name="api_columntask_labels"),
    path(
        "columntask_labels/<int:pk>/", ColumnTaskLabelDetail.as_view(),
        name="api_columntask_label"
    ),
]

api_permissions_project_patterns = [
    path("permissionsmap-projects-assign/", AssignPermissionsmapProject.as_view(),
         name="api_assign_permissionsmap_projects"),
    path("permissionsmaps-projects-assign/", AssignPermissionsmapsProject.as_view(),
         name="api_assign_permissionsmaps_projects"),
    path("permissions-projects-assign/", AssignPermissionsProject.as_view(),
         name="api_assign_permissions_projects"),
    path("permissions-projects-remove/", RemovePermissionsProject.as_view(),
         name="api_remove_permissions_projects"),
    path("permissions-projects-display/", DisplayPermissionsProject.as_view(),
         name="api_display_permissions_projects"),
    path("permissions-allusers-display/", DisplayPermissionsAllusers.as_view(),
         name="api_display_permissions_allusers"),
]

api_copying_projects = [
    path("projectcopy/", ProjectcopyView.as_view(),
         name="api_copying_projects"),
]

api_copying_screens = [
    path("screencopy/", ScreencopyView.as_view(),
         name="api_copying_screens"),
]
#
# api_export_screens = [
#     path("screenexport/", ScreenexportView.as_view(),
#          name="api_export_screens"),
# ]

api_copying_elementsmptt = [
    path("elementmpttcopy/", ElementmpttcopyView.as_view(),
         name="api_copying_elementsmptt"),
]

api_copying_elements = [
    path("elementcopy/", ElementcopyView.as_view(),
         name="api_copying_elements"),
]

api_update_children_order = [
    path("project/update_children_order/<int:pk>/", ColumnsReorder.as_view(),
         name="api_update_children_order"),
]

api_update_tasks_order = [
    path("column/update_children_order/<int:pk>/", TasksReorder.as_view(),
         name="api_update_tasks_order"),
]

router = routers.DefaultRouter()
router.register(r"screen-scenarios", ScreeScenarioViewSet)
router.register(r"screen-scenarioimportexports", ScreeScenarioImportExportViewSet)
router.register(r"scenario-elements", ScenarioElementViewSet)
router.register(r"scenario-elements-recursive", ScenarioElementRecursiveViewSet)
router.register(r"projects", ProjectViewSet)
router.register(r"projectimportexports", ProjectImportExportViewSet)
# router.register(r"projects-copying", ProjectCopyingViewSet, base_name="projects_copying")
router.register(r"screens-for-project", ProjectWithScreensViewSet)
router.register(r"columns-for-project", ProjectWithColumnsViewSet)
router.register(r"members-for-project", ProjectWithMembersViewSet)
router.register(r"tasks-for-column", ColumnWithTasksViewSet)

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
router.register(r"scenario-elements-multiple-recursive",
                ScenarioElementMultipleRecursiveViewSet, basename="MultipleRecursive")

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

api_illustration_set_image_patterns = [
    path(
        "images/",
        IllustrationSetImageList.as_view(),
        name="api_illustration_set_image_list",
    ),
    path(
        "images/<int:pk>/",
        IllustrationSetImageDetail.as_view(),
        name="api_illustration_set_list_image_detail",
    ),
]

api_illustration_set_image_palette_patterns = [
    path(
        "images_palette/",
        IllustrationSetImagePaletteList.as_view(),
        name="api_illustration_set_image_palette_list",
    ),
    path(
        "images_palette/<int:pk>/",
        IllustrationSetImagePaletteDetail.as_view(),
        name="api_illustration_set_list_image_palette_detail",
    ),
]

urlpatterns = [
    # path("", include(api_project_invitation_patterns)),
    # path("", include(api_screen_event_patterns)),
    path("", include(api_permissions_project_patterns)),
    path("", include(api_copying_projects)),
    path("", include(api_copying_screens)),
    # path("", include(api_export_screens)),
    path("", include(api_copying_elementsmptt)),
    path("", include(api_copying_elements)),
    path("", include(api_update_children_order)),
    path("", include(api_update_tasks_order)),
    path("", include(api_element_comment_patterns)),
    path("", include(api_columntask_comment_patterns)),
    path("", include(api_columntask_checkitem_patterns)),
    path("", include(api_columntask_label_patterns)),
    path("", include(api_project_member_patterns)),
    path("", include(api_project_column_patterns)),
    path("", include(api_column_task_patterns)),
    path("", include(api_illustration_set_patterns)),
    path("", include(api_illustration_set_image_patterns)),
    path("", include(api_illustration_set_image_palette_patterns)),
    path("", include(api_project_screen_patterns)),
    path("", include(api_screen_scenario_patterns)),
    path("", include(api_scenario_element_patterns)),
    # path("", include(api_library_element_patterns)),
    path("", include(api_library_scenario_element_patterns)),
    path("", include(api_screen_comment_patterns)),
    path("", include(api_scenario_element_multi_patterns)),
    path("", include(api_screen_scenario_cascade_multi_patterns)),
]
