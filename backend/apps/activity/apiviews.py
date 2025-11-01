from django.db.models import Count, F, Value, CharField, IntegerField
from django.db.models.functions import Concat, Cast
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status, generics
from rest_framework.views import APIView
from rest_framework.response import Response

from apps.activity.serializers import (
    ColumnTaskHistorySerializer,
    ProjectScreenHistorySerializer,
    ProjectHistorySerializer,
    UnionHistorySerializer,
)
from apps.projects.models import ColumnTask, ProjectScreen, Project

from django.apps import apps as django_apps


class ColumnTaskHistoryView(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend]
    queryset = ColumnTask.history.all()
    serializer_class = ColumnTaskHistorySerializer
    filterset_fields = ["title", "status", "column__project", "column"]


class ProjectScreenHistoryView(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend]
    queryset = ProjectScreen.history.all()
    serializer_class = ProjectScreenHistorySerializer
    filterset_fields = "__all__"


class ProjectHistoryView(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend]
    queryset = Project.history.all()
    serializer_class = ProjectHistorySerializer
    filterset_fields = "__all__"


class UnionHistoryView(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend]
    # t = Project.__name__
    # print(t)
    q_p = (
        Project.history.all()
        .annotate(
            model=Value(Project.__name__, output_field=CharField()), project=F("id")
        )
        .values(
            "id",
            "history_id",
            "created",
            "modified",
            "history_date",
            "history_change_reason",
            "history_type",
            "history_user",
            "name",
            "status",
            "project",
            "model",
        )
    )
    # print(q_p)
    q_ps = (
        ColumnTask.history.all()
        .annotate(
            model=Value(ColumnTask.__name__, output_field=CharField()),
            project=F("column__project"),
        )
        .values(
            "id",
            "history_id",
            "created",
            "modified",
            "history_date",
            "history_change_reason",
            "history_type",
            "history_user",
            "description",
            "status",
            "project",
            "model",
        )
    )
    # print(q_ps)
    q_ct = (
        ProjectScreen.history.all()
        .annotate(
            model=Value(ProjectScreen.__name__, output_field=CharField()),
            proj=Cast("project", output_field=IntegerField()),
        )
        .values(
            "id",
            "history_id",
            "created",
            "modified",
            "history_date",
            "history_change_reason",
            "history_type",
            "history_user",
            "name",
            "status",
            "proj",
            "model",
        )
    )
    # print(q_ct)
    queryset = q_p.union(q_ps, q_ct).order_by("history_date")
    # queryset.filter(project='project')
    # print(queryset)
    serializer_class = UnionHistorySerializer
    # print(serializer_class)
    # filterset_fields = "__all__"
    filterset_fields = [
        "history_id",
        "history_date",
        "history_change_reason",
        "history_type",
        "history_user",
        "id",
    ]

    """
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
    """


class UHistoryView(APIView):
    def get(self, request):
        q_p = Project.history.all().values(
            "id",
            "history_id",
            "created",
            "modified",
            "history_date",
            "history_change_reason",
            "history_type",
            "history_user",
        )
        q_ps = ColumnTask.history.all().values(
            "id",
            "history_id",
            "created",
            "modified",
            "history_date",
            "history_change_reason",
            "history_type",
            "history_user",
        )
        q_ct = ProjectScreen.history.all().values(
            "id",
            "history_id",
            "created",
            "modified",
            "history_date",
            "history_change_reason",
            "history_type",
            "history_user",
        )

        queryset = q_p.union(q_ps, q_ct).order_by("history_date")

        data = queryset

        return Response(data, status=status.HTTP_200_OK)


class HistoryListApi(generics.ListAPIView):
    # Moved DB queries to get_queryset() to avoid execution during import
    def get_queryset(self):
        history_managers = []
        for model in django_apps.get_models():
            if "Historical" in model._meta.object_name:
                history_managers.append(model)

        history_objects = []
        for manager in history_managers:
            history_objects += list(manager.objects.all())

        return history_objects
