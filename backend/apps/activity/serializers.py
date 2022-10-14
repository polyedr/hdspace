from rest_framework import serializers
from apps.projects.models import ColumnTask, ProjectScreen, Project


class ColumnTaskHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ColumnTask.history.model
        fields = "__all__"


class ProjectScreenHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectScreen.history.model
        fields = ("history_id",
            "id",
            "modified",
            "name",
            "buoyancy",
            "status",
            "created",
            "updated",
            "image",
            "history_date",
            "history_change_reason",
            "history_type",
            "project",
            "history_user"
            )


class ProjectHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Project.history.model
        fields = "__all__"
