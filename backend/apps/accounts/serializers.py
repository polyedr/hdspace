from rest_framework import serializers
from .models import User, Profile, Team, TeamMember





class UserSerializer(serializers.ModelSerializer):
    # profiles = serializers.PrimaryKeyRelatedField(many=True, queryset=Profile.objects.all())
    # teams = serializers.PrimaryKeyRelatedField(many=True, queryset=Team.objects.all())
    # profile_approved = serializers.IntegerField(source='profile.approved')

    class Meta:
        model = User
        # fields = ('_id')
        fields = ("_id", "username", "email", "first_name", "last_name", "date_joined", "is_active")


class ProfileSerializer(serializers.ModelSerializer):
    users = UserSerializer(read_only=True)
    class Meta:
        model = Profile
        fields = ("users","avatar", "approved", "role", "hourly_rate")

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