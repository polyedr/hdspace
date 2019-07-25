"""Views for the projects api"""
from rest_framework.filters import OrderingFilter, BaseFilterBackend
from django_filters.rest_framework import DjangoFilterBackend, FilterSet
from rest_framework import generics, viewsets, status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework_bulk import ListBulkCreateUpdateDestroyAPIView, BulkModelViewSet
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated

from .models import (
    Project,
    ProjectMember,
    ProjectScreen,
    ScreenEvent,
    ProjectTask,
    ProjectActivity,
    ProjectInvitation,
    ScreenAssignee,
    TaskTime,
    ScreenComment,
    Comment,
    ScreenScenario,
    ScenarioElement,
    Element,
    elements,
    scenarios,
)
from .serializers import (
    ProjectSerializer,
    ProjectMemberSerializer,
    ProjectScreenSerializer,
    ScreenEventSerializer,
    ProjectInvitationSerializer,
    ProjectActivitySerializer,
    ProjectTaskSerializer,
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
    ScreenScenarioCascadeSerializer,
)


@permission_classes([IsAuthenticated])
class ProjectList(generics.ListCreateAPIView):
    """
    get:
    Return a list of all the existing projects.

    post:
    Create a new project instance.
    """

    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class ProjectDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a project detail
    """

    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


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


class ProjectMemberList(generics.ListCreateAPIView):
    """
    List all project details, or create a new project detail.
    """

    queryset = ProjectMember.objects.all()
    serializer_class = ProjectMemberSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ProjectMemberDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a project member detail
    """

    queryset = ProjectMember.objects.all()
    serializer_class = ProjectMemberSerializer


class ProjectScreenList(generics.ListCreateAPIView):
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


class ProjectTaskList(generics.ListCreateAPIView):
    """
    List all project tasks, or create a new project task.
    """

    queryset = ProjectTask.objects.all()
    serializer_class = ProjectTaskSerializer


class ProjectTaskDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a project task
    """

    queryset = ProjectTask.objects.all()
    serializer_class = ProjectTaskSerializer


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
class ScreenScenarioList(generics.ListCreateAPIView):
    """
    List all screen scenarios, or create a new screen scenario.
    """

    queryset = ScreenScenario.objects.all()
    serializer_class = ScreenScenarioSerializer


class ScreenScenarioMultipleView(ListBulkCreateUpdateDestroyAPIView):
    """
    List all screen scenarios, or create multiple a new screen scenario or update multiple or destroy multiple.
    """

    queryset = ScreenScenario.objects.all()
    serializer_class = ScreenScenarioMultipleSerializer


class ScreenScenarioDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a screen scenario
    """

    queryset = ScreenScenario.objects.all()
    serializer_class = ScreenScenarioSerializer

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
            # return qs.filter(id__in = ids_list)
            # Check for parent_id only
            return qs.filter(self.kwargs['parent_id'] in ids_list)
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


class ScenarioElementList(generics.ListCreateAPIView):
    """
    List all scenario elements, or create a new scenario element.
    """

    queryset = ScenarioElement.objects.all()
    serializer_class = ScenarioElementSerializer


class ScenarioElementCreateMultiple(generics.CreateAPIView):
    """
    Create multiple scenario elements.
    """

    queryset = ScenarioElement.objects.all()
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
    serializer_class = ScenarioElementMultipleSerializer


class ScenarioElementDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a scenario element
    """

    queryset = ScenarioElement.objects.all()
    serializer_class = ScenarioElementSerializer
