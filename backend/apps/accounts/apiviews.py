"""Views for the accounts api"""
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.pagination import CursorPagination
from .models import User, Profile, Team, TeamMember
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from .serializers import UserSerializer, ProfileSerializer, TeamMemberSerializer, TeamSerializer
from rest_framework import filters
from rest_framework.views import APIView
from sesame.utils import get_query_string

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
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'email']


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a user
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer


class ProfileList(generics.ListCreateAPIView):
    """
    Show authenticated user profile, or create a new profile.
    """

    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)


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


# Share the link for the user
class SharedlinkView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        user = request.user
        print(user)
        qstring = get_query_string(user)

        if qstring:
            return Response(qstring, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


# Share the link for the projectviewer
class SharedlinkprojectView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        user = User.objects.get(username='projectviewer')
        qstring = get_query_string(user)

        if qstring:
            return Response(qstring, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

