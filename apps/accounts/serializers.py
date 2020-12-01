"""Serializers for the accounts"""
from rest_framework import serializers
from .models import User, Profile, Team, TeamMember


class ProfileSerializer(serializers.ModelSerializer):
    # users = UserSerializer(read_only=True)
    class Meta:
        model = Profile
        fields = ("avatar", "approved", "role", "hourly_rate")


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


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = '__all__'
