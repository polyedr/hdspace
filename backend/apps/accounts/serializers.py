"""Serializers for the accounts"""
from drf_writable_nested import UniqueFieldsMixin
from rest_framework import serializers
from .models import User, Profile, Team, TeamMember, SharedLink
from django.contrib.auth.models import Group
from djoser.serializers import ActivationSerializer


# https://stackoverflow.com/questions/59927159/how-to-add-user-to-a-group-when-he-is-verified-and-have-log-in-rights-django
class MyActivationSerializer(ActivationSerializer):
    def validate(self, attrs):
        attrs = super(MyActivationSerializer, self).validate(attrs)
        group = Group.objects.get(name='CommonUsers')  # This group should be existed with all the rights are necessary
        self.user.groups.add(group)
        return attrs


class ProfileSerializer(serializers.ModelSerializer):
    # users = UserSerializer(read_only=True)
    parameters = serializers.JSONField(allow_null=True)

    class Meta:
        model = Profile
        fields = ("avatar", "approved", "role", "experienced", "hourly_rate", "id", "parameters")


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    # Password validation to be able to authorize
    def create(self, validated_data):
        user = super().create(validated_data)
        user.set_password(validated_data["password"])
        user.save()
        return user

    def update(self, instance, validated_data):
        instance = super(UserSerializer, self).update(instance, validated_data)
        # Should change later for better construction than try except finally
        try:
            instance.set_password(validated_data["password"])
        except Exception:
            pass
        finally:
            pass
        instance.save()
        return instance

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "date_joined",
            "password",
            "is_active",
            "profile",
        )
        ref_name = "User Django"  # Added to avoid SwaggerGeneration Conflicts
        extra_kwargs = {"id": {"read_only": True}, "profile": {"read_only": True}}


class UserSimpleSerializer(serializers.ModelSerializer):
    profile_avatar = serializers.ImageField(read_only=True, source="profile.avatar")

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "date_joined",
            "is_active",
            "profile_avatar",
        )
        ref_name = "User Django"  # Added to avoid SwaggerGeneration Conflicts
        extra_kwargs = {"id": {"read_only": True}, "profile": {"read_only": True}}


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = '__all__'


class SharedLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SharedLink
        fields = '__all__'
