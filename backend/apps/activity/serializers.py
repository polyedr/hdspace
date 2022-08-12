from rest_framework import serializers
from apps.projects.models import ColumnTask, ProjectScreen, Project


class ColumnTaskHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ColumnTask.history.model
        fields = "__all__"


class ProjectScreenHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectScreen.history.model
        fields = "__all__"


class ProjectHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Project.history.model
        fields = "__all__"
