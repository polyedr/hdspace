"""Serializers for the projects"""

from rest_framework import serializers
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
    Scenario,
)


class ProjectScreenSerializer(serializers.ModelSerializer):
    screen_data_json = serializers.JSONField()

    class Meta:
        model = ProjectScreen
        # fields = ("status", "screen_data", "project", "id", "image")
        fields = (
            "status",
            "project",
            "name",
            "id",
            "image",
            "screen_data_text",
            "screen_data_json",
            "screenscenario",
        )
        extra_kwargs = {"screenscenario": {"read_only": True}}
        # fields = ("status", "project", "id", "image")
        # fields = "__all__"


class ScreenScenarioSerializer(serializers.ModelSerializer):
    parameters = serializers.JSONField()
    styles = serializers.JSONField()

    class Meta:
        model = ScreenScenario
        fields = (
            "id",
            "screen",
            "name",
            "type",
            "buoyancy",
            "elements",
            "parameters",
            "styles",
            # "screenscenario"
        )
        extra_kwargs = {"elements": {"read_only": True}}
        # fields = "__all__"


class ScenarioElementSerializer(serializers.ModelSerializer):
    parameters = serializers.JSONField()
    styles = serializers.JSONField()

    class Meta:
        model = ScenarioElement
        fields = (
            "id",
            "scenario",
            "name",
            "element_id",
            "type",
            "buoyancy",
            "parameters",
            "styles",
        )


class ProjectSerializer(serializers.ModelSerializer):
    projectscreen = ProjectScreenSerializer(many=True, read_only=True)
    # users = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        # fields = ("preview", "name", "status", "projectscreen")
        fields = ("preview", "name", "status", "projectscreen", "id")
        # fields = "__all__"
        extra_kwargs = {"preview": {"read_only": True}}

    def create(self, validated_data):
        project = Project(name=validated_data["name"], status=validated_data["status"])
        project.preview = project.generate_preview_token()
        project.save()
        return project


class ScreenEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScreenEvent
        fields = ("href", "link_screen", "new_window", "height", "width", "x", "y")


class ElementSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    element_id = serializers.CharField(max_length=64)
    type = serializers.ListField()
    buoyancy = serializers.ListField()
    # parameters = serializers.JSONField()
    parameters = serializers.ListField()

    def create(self, validated_data):
        return Element(id=None, **validated_data)

    def update(self, instance, validated_data):
        for field, value in validated_data.items():
            setattr(instance, field, value)
        return instance


class ScenarioSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    type = serializers.CharField(max_length=64)

    def create(self, validated_data):
        return Scenario(id=None, **validated_data)

    def update(self, instance, validated_data):
        for field, value in validated_data.items():
            setattr(instance, field, value)
        return instance


class ScreenCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScreenComment
        fields = ("x", "y")


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "text"


class ProjectInvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectInvitation
        fields = ("invitation_token", "is_active", "email", "role")


class ProjectMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMember
        fields = ("role", "status")


class ProjectTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectTask
        fields = ("title", "description", "status")


class TaskTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskTime
        fields = ("track_time", "started", "stoped")


class ScreenAssigneeSerializer(serializers.ModelSerializer):
    pass


class ProjectActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectActivity
        fields = ("type", "created")
