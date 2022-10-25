from rest_framework import serializers

from apps.accounts.serializers import UserSimpleSerializer
from apps.projects.models import ColumnTask, ProjectScreen, Project


class ColumnTaskHistorySerializer(serializers.ModelSerializer):
    history_user = UserSimpleSerializer()
    assignee = UserSimpleSerializer()
    responsible = UserSimpleSerializer()
    class Meta:
        model = ColumnTask.history.model
        fields = "__all__"

    '''
    def get_model(self, instance):
        try:
            return instance.__class__.__name__
        except:
            return None
    '''

class ProjectScreenHistorySerializer(serializers.ModelSerializer):
    history_user = UserSimpleSerializer()
    # model = serializers.CharField()
    class Meta:
        model = ProjectScreen.history.model
        fields = (
            "history_id",
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
            "history_user",
            # "model",
        )


class ProjectHistorySerializer(serializers.ModelSerializer):
    # model = serializers.CharField()
    history_user = UserSimpleSerializer()
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
    # history_user = serializers.IntegerField()
    history_user = serializers.IntegerField()
    name = serializers.CharField()
    status = serializers.CharField()
    project = serializers.IntegerField()

    model = serializers.CharField()

    class Meta:
        fields = (
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

    extra_kwargs = {"history_user": {"read_only": True}}