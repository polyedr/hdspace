"""Serializers for the projects"""
import datetime
import os
from io import BytesIO
import json
import typing

import cv2
from django.core.files.uploadedfile import UploadedFile
import requests
from urllib.parse import urlparse

from drf_stripe.stripe_api.customers import get_or_create_stripe_user
from drf_writable_nested import WritableNestedModelSerializer
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework_bulk import BulkSerializerMixin, BulkListSerializer
from rest_framework_recursive.fields import RecursiveField

from taggit_serializer.serializers import (TagListSerializerField,
                                           TaggitSerializer)
# from drf_writable_nested.serializers import WritableNestedModelSerializer
from apps.accounts.models import User
from apps.accounts.serializers import UserSerializer, UserSimpleSerializer
from apps.utils.fset1 import get_dominant_palette
from project.settings import MEDIA_ROOT, schat_client, MEDIA_URL
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
    ElementComment, ProjectImage, ProjectIllustrationSet, ProjectColumn, ColumnTask, ColumnTaskComment,
    ColumnTaskCheckitem, ColumnTaskLabel)

from collections import OrderedDict


def copy_element_node(instance: ScenarioElement, plan: int = None, parent: ScenarioElement = None) -> ScenarioElement:
    """
    Copy the attribute of the `element` and return new instance without `parent`
    :param instance:
    :return:
    """
    iclone = instance.make_clone()
    iclone.parent = parent
    iclone.save()
    print(iclone)
    return iclone


counter = 0


def copy_children(target_branch: ScenarioElement, parent: ScenarioElement = None, new_node: bool = False, counter=1) -> None:
    """
    :param target_branch: The original
    :return:
    """
    if new_node:
        new_node = copy_element_node(target_branch, parent=parent)
        # new_node.save()
    else:
        new_node = parent

    # Define the first node
    if counter == 1:
        new_first_node = new_node

    # print("tb", target_branch)
    if not target_branch.is_leaf_node():
        for child in target_branch.children.all():
            # Make children of `plan` node
            new_child = copy_element_node(child, parent=new_node)
            # new_child.save()
            node, innerc1 = copy_children(child, parent=new_child, new_node=False)
            counter += innerc1
            # print("internal_counter", counter)

    return (new_first_node, counter)


def duplicate_model_with_descendants(obj, whitelist, _new_parent_pk=None):
    kwargs = {}
    children_to_clone = OrderedDict()
    for field in obj._meta.get_fields():
        if field.name == "id":
            pass
        elif field.one_to_many:
            if field.name in whitelist:
                these_children = list(getattr(obj, field.name).all())
                if field.name in children_to_clone:
                    children_to_clone[field.name] |= these_children
                else:
                    children_to_clone[field.name] = these_children
            else:
                pass
        elif field.many_to_one:
            if _new_parent_pk:
                kwargs[field.name + '_id'] = _new_parent_pk
        elif field.concrete:
            kwargs[field.name] = getattr(obj, field.name)
        else:
            pass
    iclone = obj.make_clone()
    new_instance = iclone
    for ky in children_to_clone.keys():
        child_collection = getattr(new_instance, ky)
        for child in children_to_clone[ky]:
            child_collection.add(duplicate_model_with_descendants(child, whitelist=whitelist))
    return new_instance


class ProjectScreenSerializer(serializers.ModelSerializer):
    screen_data_json = serializers.JSONField()
    tags = TagListSerializerField(required=False, allow_null=True)

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
            "created",
            "updated",
            "tags",
        )
        extra_kwargs = {"screenscenario": {"read_only": True}}


class ProjectScreenMultipleSerializer(BulkSerializerMixin, serializers.ModelSerializer):
    screen_data_json = serializers.JSONField()
    tags = TagListSerializerField(required=False, allow_null=True)

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
            "created",
            "updated",
            "tags",
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
        # print(validated_data)
        # print(self.mptt_level)
        print(self.context)
        # print(self.is_root_node())
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
        print(instance, instance.parent)
        for child_data in children:
            # child_data['scenario'] = child_data['scenario'].pk
            print(child_data)
            s = ScenarioElementSerializer(data=child_data, context={"parent": node})
            s.is_valid(raise_exception=True)
            s.save()
        return node


class ScenarioElementImportSerializer(serializers.ModelSerializer):
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
        ref_name = "ScenarioImportElements"


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


class ScreenScenarioExportSerializer(serializers.ModelSerializer):
    elements = ScenarioElementSerializer(many=True, read_only=True)
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
        )
        # extra_kwargs = {"elements": {"read_only": True}}
        # fields = "__all__"


class ScreenScenarioImportSerializer(serializers.ModelSerializer):
    elements = ScenarioElementImportSerializer(many=True, required=False, allow_null=True)
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
        )
        # extra_kwargs = {"elements": {"read_only": True}}
        extra_kwargs = {"id": {"read_only": True}}
        # fields = "__all__"


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
# from django.contrib.auth.models import Group
# from rest_framework import permissions


class ProjectSerializer(TaggitSerializer, ObjectPermissionsAssignmentMixin, serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    projectscreen = serializers.PrimaryKeyRelatedField(
        many=True, queryset=ProjectScreen.objects.all()
    )
    tags = TagListSerializerField(required=False, allow_null=True)

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
            "project_data_activity_json",
            "project_data_trello_json",
            "tags",
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
        # Check if user can create projects, based on projects_max value and subscriptions status
        current_user = self.context["request"].user
        username = current_user.username
        current_profile = self.context["request"].user.profile
        avatar = ""
        try:
            o = urlparse(self.context["request"].build_absolute_uri())
            avatar = "https://" + o.netloc + MEDIA_URL + str(current_profile.avatar)
            # print("avatar", avatar)
        except Exception:
            pass

        projects_max = current_profile.projects_max
        is_superuser = current_user.is_superuser

        # A flag to set number of projects available manually instead of the subscripitons value
        approved = current_profile.approved
        can_create_projects = 1
        # print("is_superuser: ", is_superuser, "approved: ", approved)
        now_projects = Project.objects.filter(user=current_user).count()
        if not is_superuser:
            can_create_projects = 0
        if approved:
            print(now_projects, projects_max)
            if now_projects < projects_max:
                can_create_projects = 1
        else:
            # Calculate a number of projects available with subscriptions tables
            # Set number of projects available according to the subscriptions value
            try:
                stripe_user = get_or_create_stripe_user(user_id=current_user.id)
                projects_max = (len(stripe_user.current_subscription_items)) * 3
            except Exception:
                pass

            if now_projects < projects_max:
                can_create_projects = 1

            # Process the Lifetime and the Course subscriptions
            # This should be changed later to make a subscription checking once after its appearance

        # A flag to check the free trial
        user_date_joined = current_user.date_joined
        # Add timezone information to the datetime object
        dt_obj_w_tz = datetime.datetime.now()
        user_time_now = dt_obj_w_tz.replace(tzinfo=datetime.timezone.utc)
        # A free trial period is defined here
        user_free_trial = (user_time_now - user_date_joined) < datetime.timedelta(days=14)

        if user_free_trial:
            projects_max = 3  # A number of the available project for the free trial
            if now_projects < projects_max:
                can_create_projects = 1

        if can_create_projects:
            projectscreens_data = validated_data.pop("projectscreen")
            project = Project(id=None, **validated_data)
            project.preview = project.generate_preview_token()
            project.save()
            project.name = "AProject-" + str(project.id)
            project.save()
            project.projectscreen.set(projectscreens_data, clear=True)

            try:
                # A Stream chat connection
                schat_users = schat_client.query_users({"id": {"$in": [str(current_user.id)]}})

                # extract teams array if exists
                teams = []
                try:
                    teams = schat_users["users"][0]["teams"]
                    # print("teams", teams)
                except Exception:
                    pass
                finally:
                    pass

                # update teams array
                if str(project.id) in teams:
                    pass
                else:
                    teams.append(str(project.id))

                if (schat_users["users"]):
                    schat_client.update_user_partial(
                        {"id": str(current_user.id), "set": {"role": "admin", "name": username, "image": avatar, "teams": teams}}
                    )
                else:
                    schat_client.update_user({"id": str(current_user.id), "set": {"role": "admin", "name": username, "image": avatar, "teams": teams}})
            except Exception:
                pass
            return project
        else:
            raise ValidationError("Maximum count of projects reached.")

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


# Copying the project
class ProjectcopySerializer:
    pass


class ProjectPermissionsSerializer(ObjectPermissionsAssignmentMixin, serializers.ModelSerializer):
    pass


class ProjectWithScreensSerializer(TaggitSerializer, serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    projectscreen = ProjectScreenSerializer(many=True, read_only=True)
    tags = TagListSerializerField(required=False, allow_null=True)

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
            "tags",
            "project_data_text",
            "project_data_json",
            "project_data_activity_json",
            "project_data_trello_json",
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


class ColumnTaskCommentSerializer(serializers.ModelSerializer):
    user = UserSimpleSerializer(read_only=True)
    # user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='user', read_only=True)
    class Meta:
        model = ColumnTaskComment
        fields = ("id", "text", "created", "modified", "user", "columntask")
        extra_kwargs = {
            "id": {"read_only": True},
            "created": {"read_only": True},
            "modified": {"read_only": True},
            "user": {"read_only": True},
            # "user_id": {"read_only": True},
        }


class ColumnTaskCheckitemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ColumnTaskCheckitem
        fields = ("id", "text", "created", "modified", "status", "buyoancy", "columntask")
        extra_kwargs = {
            "id": {"read_only": True},
            "created": {"read_only": True},
            "modified": {"read_only": True},
        }


class ColumnTaskLabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ColumnTaskLabel
        fields = ("id", "text", "colour", "columntask", "project")
        extra_kwargs = {
            "id": {"read_only": True},
            "columntask": {"required": False},
        }


class ProjectInvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectInvitation
        fields = ("invitation_token", "is_active", "email", "role")


class ProjectMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='user', read_only=False)

    class Meta:
        model = ProjectMember
        fields = ("id", "role", "status", "project", "user", "user_id")

    extra_kwargs = {
        "author": {"read_only": True},
        "user": {"read_only": True},
    }


class SubColumnTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = ColumnTask
        fields = ("id", "created", "due_date", "status", "title")


class ColumnTaskSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):
    # tags = TagListSerializerField(required=False, allow_null=True)
    labels = ColumnTaskLabelSerializer(many=True, required=False, read_only=True)
    comments = ColumnTaskCommentSerializer(many=True, required=False)
    checklist = ColumnTaskCheckitemSerializer(many=True, read_only=True)
    # related_task = ColumnTaskSerializer(many=True, required=False)
    related_tasks = SubColumnTaskSerializer(many=True, required=False)
    project_id = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all(), source='column.project', required=False)
    label_ids = serializers.PrimaryKeyRelatedField(many=True, source='labels', required=False, queryset=ColumnTaskLabel.objects.all())
    author = UserSimpleSerializer(required=False, allow_null=True, read_only=True)
    assignee = UserSimpleSerializer(required=False, allow_null=True, read_only=True)
    responsible = UserSimpleSerializer(required=False, allow_null=True, read_only=True)
    subscribers = UserSimpleSerializer(required=False, allow_null=True, read_only=True, many=True)

    author_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='author', required=False)
    assignee_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), allow_null=True, source='assignee', required=False)
    responsible_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), allow_null=True, source='responsible', required=False)
    subscribers_ids = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='subscribers', required=False, many=True)

    colour = serializers.CharField(required=False, allow_null=True)

    class Meta:
        model = ColumnTask
        fields = ("id", "created", "modified", "due_date", "time", "colour", "title", "description", "status", "priority", "buyoancy", "label_ids", "labels", "colour", "story_points", "column", "author", "assignee", "responsible", "author_id", "assignee_id", "responsible_id", "subscribers", "subscribers_ids", "comments", "checklist", "related_tasks", "project_id")
        # , "related_task"
        # depth = 2
        extra_kwargs = {
            "author": {"read_only": True},
            "project_id": {"read_only": True},
            "comments": {"read_only": True},
            "labels": {"read_only": True},
        }

    '''
    def update(self, instance, validated_data):
        """
        Update and return an existing `ColumnTask` instance, given the validated data.
        """
        instance = super(ColumnTaskSerializer, self).update(instance, validated_data)
        labels_data = validated_data.get("labels")
        instance.labels.set(labels_data, clear=True)
        instance.save()
        return instance
    '''

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
            "buyoancy",
            "colour",
        )


class ProjectColumnSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectColumn
        fields = ("id", "title", "description", "project", "buyoancy", "colour")


class ProjectWithColumnsSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):
    tasklabels = ColumnTaskLabelSerializer(many=True)
    projectcolumn = ProjectColumnSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = (
            "projectcolumn",
            "tasklabels",
            "id",
        )

    @staticmethod
    def setup_eager_loading(qs):
        queryset = qs.select_related("user").prefetch_related("projectcolumn")
        return queryset


class ProjectWithMembersSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    projectmember = ProjectMemberSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = (
            "preview",
            "name",
            "favicon",
            "status",
            "projectmember",
            "user",
            "id",
            "created",
            "updated",
            "project_data_text",
            "project_data_json",
            "project_data_activity_json",
            "project_data_trello_json",
        )
        extra_kwargs = {
            "preview": {"read_only": True},
            "created": {"read_only": True},
            "updated": {"read_only": True},
        }

    @staticmethod
    def setup_eager_loading(qs):
        queryset = qs.select_related("user").prefetch_related("projectmember")
        return queryset


class TaskTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskTime
        fields = ("track_time", "started", "stoped")


class ImageSerializer(serializers.ModelSerializer):
    fileurl = serializers.URLField(allow_blank=True, allow_null=True, required=False)

    class Meta:
        model = ProjectImage
        fields = ("id", "image", "image_url", "created", "modified", "illustration_set", "fileurl",)
        extra_kwargs = {
            "image_url": {"read_only": True},
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
        fileupload.image_url = str(fileupload.image)
        fileupload.save()
        return fileupload


class ImagePaletteSerializer(serializers.ModelSerializer):
    fileurl = serializers.URLField(allow_blank=True, allow_null=True, required=False)

    class Meta:
        model = ProjectImage
        fields = ("id", "image", "image_url", "created", "modified", "illustration_set", "fileurl", "palette",)
        extra_kwargs = {
            "image_url": {"read_only": True},
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
        fileupload.image_url = str(fileupload.image)

        image_uploaded_url = os.path.join(MEDIA_ROOT, fileupload.image_url)

        image_cv = cv2.imread(image_uploaded_url)
        # print(fileupload.image_url, image_uploaded_url, image_cv)
        colours = get_dominant_palette(image_cv)
        # print(colours)
        fileupload.palette = json.dumps(colours)

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


class ProjectExportScreenSerializer(serializers.ModelSerializer):
    screen_data_json = serializers.JSONField()
    tags = TagListSerializerField(required=False, allow_null=True)
    screenscenario = ScreenScenarioExportSerializer(many=True)

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
            "created",
            "updated",
            "tags",
        )
        extra_kwargs = {"screenscenario": {"read_only": True}}


class ProjectImportScreenSerializer(serializers.ModelSerializer):
    screen_data_json = serializers.JSONField()
    tags = TagListSerializerField(required=False, allow_null=True)
    screenscenario = ScreenScenarioImportSerializer(many=True, allow_null=True)
    # screenscenario = ScreenScenarioSerializer(many=True, allow_null=True)

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
            "created",
            "updated",
            "tags",
        )
        # extra_kwargs = {"screenscenario": {"read_only": True}}
    def create(self, validated_data):
        print("validated_data", validated_data)
        screenscenarios = validated_data.pop("screenscenario", None)
        node = ProjectScreen.objects.create(**validated_data)

        # Multiple scenarios
        for screenscenario in screenscenarios:
            # s = ScreenScenarioSerializer(data=screenscenario, context={"projectscreen": node.id})
            print(screenscenario)
            screenscenario["screen"] = node
            # ancscreen = screenscenario.pop("screen", None)
            print("screenscenario", screenscenario)
            scenarioelements = screenscenario.pop("elements", None)
            print("scenarioelements: ", scenarioelements)
            '''
            s = ScreenScenarioImportSerializer(data=screenscenario)
            s.is_valid(raise_exception=True)
            s.save()
            '''
            s = ScreenScenario.objects.create(**screenscenario)
            s.save()
            # Multiple elements
            if scenarioelements:
                for scenarioelement in scenarioelements:
                    # print(scenarioelement)
                    scenarioelement["scenario"] = s
                    children = scenarioelement.pop("children", [])
                    node_se = ScenarioElement.objects.create(
                        # parent is null only on the root node
                        parent=self.context.get("parent"),
                        **scenarioelement
                    )
                    node_se.save()
                    # Multiple level of the recursion
                    for child_data in children:
                        print("child_data", child_data)
                        # w = ScenarioElement.objects.create(**child_data)
                        w = ScenarioElementImportSerializer(data=child_data, context={"parent": node_se})
                        w.is_valid(raise_exception=True)
                        # ScenarioElement.objects.create(child_data)
                        w.save()
        node.save()
        return node