"""Views for the projects api"""
from urllib.parse import urlparse
from django_bulk_update.helper import bulk_update
import json

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, viewsets, permissions, status, serializers
from rest_framework.fields import CurrentUserDefault
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_bulk import ListBulkCreateUpdateDestroyAPIView, BulkModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import CursorPagination
# from rest_framework.decorators import permission_classes, action
from rest_framework_guardian import filters  # Django-Guardian
from guardian.shortcuts import assign_perm, remove_perm, get_perms, get_users_with_perms
from rest_framework_tracking.mixins import LoggingMixin

from apps.accounts.serializers import UserSerializer
from apps.accounts.models import User
from permissions import CustomObjectPermissions
from project.settings import schat_client, MEDIA_URL

from .models import (
    Project,
    ProjectMember,
    ProjectScreen,
    ScreenEvent,
    ProjectActivity,
    ProjectInvitation,
    ScreenAssignee,
    TaskTime,
    ScreenComment,
    Comment,
    ScreenScenario,
    ScenarioElement,
    elements,
    scenarios,
    ElementComment, ProjectIllustrationSet, ProjectImage, ProjectColumn, ColumnTask, ColumnTaskComment,
    ColumnTaskCheckitem)
from .serializers import (
    ProjectSerializer,
    ProjectMemberSerializer,
    ProjectScreenSerializer,
    ScreenEventSerializer,
    ProjectInvitationSerializer,
    ProjectActivitySerializer,
    ProjectColumnSerializer,
    ColumnTaskSerializer,
    CommentSerializer,
    ScreenCommentSerializer,
    TaskTimeSerializer,
    ScreenAssigneeSerializer,
    ScreenScenarioSerializer,
    ScenarioElementSerializer,
    ElementSerializer,
    ScenarioSerializer,
    ScenarioElementMultipleSerializer,
    ScreenScenarioMultipleSerializer,
    ProjectScreenMultipleSerializer,
    ScenarioElementSerializerRecursive,
    ProjectWithScreensSerializer,
    ProjectWithColumnsSerializer,
    ColumnWithTasksSerializer,
    ElementCommentSerializer,
    IllustrationSetSerializer,
    ImageSerializer,
    ScenarioElementMultipleRecursiveSerializer, ProjectWithMembersSerializer, ImagePaletteSerializer,
    duplicate_model_with_descendants, copy_element_node, copy_children, ColumnTaskCommentSerializer,
    ColumnTaskCheckitemSerializer)


class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
            print('is owner ? : ' + obj.owner == request.user)
            return obj.owner == request.user


class ProjectCursorSetPagination(CursorPagination):
    page_size = 10
    page_size_query_param = 'page_size'


class ScenarioElementCursorSetPagination(CursorPagination):
    page_size = 10
    page_size_query_param = 'page_size'


class ProjectViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    pagination_class = ProjectCursorSetPagination
    permission_classes = [CustomObjectPermissions]  # Django-Guardian
    filter_backends = [DjangoFilterBackend, filters.ObjectPermissionsFilter]  # Django-Guardian and DjangoFilterBackend
    filterset_fields = {'tags__name': ['exact'], 'name': ['exact'],
                        'status': ['exact'], 'created': ['lte', 'gte', 'lt', 'gt'],
                        'updated': ['lte', 'gte', 'lt', 'gt']}

    def get_queryset(self):
        # user = self.request.user
        # self.obj = get_object_or_404(Project, name=self.kwargs['pk'])
        # print(self.obj)
        return self.get_serializer_class().setup_eager_loading(self.queryset)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def filter_queryset(self, queryset):
        queryset = super(ProjectViewSet, self).filter_queryset(queryset)
        # queryset = queryset.filter(user=self.request.user)
        return queryset


class ProjectWithScreensViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Project.objects.all()
    serializer_class = ProjectWithScreensSerializer
    pagination_class = ProjectCursorSetPagination
    permission_classes = [CustomObjectPermissions]  # Django-Guardian
    filter_backends = [DjangoFilterBackend, filters.ObjectPermissionsFilter]  # Django-Guardian and DjangoFilterBackend
    filterset_fields = {'tags__name': ['exact'], 'name': ['exact'],
                        'status': ['exact'], 'created': ['lte', 'gte', 'lt', 'gt'],
                        'updated': ['lte', 'gte', 'lt', 'gt']}
    http_method_names = ['get', 'head']

    def get_queryset(self):
        return self.get_serializer_class().setup_eager_loading(self.queryset)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def filter_queryset(self, queryset):
        queryset = super(ProjectWithScreensViewSet, self).filter_queryset(queryset)
        # queryset = queryset.filter(user=self.request.user)
        return queryset


class ProjectWithColumnsViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Project.objects.all()
    serializer_class = ProjectWithColumnsSerializer
    pagination_class = None
    permission_classes = [CustomObjectPermissions]  # Django-Guardian
    filter_backends = [filters.ObjectPermissionsFilter]  # Django-Guardian
    http_method_names = ['get', 'head']

    def get_queryset(self):
        return self.get_serializer_class().setup_eager_loading(self.queryset)
    #
    # def perform_create(self, serializer):
    #     serializer.save(user=self.request.user)

    def filter_queryset(self, queryset):
        # queryset = queryset.filter(user=self.request.user)
        return queryset


class ColumnWithTasksViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = ProjectColumn.objects.all()
    serializer_class = ColumnWithTasksSerializer
    pagination_class = None
    http_method_names = ['get', 'head']

    '''
    def get_queryset(self):
        return self.get_serializer_class().setup_eager_loading(self.queryset)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def filter_queryset(self, queryset):
        queryset = queryset.filter(user=self.request.user)
        return queryset
    '''


class ElementViewSet(viewsets.ViewSet):
    """
    Retrieve the elements library
    """

    serializer_class = ElementSerializer

    def list(self, request):
        serializer = ElementSerializer(instance=elements.values(), many=True)
        return Response(serializer.data)


class ScenarioViewSet(viewsets.ViewSet):
    """
    Retrieve the scenarios library
    """

    serializer_class = ScenarioSerializer

    def list(self, request):
        serializer = ScenarioSerializer(instance=scenarios.values(), many=True)
        return Response(serializer.data)


class ScenarioElementMultipleViewSet(BulkModelViewSet):
    serializer_class = ScenarioElementMultipleSerializer

    def get_queryset(self):
        ids = self.request.query_params.get("ids", None)
        qs = ScenarioElement.objects.all()
        if ids:
            ids_list = ids.split(",")
            # print("ids", ids,ids[0],ids[1],ids[2],ids[3],ids[4])
            print("ids", ids_list)
            return qs.filter(id__in=ids_list)
        else:
            return qs

    def allow_bulk_destroy(self, qs, filtered):
        """Don't forget to fine-grain this method"""
        # custom logic here
        # default checks if the qs was filtered
        # qs comes from self.get_queryset()
        # filtered comes from self.filter_queryset(qs)
        ids = self.request.query_params.get("ids", None)
        if ids:
            return qs


class ScenarioElementMultipleRecursiveViewSet(BulkModelViewSet):
    serializer_class = ScenarioElementMultipleRecursiveSerializer
    queryset = ScenarioElement.objects.all()
    http_method_names = ['patch', 'head']


class ProjectMemberList(generics.ListCreateAPIView):
    """
    List all project details, or create a new project detail.
    """

    queryset = ProjectMember.objects.all()
    serializer_class = ProjectMemberSerializer
    #
    # def perform_create(self, serializer):
    #     serializer.save(owner=self.request.user)


class ProjectMemberDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a project member detail
    """

    queryset = ProjectMember.objects.all()
    serializer_class = ProjectMemberSerializer


class ProjectWithMembersViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Project.objects.all()
    serializer_class = ProjectWithMembersSerializer
    pagination_class = None
    permission_classes = [CustomObjectPermissions]  # Django-Guardian
    filter_backends = [filters.ObjectPermissionsFilter]  # Django-Guardian
    http_method_names = ['get', 'head']

    def get_queryset(self):
        return self.get_serializer_class().setup_eager_loading(self.queryset)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def filter_queryset(self, queryset):
        # queryset = queryset.filter(user=self.request.user)
        return queryset


class ProjectScreenList(LoggingMixin, generics.ListCreateAPIView):
    """
    List all project screens, or create a new project screen.
    """

    queryset = ProjectScreen.objects.all()
    serializer_class = ProjectScreenSerializer


class ProjectScreenDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a project screen
    """

    queryset = ProjectScreen.objects.all()
    serializer_class = ProjectScreenSerializer


class ProjectScreenMultipleView(ListBulkCreateUpdateDestroyAPIView):
    """
    List all project screens, or create multiple a new project screen or update multiple or destroy multiple.
    """

    queryset = ProjectScreen.objects.all()
    serializer_class = ProjectScreenMultipleSerializer


class ScreenEventList(generics.ListCreateAPIView):
    """
    List all screen events, or create a new screen event.
    """

    queryset = ScreenEvent.objects.all()
    serializer_class = ScreenEventSerializer


class ScreenEventDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a screen event
    """

    queryset = ScreenEvent.objects.all()
    serializer_class = ScreenEventSerializer


class ProjectColumnList(generics.ListCreateAPIView):
    """
    List all project columns, or create a new project column.
    """

    queryset = ProjectColumn.objects.all()
    serializer_class = ProjectColumnSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['title', 'project']


class ProjectColumnDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a project column
    """

    queryset = ProjectColumn.objects.all()
    serializer_class = ProjectColumnSerializer


'''
class IsProjectFilterBackend(DjangoFilterBackend):
    """
    Filter that reveal projects for tasks
    """
    def filter_queryset(self, request, queryset, view):
        if request.query_params.get('project_id'):
            return queryset.filter(column__project=request.query_params.get('project_id'))
        else:
            pass
'''


class ColumnTaskList(generics.ListCreateAPIView):
    """
    List all column tasks, or create a new column task.
    """
    queryset = ColumnTask.objects.all()
    serializer_class = ColumnTaskSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['title', 'status', 'column', 'column__project']

    # Inject current user at the point of saving the instance
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class ColumnTaskDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a column task
    """

    queryset = ColumnTask.objects.all()
    serializer_class = ColumnTaskSerializer


class ProjectActivityList(generics.ListCreateAPIView):
    """
    List all project activities, or create a new project activity.
    """

    queryset = ProjectActivity.objects.all()
    serializer_class = ProjectActivitySerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ProjectActivityDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a project activity detail
    """

    queryset = ProjectActivity.objects.all()
    serializer_class = ProjectActivitySerializer


class ProjectInvitationList(generics.ListCreateAPIView):
    """
    List all project invitations, or create a new project invitation.
    """

    queryset = ProjectInvitation.objects.all()
    serializer_class = ProjectInvitationSerializer


class ProjectInvitationDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a project invitation
    """

    queryset = ProjectInvitation.objects.all()
    serializer_class = ProjectInvitationSerializer


class ScreenAssigneeList(generics.ListCreateAPIView):
    """
    List all screen assignees, or create a new project screen assignee.
    """

    queryset = ScreenAssignee.objects.all()
    serializer_class = ScreenAssigneeSerializer


class ScreenAssigneeDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a screen assignee
    """

    queryset = ScreenAssignee.objects.all()
    serializer_class = ScreenAssigneeSerializer


class TaskTimeList(generics.ListCreateAPIView):
    """
    List all task times, or create a new task time activity.
    """

    queryset = TaskTime.objects.all()
    serializer_class = TaskTimeSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class TaskTimeDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a task time detail
    """

    queryset = TaskTime.objects.all()
    serializer_class = TaskTimeSerializer


class ProjectIllustrationSetList(generics.ListCreateAPIView):
    """
    List all illustration sets, or create a new illustration set.
    """

    queryset = ProjectIllustrationSet.objects.all()
    serializer_class = IllustrationSetSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['project']


class ProjectIllustrationSetDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete illustration set
    """

    queryset = ProjectIllustrationSet.objects.all()
    serializer_class = IllustrationSetSerializer


class IllustrationSetImageList(generics.ListCreateAPIView):
    """
    List all IllustrationSet images, or create a new IllustrationSet image.
    """

    queryset = ProjectImage.objects.all()
    serializer_class = ImageSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['illustration_set']


class IllustrationSetImageDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete IllustrationSet image
    """

    queryset = ProjectImage.objects.all()
    serializer_class = ImageSerializer


class IllustrationSetImagePaletteList(generics.ListCreateAPIView):
    """
    List all IllustrationSet images, or create a new IllustrationSet image.
    """

    queryset = ProjectImage.objects.all()
    serializer_class = ImagePaletteSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['illustration_set']


class IllustrationSetImagePaletteDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete IllustrationSet image
    """

    queryset = ProjectImage.objects.all()
    serializer_class = ImagePaletteSerializer


class ScreenCommentList(generics.ListCreateAPIView):
    """
    List all screen comments, or create a new screen comment.
    """

    queryset = ScreenComment.objects.all()
    serializer_class = ScreenCommentSerializer


class ScreenCommentDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a screen comment
    """

    queryset = ScreenComment.objects.all()
    serializer_class = ScreenCommentSerializer


class CommentList(generics.ListCreateAPIView):
    """
    List all comments, or create a new comment.
    """

    queryset = Comment.objects.all()
    serializer_class = CommentSerializer


class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a comment
    """

    queryset = Comment.objects.all()
    serializer_class = CommentSerializer


# Scenarios with elements api views
class ScreeScenarioViewSet(viewsets.ModelViewSet):
    queryset = ScreenScenario.objects.all()
    serializer_class = ScreenScenarioSerializer

    def get_queryset(self):
        return self.get_serializer_class().setup_eager_loading(self.queryset)

    def filter_queryset(self, queryset):
        screen_id = self.request.query_params.get('screenId')

        if screen_id and screen_id.isdigit():
            queryset = queryset.filter(screen=screen_id)

        return queryset


class ScreenScenarioMultipleView(ListBulkCreateUpdateDestroyAPIView):
    """
    List all screen scenarios, or create multiple a new screen scenario or update multiple or destroy multiple.
    """

    queryset = ScreenScenario.objects.all()
    serializer_class = ScreenScenarioMultipleSerializer


# This should be updated
class ScreenScenarioDestroyCascadeViewSet(BulkModelViewSet):
    serializer_class = ScreenScenarioMultipleSerializer

    def get_queryset(self):
        ids = self.request.query_params.get("ids", None)
        qs = ScreenScenario.objects.all()
        if ids:
            ids_list = ids.split(",")
            # print("ids", ids,ids[0],ids[1],ids[2],ids[3],ids[4])
            print("ids", ids_list)
            # return qs.filter((id__in=ids_list) )
            # return qs.filter((id__in=ids_list) )
            return qs.filter(id__in=ids_list)
            # Check for parent_id only
            # return qs.filter(self.kwargs['parent_id'] in ids_list)
        else:
            return qs

    def allow_bulk_destroy(self, qs, filtered):
        """Don't forget to fine-grain this method"""
        # custom logic here
        # default checks if the qs was filtered
        # qs comes from self.get_queryset()
        # filtered comes from self.filter_queryset(qs)
        ids = self.request.query_params.get("ids", None)
        if ids:
            return qs


class ScenarioElementViewSet(viewsets.ModelViewSet):
    queryset = ScenarioElement.objects.all()
    serializer_class = ScenarioElementSerializer
    # pagination_class = ScenarioElementCursorSetPagination
    pagination_class = None

    def filter_queryset(self, queryset):
        ids = self.request.query_params.get('scenariosIds')
        is_shared = self.request.query_params.get('is_shared')

        if ids:
            scenarios_ids = ids.split(',')
            if all(sid.isdigit() for sid in scenarios_ids):
                queryset = queryset.filter(scenario__in=scenarios_ids)

        if is_shared:
            queryset = queryset.filter(shared=True)

        return queryset


class ScenarioElementCreateMultiple(generics.CreateAPIView):
    """
    Create multiple scenario elements.
    """

    queryset = ScenarioElement.objects.all()
    # queryset = ScenarioElement.objects.root_nodes()
    serializer_class = ScenarioElementSerializer

    def get_serializer(self, instance=None, data=None, many=False, partial=False):
        return super(ScenarioElementCreateMultiple, self).get_serializer(
            instance=instance, data=data, many=True, partial=partial
        )


class ScenarioElementMultipleView(ListBulkCreateUpdateDestroyAPIView):
    """
    List all scenario elements, or create multiple a new scenario element or update multiple or destroy multiple.
    """

    queryset = ScenarioElement.objects.all()
    # queryset = ScenarioElement.objects.root_nodes()
    serializer_class = ScenarioElementMultipleSerializer


class ScenarioElementRecursiveViewSet(viewsets.ModelViewSet):
    """
    List all scenario elements, or single element, or PATCH the element via the children array
    """
    queryset = ScenarioElement.objects.all()
    # queryset = ScenarioElement.objects.root_nodes()
    serializer_class = ScenarioElementSerializerRecursive
    http_method_names = ['get', 'patch', 'head']


class ElementCommentList(generics.ListCreateAPIView):
    """
    List all element comments, or create a new element comment.
    """

    queryset = ElementComment.objects.all()
    serializer_class = ElementCommentSerializer

    # Inject current user at the point of saving the instance
    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class ElementCommentDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a element comment
    """

    queryset = ElementComment.objects.all()
    serializer_class = ElementCommentSerializer


class ColumnTaskCommentList(generics.ListCreateAPIView):
    """
    List all column task comments, or create a new column task comment.
    """

    queryset = ColumnTaskComment.objects.all()
    serializer_class = ColumnTaskCommentSerializer

    # Inject current user at the point of saving the instance
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ColumnTaskCommentDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a column task comment
    """

    queryset = ColumnTaskComment.objects.all()
    serializer_class = ColumnTaskCommentSerializer


class ColumnTaskCheckitemList(generics.ListCreateAPIView):
    """
    List all column task checklist items, or create a new column task checklist item.
    """

    queryset = ColumnTaskCheckitem.objects.all()
    serializer_class = ColumnTaskCheckitemSerializer


class ColumnTaskCheckitemDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a column task  checklist item
    """

    queryset = ColumnTaskCheckitem.objects.all()
    serializer_class = ColumnTaskCheckitemSerializer


class AssignPermissionsmapProject(APIView):
    VIEW_PROJECT_PERMISSION = "view_project"
    CHANGE_PROJECT_PERMISSION = "change_project"
    ASSIGN_PROJECT_PERMISSION = "assign_project"
    DELETE_PROJECT_PERMISSION = "delete_project"
    ADD_PROJECT_PERMISSION = "add_project"
    PROJECT_PERMISSION = (
        (VIEW_PROJECT_PERMISSION, "view_project"),
        (CHANGE_PROJECT_PERMISSION, "change_project"),
        (ASSIGN_PROJECT_PERMISSION, "assign_project"),
        (DELETE_PROJECT_PERMISSION, "delete_project"),
        (ADD_PROJECT_PERMISSION, "add_project"),
    )

    def post(self, request):
        username = request.data['username']
        projectid = request.data['projectid']
        permissions = request.data['permissions']
        user = User.objects.get(username=username)
        project = Project.objects.get(pk=projectid)
        current_profile = user.profile
        avatar = ""
        try:
            o = urlparse(request.build_absolute_uri())
            avatar = "https://" + o.netloc + MEDIA_URL + str(current_profile.avatar)
            # print(avatar)
        except Exception:
            pass

        # get schat_client user
        schat_users = schat_client.query_users({"id": {"$in": [str(user.id)]}})
        if not (schat_users["users"]):
            schat_client.update_user({"id": str(user.id)})

        # print("schat_users", schat_users)
        # extract teams array if exist,
        teams = []
        try:
            teams = schat_users["users"][0]["teams"]
            print("teams", teams)
        except Exception:
            pass
        finally:
            pass

        for permission in self.PROJECT_PERMISSION:
            remove_perm(permission[1], user, project)
            # A Stream chat connection
            if str(project.id) not in teams:
                print("non teams")
            else:
                print("with teams")
                teams.remove(str(project.id))
                schat_client.update_user_partial(
                    {"id": str(user.id), "set": {"name": username, "image": avatar, "teams": teams}}
                )

        for permission in permissions:
            assign_perm(permission, user, project)
            # A Stream chat connection
            if str(project.id) in teams:
                print("with teams0")
                pass
            else:
                print("non teams0")
                teams.append(str(project.id))
                print("teams1", teams)
                schat_client.update_user_partial(
                    {"id": str(user.id), "set": {"name": username, "image": avatar, "teams": teams}}
                )

        rp = get_perms(user, project)

        return Response({"permissions": rp}, status=status.HTTP_200_OK)


class AssignPermissionsProject(APIView):
    VIEW_PROJECT_PERMISSION = "view_project"
    CHANGE_PROJECT_PERMISSION = "change_project"
    PROJECT_PERMISSION = (
        (VIEW_PROJECT_PERMISSION, "view_project"),
        (CHANGE_PROJECT_PERMISSION, "change_project"),
    )

    def post(self, request):
        username = request.data['username']
        projectid = request.data['projectid']
        permission = request.data['permission']
        user = User.objects.get(username=username)
        project = Project.objects.get(pk=projectid)
        assign_perm(permission, user, project)
        rp = get_perms(user, project)
        if(rp):
            return Response({"permissions": rp}, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class RemovePermissionsProject(APIView):
    VIEW_PROJECT_PERMISSION = "view_project"
    CHANGE_PROJECT_PERMISSION = "change_project"
    PROJECT_PERMISSION = (
        (VIEW_PROJECT_PERMISSION, "view_project"),
        (CHANGE_PROJECT_PERMISSION, "change_project"),
    )

    def post(self, request):
        username = request.data['username']
        projectid = request.data['projectid']
        permission = request.data['permission']
        user = User.objects.get(username=username)
        project = Project.objects.get(pk=projectid)
        remove_perm(permission, user, project)
        rp = get_perms(user, project)
        if(rp):
            return Response({"permissions": rp}, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class DisplayPermissionsProject(APIView):
    VIEW_PROJECT_PERMISSION = "view_project"
    CHANGE_PROJECT_PERMISSION = "change_project"
    PROJECT_PERMISSION = (
        (VIEW_PROJECT_PERMISSION, "view_project"),
        (CHANGE_PROJECT_PERMISSION, "change_project"),
    )

    def post(self, request):
        username = request.data['username']
        projectid = request.data['projectid']
        user = User.objects.get(username=username)
        project = Project.objects.get(pk=projectid)
        rp = get_perms(user, project)
        if rp:
            return Response({"permissions": rp}, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class DisplayPermissionsAllusers(APIView):
    VIEW_PROJECT_PERMISSION = "view_project"
    CHANGE_PROJECT_PERMISSION = "change_project"
    PROJECT_PERMISSION = (
        (VIEW_PROJECT_PERMISSION, "view_project"),
        (CHANGE_PROJECT_PERMISSION, "change_project"),
    )

    def post(self, request):
        projectid = request.data['projectid']
        project = Project.objects.get(pk=projectid)
        users_list = get_users_with_perms(project)
        rp_users_list = []
        for user in users_list:
            userseries = UserSerializer(user)
            print(userseries.data)
            rp = get_perms(user, project)
            rdictionary = {"permissions": rp, "userdata": userseries.data}
            rp_users_list.append(rdictionary)

        if rp_users_list:
            return Response(rp_users_list, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


# Copying the project
class ProjectcopyView(APIView):
    VIEW_PROJECT_PERMISSION = "view_project"
    CHANGE_PROJECT_PERMISSION = "change_project"
    DELETE_PROJECT_PERMISSION = "delete_project"
    PROJECT_PERMISSION = (
        (VIEW_PROJECT_PERMISSION, "view_project"),
        (CHANGE_PROJECT_PERMISSION, "change_project"),
        (DELETE_PROJECT_PERMISSION, "delete_project"),
    )
    permission_classes = (permissions.IsAuthenticated,)
    # https://stackoverflow.com/questions/30203652/how-to-get-request-user-in-django-rest-framework-serializer
    # user = serializers.PrimaryKeyRelatedField(default=serializers.CurrentUserDefault())

    def post(self, request, format=None):
        WHITELIST = ['projects', 'projectscreen', 'screenscenario', 'elements', 'children', 'projectillustrationset', 'images']
        projectid = request.data['projectid']
        project = Project.objects.get(pk=projectid)
        project_clone = duplicate_model_with_descendants(project, WHITELIST)

        assign_perm("view_project", self.request.user, project_clone)
        assign_perm("change_project", self.request.user, project_clone)
        assign_perm("delete_project", self.request.user, project_clone)

        if project_clone:
            return Response(project_clone.id, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


# Copying the screen
class ScreencopyView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        WHITELIST = ['screenscenario', 'elements', 'children']
        screenid = request.data['screenid']
        screen = ProjectScreen.objects.get(pk=screenid)
        screen_clone = duplicate_model_with_descendants(screen, WHITELIST)

        if screen_clone:
            return Response(screen_clone.id, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


# Copying the element MPTT
class ElementmpttcopyView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        elementid = request.data['elementid']
        element = ScenarioElement.objects.get(pk=elementid)
        element_clone, counter = copy_children(element, parent=element.parent, new_node=True)
        # print("POST")
        # print("counter", counter)
        if element_clone:
            return Response(element_clone.id, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


# Copying the element
class ElementcopyView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        WHITELIST = ['elements', 'children']
        elementid = request.data['elementid']
        element = ScenarioElement.objects.get(pk=elementid)
        # element_clone = duplicate_model_with_descendants(element, WHITELIST)
        element_clone = duplicate_model_with_descendants(element, WHITELIST)
        # print("POST")
        # print("counter", counter)
        if element_clone:
            return Response(element_clone.id, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class ColumnsReorder(APIView):

    def patch(self, request, pk=None):
        """
        Update the order of the columns by the parent project id
        request.data is in the expected structure:
        column pk is in data.children.{n}.id
        """
        # because the data is expected to be nested dictionary
        decoded = request.body.decode('utf8')
        data = json.loads(decoded)
        # print(data)

        sorted_dict = {}
        for key, value in enumerate(data['children']):
            sorted_dict[value['id']] = key

        # sorted dict uses column pk as key and new order as value
        # print(pk)
        columns = ProjectColumn.objects.filter(project=pk)
        print(columns)
        for column in columns:
            print(column.id)
            column.buyoancy = sorted_dict[column.id]
        affected_rows = bulk_update(columns, update_fields=['buyoancy'])
        if affected_rows:
            return Response({'affected_rows': affected_rows})
        return Response({}, status.HTTP_204_NO_CONTENT)


class TasksReorder(APIView):

    def patch(self, request, pk=None):
        """
        Update the order of the tasks by the parent column id
        request.data is in the expected structure:
        task pk is in data.children.{n}.id
        """
        # because the data is expected to be nested dictionary
        decoded = request.body.decode('utf8')
        data = json.loads(decoded)
        # print(data)

        sorted_dict = {}
        for key, value in enumerate(data['children']):
            sorted_dict[value['id']] = key

        # sorted dict uses task pk as key and new order as value
        # print(pk)
        tasks = ColumnTask.objects.filter(column=pk)
        print(tasks)
        for task in tasks:
            print(task.id)
            task.buyoancy = sorted_dict[task.id]
        affected_rows = bulk_update(tasks, update_fields=['buyoancy'])
        if affected_rows:
            return Response({'affected_rows': affected_rows})
        return Response({}, status.HTTP_204_NO_CONTENT)

