from rest_framework import viewsets

from apps.activity.serializers import (
    ColumnTaskHistorySerializer,
    ProjectScreenHistorySerializer,
    ProjectHistorySerializer,
)
from apps.projects.models import ColumnTask, ProjectScreen, Project


class ColumnTaskHistoryView(viewsets.ModelViewSet):
    queryset = ColumnTask.history.all()
    serializer_class = ColumnTaskHistorySerializer
    filterset_fields = "__all__"


class ProjectScreenHistoryView(viewsets.ModelViewSet):
    queryset = ProjectScreen.history.all()
    serializer_class = ProjectScreenHistorySerializer
    filterset_fields = "__all__"


class ProjectHistoryView(viewsets.ModelViewSet):
    queryset = Project.history.all()
    serializer_class = ProjectHistorySerializer
    filterset_fields = "__all__"
