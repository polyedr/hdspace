"""Serializers for the projects"""

from io import BytesIO
from django.core.files.uploadedfile import UploadedFile
import requests
from urllib.parse import urlparse
from rest_framework import serializers
from rest_framework_bulk import BulkSerializerMixin, BulkListSerializer
from rest_framework_recursive.fields import RecursiveField

# from drf_writable_nested.serializers import WritableNestedModelSerializer

from apps.accounts.serializers import UserSerializer
from .models import (
    Project,
    ProjectMember,
    ProjectScreen,
    ScreenEvent,
    ProjectActivity,
    ProjectInvitation,
    TaskTime,
    ScreenComment,
    Comment,
    ScreenScenario,
    ScenarioElement,
    Element,
    Scenario,
    ElementComment, ProjectImage, ProjectIllustrationSet, ProjectColumn, ColumnTask)


class ProjectScreenSerializer(serializers.ModelSerializer):
    screen_data_json = serializers.JSONField()

    class Meta:
        model = ProjectScreen
        # fields = ("status", "screen_data", "project", "id", "image")
        fields = (
            "status",
            "project",
            "name",
            "buoyancy",
            "id",
            "image",
            "screen_data_text",
            "screen_data_json",
            "screenscenario",
        )
        extra_kwargs = {"screenscenario": {"read_only": True}}


class ProjectScreenMultipleSerializer(BulkSerializerMixin, serializers.ModelSerializer):
    screen_data_json = serializers.JSONField()

    class Meta:
        model = ProjectScreen
        fields = (
            "status",
            "project",
            "name",
            "buoyancy",
            "id",
            "image",
            "screen_data_text",
            "screen_data_json",
            "screenscenario",
        )
        extra_kwargs = {"screenscenario": {"read_only": True}}
        list_serializer_class = BulkListSerializer


class ScenarioElementSerializer(serializers.ModelSerializer):
    parameters = serializers.JSONField()
    styles = serializers.JSONField()
    children = RecursiveField(required=False, allow_null=True, many=True)
    scenario = serializers.PrimaryKeyRelatedField(source="scenario.id", read_only=True)
    # image = serializers.ImageField()

    class Meta:
        model = ScenarioElement
        fields = (
            "id",
            "scenario",
            "name",
            "children",
            "struct_type",
            "func_type",
            "direction",
            "buoyancy",
            "image",
            "parameters",
            "styles",
            "shared",
        )
        ref_name = "ScenarioElements"  # Added to avoid SwaggerGeneration Conflicts

    def create(self, validated_data):
        # Remove nested objects to handle separately
        children = validated_data.pop("children", [])
        node = ScenarioElement.objects.create(
            # parent is null only on the root node
            parent=self.context.get("parent"),
            **validated_data
        )
        # Multiple level of the recursion
        for child_data in children:
            s = ScenarioElementSerializer(data=child_data, context={"parent": node})
            s.is_valid(raise_exception=True)
            s.save()
        return node

    def update(self, instance, validated_data):
        # Remove nested objects to handle separately
        children = validated_data.pop("children", [])
        node = super().update(instance, validated_data)
        for child_data in children:
            # child_data['scenario'] = child_data['scenario'].pk
            s = ScenarioElementSerializer(data=child_data, context={"parent": node})
            s.is_valid(raise_exception=True)
            s.save()
        return node


# The serializer to change the children array only
class ScenarioElementSerializerRecursive(serializers.ModelSerializer):
    children = serializers.PrimaryKeyRelatedField(
        queryset=ScenarioElement.objects.all(), many=True, required=False
    )

    class Meta:
        model = ScenarioElement
        fields = ("id", "name", "children")


class ScenarioElementMultipleSerializer(
    BulkSerializerMixin, serializers.ModelSerializer
):
    parameters = serializers.JSONField()
    styles = serializers.JSONField()
    children = RecursiveField(required=False, allow_null=True, many=True)
    scenario = serializers.PrimaryKeyRelatedField(source="scenario.id", read_only=True)

    class Meta:
        model = ScenarioElement
        fields = (
            "id",
            "scenario",
            "name",
            "children",
            "struct_type",
            "func_type",
            "direction",
            "buoyancy",
            "image",
            "parameters",
            "styles",
            "shared",
        )
        list_serializer_class = BulkListSerializer

    def create(self, validated_data):
        # Remove nested objects to handle separately
        children = validated_data.pop("children", [])
        node = ScenarioElement.objects.create(
            # parent is null only on the root node
            parent=self.context.get("parent"),
            **validated_data
        )
        for child_data in children:
            # child_data['scenario'] = child_data['scenario'].pk
            s = ScenarioElementSerializer(data=child_data, context={"parent": node})
            s.is_valid(raise_exception=True)
            s.save()
        return node

    def update(self, instance, validated_data):
        # Remove nested objects to handle separately
        children = validated_data.pop("children", [])
        node = super().update(instance, validated_data)
        for child_data in children:
            # child_data['scenario'] = child_data['scenario'].pk
            s = ScenarioElementSerializer(data=child_data, context={"parent": node})
            s.is_valid(raise_exception=True)
            s.save()
        return node


class ScenarioElementMultipleRecursiveSerializer(
    BulkSerializerMixin, serializers.ModelSerializer
):
    children = serializers.PrimaryKeyRelatedField(
        queryset=ScenarioElement.objects.all(), many=True, required=False
    )

    class Meta:
        model = ScenarioElement
        fields = ("id", "name", "children")
        list_serializer_class = BulkListSerializer

    def create(self, validated_data):
        # Remove nested objects to handle separately
        children = validated_data.pop("children", [])
        node = ScenarioElement.objects.create(
            # parent is null only on the root node
            parent=self.context.get("parent"),
            **validated_data
        )
        for child_data in children:
            # child_data['scenario'] = child_data['scenario'].pk
            s = ScenarioElementSerializerRecursive(data=child_data, context={"parent": node})
            s.is_valid(raise_exception=True)
            s.save()
        return node


class ScreenScenarioSerializer(serializers.ModelSerializer):
    # elements = ScenarioElementSerializer(many=True, read_only=True)
    parameters = serializers.JSONField()
    styles = serializers.JSONField()

    class Meta:
        model = ScreenScenario
        fields = (
            "id",
            "screen",
            "name",
            "parent_id",
            "type",
            "struct_type",
            "direction",
            "buoyancy",
            "elements",
            "parameters",
            "styles",
            # "screenscenario"
        )
        # extra_kwargs = {"elements": {"read_only": True}}
        # fields = "__all__"

    @staticmethod
    def setup_eager_loading(qs):
        queryset = qs.prefetch_related("elements")
        return queryset


class ScreenScenarioMultipleSerializer(
    BulkSerializerMixin, serializers.ModelSerializer
):
    parameters = serializers.JSONField()
    styles = serializers.JSONField()

    class Meta:
        model = ScreenScenario
        fields = (
            "id",
            "screen",
            "name",
            "parent_id",
            "type",
            "struct_type",
            "direction",
            "buoyancy",
            "elements",
            "parameters",
            "styles",
            # "screenscenario"
        )
        list_serializer_class = BulkListSerializer


# DRF-Guardian Test
from rest_framework_guardian.serializers import ObjectPermissionsAssignmentMixin
from django.contrib.auth.models import Group
# from rest_framework import permissions


class ProjectSerializer(ObjectPermissionsAssignmentMixin, serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    projectscreen = serializers.PrimaryKeyRelatedField(
        many=True, queryset=ProjectScreen.objects.all()
    )
    # print('inside serializer, user is :' + str(user))

    class Meta:
        model = Project
        fields = (
            "preview",
            "name",
            "favicon",
            "status",
            "projectscreen",
            "user",
            "id",
            "created",
            "updated",
            "project_data_text",
            "project_data_json",
        )
        extra_kwargs = {
            "preview": {"read_only": True},
            "created": {"read_only": True},
            "updated": {"read_only": True},
        }

    def get_permissions_map(self, created):  # DRF-Guardian Mixins
        current_user = self.context["request"].user
        # readers = Group.objects.get(name="readers")
        # supervisors = Group.objects.get(name="supervisors")
        # print('inside permission map, User is :' + str(current_user))  # Triggers only when POST
        return {
            # 'view_project': [current_user, readers],
            # 'change_project': [current_user],
            # 'delete_project': [current_user, supervisors]
            'view_project': [current_user],
            'change_project': [current_user],
            'delete_project': [current_user]
        }

    def create(self, validated_data):
        projectscreens_data = validated_data.pop("projectscreen")
        project = Project(id=None, **validated_data)
        project.preview = project.generate_preview_token()
        project.save()
        project.name = "AProject-" + str(project.id)
        project.save()
        project.projectscreen.set(projectscreens_data, clear=True)
        return project

    def update(self, instance, validated_data):
        """
        Update and return an existing `Project` instance, given the validated data.
        """
        instance = super(ProjectSerializer, self).update(instance, validated_data)
        projectscreens_data = validated_data.get("projectscreen")
        instance.projectscreen.set(projectscreens_data, clear=True)
        instance.save()
        return instance

    @staticmethod
    def setup_eager_loading(qs):
        queryset = qs.select_related("user").prefetch_related("projectscreen")
        return queryset


class ProjectWithScreensSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    projectscreen = ProjectScreenSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = (
            "preview",
            "name",
            "favicon",
            "status",
            "projectscreen",
            "user",
            "id",
            "created",
            "updated",
            "project_data_text",
            "project_data_json",
        )
        extra_kwargs = {
            "preview": {"read_only": True},
            "created": {"read_only": True},
            "updated": {"read_only": True},
        }

    @staticmethod
    def setup_eager_loading(qs):
        queryset = qs.select_related("user").prefetch_related("projectscreen")
        return queryset


class ScreenEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScreenEvent
        fields = ("href", "link_screen", "new_window", "height", "width", "x", "y")


class ElementSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    struct_type = serializers.CharField(max_length=64)
    func_type = serializers.ListField()
    buoyancy = serializers.ListField()
    image = serializers.ImageField(max_length=256)
    parameters = serializers.ListField()
    styles = serializers.ListField()

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


class ColumnTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = ColumnTask
        fields = ("id", "title", "description", "status", "column", "creator", "owner")
        extra_kwargs = {
            "creator": {"read_only": True},
        }


class ColumnWithTasksSerializer(serializers.ModelSerializer):
    columntask = ColumnTaskSerializer(many=True, read_only=True)

    class Meta:
        model = ProjectColumn
        fields = (
            "id",
            "title",
            "description",
            "project",
            "columntask",
        )


class ProjectColumnSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectColumn
        fields = ("id", "title", "description", "project")


class ProjectWithColumnsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    projectcolumn = ProjectColumnSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = (
            "preview",
            "name",
            "favicon",
            "status",
            "projectcolumn",
            "user",
            "id",
            "created",
            "updated",
            "project_data_text",
            "project_data_json",
        )
        extra_kwargs = {
            "preview": {"read_only": True},
            "created": {"read_only": True},
            "updated": {"read_only": True},
        }

    @staticmethod
    def setup_eager_loading(qs):
        queryset = qs.select_related("user").prefetch_related("projectcolumn")
        return queryset


class TaskTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskTime
        fields = ("track_time", "started", "stoped")


class ImageSerializer(serializers.ModelSerializer):
    fileurl = serializers.URLField(allow_blank=True, allow_null=True, required=False)

    class Meta:
        model = ProjectImage
        fields = ("id", "image", "created", "modified", "illustration_set", "fileurl",)
        extra_kwargs = {
            "fileurl": {"write_only": True},
        }

    def create(self, validated_data):
        url = validated_data.pop("fileurl", None)
        if url:
            response = requests.get(url)
            # Set FileField to binary file
            filename = urlparse(url).path.split("/")[-1]
            validated_data["image"] = UploadedFile(
                BytesIO(response.content), name=filename
            )
        fileupload = ProjectImage(id=None, **validated_data)
        fileupload.save()
        return fileupload


class IllustrationSetSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)

    class Meta:
        model = ProjectIllustrationSet
        fields = (
            "id",
            "name",
            "illustrationList",
            "images",
            "created",
            "modified",
            "project",
        )


class ScreenAssigneeSerializer(serializers.ModelSerializer):
    pass


class ProjectActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectActivity
        fields = ("type", "created")


class ElementCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElementComment
        fields = ("text", "element", "user")
