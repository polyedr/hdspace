"""Views for the accounts api"""
import uuid
from urllib.parse import urlparse

import shortuuid
from django.contrib.auth.models import Group
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.pagination import CursorPagination

from apps.projects.models import Project
from .models import User, Profile, Team, TeamMember
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from .serializers import UserSerializer, ProfileSerializer, TeamMemberSerializer, TeamSerializer
from rest_framework import filters
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from sesame.utils import get_query_string
from guardian.shortcuts import assign_perm, remove_perm, get_perms, get_users_with_perms


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


# Share the link for the new user
class SharedlinknewuserView(APIView):
    VIEW_PROJECT_PERMISSION = "view_project"
    CHANGE_PROJECT_PERMISSION = "change_project"
    PROJECT_PERMISSION = (
        (VIEW_PROJECT_PERMISSION, "view_project"),
        (CHANGE_PROJECT_PERMISSION, "change_project"),
    )
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        projecturl = request.data['projecturl']

        # Extract a project id
        o = urlparse(projecturl)
        patharray = o.path.split('/')

        if(patharray[1] == 'project'):
            projectid = patharray[2]
        else:
            # A non-project string
            errmsg = "This string is not a correct project string"
            projectid = -1

        project = Project.objects.get(pk=projectid)

        username = '000' + str(shortuuid.uuid())
        email = username + '@example.com'
        password = username
        user = User.objects.create_user(username, email=email, password=password)
        groupcommonusers = Group.objects.get(name="CommonUsers")
        user.groups.add(groupcommonusers)
        user.is_active = True
        # print(user)
        qstring = get_query_string(user)

        # Modulating the permissions
        pmap = request.data['pmap']
        if(pmap == "view"):
            permissions = ["view_project"]
        elif(pmap == "edit"):
            permissions = ["view_project", "change_project"]
        else:  # All other cases making the empty value
            permissions = []

        for permission in self.PROJECT_PERMISSION:  # Check the meaning of this statement
            remove_perm(permission[1], user, project)

        for permission in permissions:
            assign_perm(permission, user, project)

        rp = get_perms(user, project)  # A resulted permissions array
        user_tokens = RefreshToken.for_user(user)
        tokens = {'refresh': str(user_tokens), 'access': str(user_tokens.access_token)}
        data = {'qstring': qstring, 'permissions': permissions}
        data.update(tokens)

        if qstring:
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


# Share the link for the user
class SharedlinkView(APIView):
    VIEW_PROJECT_PERMISSION = "view_project"
    CHANGE_PROJECT_PERMISSION = "change_project"
    PROJECT_PERMISSION = (
        (VIEW_PROJECT_PERMISSION, "view_project"),
        (CHANGE_PROJECT_PERMISSION, "change_project"),
    )
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        projecturl = request.data['projecturl']

        # Extract a project id
        o = urlparse(projecturl)
        patharray = o.path.split('/')

        if(patharray[1] == 'project'):
            projectid = patharray[2]
        else:
            # A non-project string
            errmsg = "This string is not a correct project string"
            projectid = -1

        project = Project.objects.get(pk=projectid)

        user = request.user
        # print(user)
        qstring = get_query_string(user)

        # Modulating the permissions
        pmap = request.data['pmap']
        if(pmap == "view"):
            permissions = ["view_project"]
        elif(pmap == "edit"):
            permissions = ["view_project", "change_project"]
        else:  # All other cases making the empty value
            permissions = []

        for permission in self.PROJECT_PERMISSION:  # Check the meaning of this statement
            remove_perm(permission[1], user, project)

        for permission in permissions:
            assign_perm(permission, user, project)

        rp = get_perms(user, project)  # A resulted permissions array
        user_tokens = RefreshToken.for_user(user)
        tokens = {'refresh': str(user_tokens), 'access': str(user_tokens.access_token)}
        data = {'qstring': qstring, 'permissions': permissions}
        data.update(tokens)

        if qstring:
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


# Share the link for the projectviewer
class SharedlinkprojectView(APIView):
    VIEW_PROJECT_PERMISSION = "view_project"
    CHANGE_PROJECT_PERMISSION = "change_project"
    PROJECT_PERMISSION = (
        (VIEW_PROJECT_PERMISSION, "view_project"),
        (CHANGE_PROJECT_PERMISSION, "change_project"),
    )

    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        projecturl = request.data['projecturl']

        # Extract a project id
        o = urlparse(projecturl)
        patharray = o.path.split('/')

        if(patharray[1] == 'project'):
            projectid = patharray[2]
        else:
            # A non-project string
            errmsg = "This string is not a correct project string"
            projectid = -1

        project = Project.objects.get(pk=projectid)

        user = User.objects.get(username='projectviewer')
        qstring = get_query_string(user)

        # Modulating the permissions
        pmap = request.data['pmap']
        if(pmap == "view"):
            permissions = ["view_project"]
        elif(pmap == "edit"):
            permissions = ["view_project", "change_project"]
        else:  # All other cases making the empty value
            permissions = []

        for permission in self.PROJECT_PERMISSION:  # Check the meaning of this statement
            remove_perm(permission[1], user, project)

        for permission in permissions:
            assign_perm(permission, user, project)

        rp = get_perms(user, project)  # A resulted permissions array

        user_tokens = RefreshToken.for_user(user)
        tokens = {'refresh': str(user_tokens), 'access': str(user_tokens.access_token)}
        data = {'qstring': qstring, 'permissions': permissions}
        data.update(tokens)

        if qstring:
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        '''
        # Display tokens for a projectviewer
        # It is not necessary, because django-sesame links are authenticated links
        user_tokens = RefreshToken.for_user(user)
        tokens = {'refresh': str(user_tokens), 'access': str(user_tokens.access_token)}
        print(rp)
        data = {'user':'projectviewer', 'qstring': qstring}
        data.update(tokens)


        if qstring:
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        '''
