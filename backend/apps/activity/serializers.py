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


class UnionHistorySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    history_id = serializers.IntegerField()
    created = serializers.DateTimeField()
    modified = serializers.DateTimeField()
    history_date = serializers.DateTimeField()
    history_change_reason = serializers.CharField()
    history_type = serializers.CharField()
    history_user = serializers.IntegerField()
    name = serializers.CharField()
    status = serializers.CharField()
    project = serializers.IntegerField()

    class Meta:
        fields = ['id', 'history_id', "created", "modified", "history_date", "history_change_reason", "history_type", "history_user", "name", "status", "project"]
