from rest_framework import viewsets, status, generics
from rest_framework.views import APIView
from rest_framework.response import Response

from apps.activity.serializers import (
    ColumnTaskHistorySerializer,
    ProjectScreenHistorySerializer,
    ProjectHistorySerializer, UnionHistorySerializer,
)
from apps.projects.models import ColumnTask, ProjectScreen, Project

from django.apps import apps as django_apps

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


class UnionHistoryView(viewsets.ModelViewSet):
    q_p = Project.history.all().values('id', 'history_id', "created", "modified", "history_date",
                                       "history_change_reason", "history_type", "history_user", "name", "status")
    q_ps = ColumnTask.history.all().values('id', 'history_id', "created", "modified", "history_date",
                                           "history_change_reason", "history_type", "history_user", "description", "status")
    q_ct = ProjectScreen.history.all().values('id', 'history_id', "created", "modified", "history_date",
                                              "history_change_reason", "history_type", "history_user", "name", "status")

    queryset = q_p.union(q_ps, q_ct)
    # print(queryset)
    serializer_class = UnionHistorySerializer
    # print(serializer_class)
    filterset_fields = "__all__"


class UHistoryView(APIView):

    def get(self, request):
        q_p = Project.history.all().values('id', 'history_id', "created", "modified", "history_date", "history_change_reason", "history_type", "history_user")
        q_ps = ColumnTask.history.all().values('id', 'history_id', "created", "modified", "history_date", "history_change_reason", "history_type", "history_user")
        q_ct = ProjectScreen.history.all().values('id', 'history_id', "created", "modified", "history_date", "history_change_reason", "history_type", "history_user")

        queryset = q_p.union(q_ps, q_ct).order_by('history_date')

        data = queryset

        return Response(data, status=status.HTTP_200_OK)


class HistoryListApi(generics.ListAPIView):
    history_managers = []
    for model in django_apps.get_models():
        if 'Historical' in model._meta.object_name:
            history_managers.append(model)

    history_objects = []
    for manager in history_managers:
        history_objects += list(manager.objects.all())

    queryset = history_objects
