"""Views for the projects api"""

from rest_framework import generics
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
    ScreenScenario, ScenarioElement)
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
    ScreenScenarioSerializer, ScenarioElementSerializer)


class ProjectList(generics.ListCreateAPIView):
    """
    List all projects, or create a new project.
    """

    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class ProjectDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a project detail
    """

    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


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


class ScreenScenarioDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a screen scenario
    """

    queryset = ScreenScenario.objects.all()
    serializer_class = ScreenScenarioSerializer

class ScenarioElementList(generics.ListCreateAPIView):
    """
    List all scenario elements, or create a new scenario element.
    """

    queryset = ScenarioElement.objects.all()
    serializer_class = ScenarioElementSerializer


class ScenarioElementDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a scenario element
    """

    queryset = ScenarioElement.objects.all()
    serializer_class = ScenarioElementSerializer

