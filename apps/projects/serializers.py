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
)


class ProjectScreenSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectScreen
        fields = ("status", "project", "id")
        # fields = "__all__"


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
