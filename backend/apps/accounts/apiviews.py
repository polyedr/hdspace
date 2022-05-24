"""Views for the accounts api"""
from rest_framework import generics, permissions
from rest_framework.pagination import CursorPagination
from .models import User, Profile, Team, TeamMember
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from .serializers import UserSerializer, ProfileSerializer, TeamMemberSerializer, TeamSerializer
from rest_framework import filters
from rest_framework.views import APIView

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


# Share the link
class SharedlinkView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        '''
        WHITELIST = ['screenscenario', 'elements']
        screenid = request.data['screenid']
        screen = ProjectScreen.objects.get(pk=screenid)
        screen_clone = duplicate_model_with_descendants(screen, WHITELIST)

        if screen_clone:
            return Response(screen_clone.id, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        '''
        return True
