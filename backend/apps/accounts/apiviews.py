"""Views for the accounts api"""

from rest_framework import generics
from rest_framework.pagination import CursorPagination

from .models import User, Profile, Team, TeamMember
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from .serializers import UserSerializer, ProfileSerializer, TeamMemberSerializer, TeamSerializer


class UserCursorSetPagination(CursorPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    ordering = '-date_joined'  # '-created' is default


class UserList(generics.ListCreateAPIView):
    """
    List all users, or create a new user.
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    pagination_class = UserCursorSetPagination


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a user
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer


class ProfileList(generics.ListCreateAPIView):
    """
    List all profiles, or create a new profile.
    """

    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ProfileDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a profile
    """

    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

@method_decorator(login_required, name='dispatch')
class TeamMemberList(generics.ListCreateAPIView):
    """
    List all team members, or create a new team member.
    """
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer

@method_decorator(login_required, name='dispatch')
class TeamMemberDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a team member
    """
    queryset = User.objects.all()
    serializer_class = TeamMemberSerializer

@method_decorator(login_required, name='dispatch')
class TeamList(generics.ListCreateAPIView):
    """
    List all teams, or create a new team.
    """
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

@method_decorator(login_required, name='dispatch')
class TeamDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a team
    """
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
