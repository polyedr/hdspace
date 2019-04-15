from rest_framework import serializers
from .models import User, Profile, Team, TeamMember


class UserSerializer(serializers.ModelSerializer):
    # profiles = serializers.PrimaryKeyRelatedField(many=True, queryset=Profile.objects.all())
    class Meta:
        model = User
        # fields = ('_id')
        fields = ("username", "email", "first_name", "last_name", "date_joined", "is_active")


class ProfileSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.user')
    class Meta:
        model = Profile
        fields = ("avatar", "approved", "role", "hourly_rate", "owner")

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