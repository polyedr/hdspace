"""Serializers for the accounts"""
from rest_framework import serializers
from .models import User, Profile, Team, TeamMember


class UserSerializer(serializers.ModelSerializer):
    # Password validation to be able to authorize
    def create(self, validated_data):
        user = super().create(validated_data)
        user.set_password(validated_data["password"])
        user.save()
        return user

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
        )
        extra_kwargs = {"id": {"read_only": True}}


class ProfileSerializer(serializers.ModelSerializer):
    users = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ("users", "avatar", "approved", "role", "hourly_rate")


"""
class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = (
            # "charge",
            # "time_log",
            # "position",
            # "date_joined",
            "is_active",
            "role",
        )


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ("owner", "members")
"""
