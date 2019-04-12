from rest_framework import serializers
from .models import User, Profile, Team, TeamMember

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # fields = ('_id')
        fields = '__all__'

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('avatar', 'approved', 'role', 'hourly_rate', 'user')

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ('charge', 'time_log', 'position', 'date_joined', 'is_active', 'role', 'user')


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ('description', 'logo', 'team_name', 'available', 'owner', 'members')
