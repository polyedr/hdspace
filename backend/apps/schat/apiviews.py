import json

from rest_framework.authentication import BasicAuthentication
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from apps.schat.serializers import (
    TokenObtainSerializer,
    SchatSyncingSerializer,
    SchatCreateChannelSerializer,
)
from project.settings import schat_client


class SchatView(APIView):
    """
    Obtain the Stream chat token
    """

    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        # print(settings.local.STREAM_API_KEY, settings.local.STREAM_API_SECRET)
        # add a user
        token = schat_client.create_token(str(self.request.user.id))

        return Response(token)


class CustomObtainPairView(TokenObtainPairView):
    serializer_class = TokenObtainSerializer


class SchatSyncingUserView(CreateAPIView):
    """
    Stream chat syncing one user
    """

    serializer_class = SchatSyncingSerializer
    # permission_classes = (permissions.AllowAny,)
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        syncing = False
        try:
            syncing = schat_client.update_user(
                {"id": request.data["id"], "role": request.data["role"]}
            )
        except Exception:
            pass

        return Response(syncing)


class SchatSyncingUsersView(CreateAPIView):
    """
    Stream chat syncing many users
    """

    serializer_class = SchatSyncingSerializer
    # permission_classes = (permissions.AllowAny,)
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(
            data=request.data, context={"request": request}, many=True
        )
        serializer.is_valid(raise_exception=True)

        syncing = False
        try:
            syncing = schat_client.update_users(request.data)
        except Exception:
            pass

        return Response(syncing)


class SchatCreateChannelView(CreateAPIView):
    """
    Stream chat create channel
    """

    serializer_class = SchatCreateChannelSerializer
    # permission_classes = (permissions.AllowAny,)
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        cdict = False
        try:
            channel = schat_client.channel(
                request.data["channel_type"], request.data["channel_id"]
            )
            channel.create(request.data["user_id"])
            # print(channel.)
            cdict = channel.__dict__
            cdict.pop("client", None)  # Remove client to JSON serializing
            # channel_json = json.dumps(channel.__dict__)
        except Exception:
            pass

        return Response(cdict)


class SchatSyncingChannelView(CreateAPIView):
    """
    Stream chat syncing channel
    """

    # serializer_class = SchatCreateChannelSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        cdict = False
        try:
            channel = schat_client.channel.update(request.data)
            cdict = channel.__dict__
            cdict.pop("client", None)  # Remove client to JSON serializing
        except Exception:
            pass

        return Response(cdict)


class SchatUpdatePartialUserView(CreateAPIView):
    """
    Stream chat update partial user
    """
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        result = False
        try:
            result = schat_client.update_user_partial(request.data)
        except Exception:
            pass

        return Response(result)


class SchatUpdatePartialUsersView(CreateAPIView):
    """
    Stream chat update partial users
    """
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        result = False
        try:
            result = schat_client.update_users_partial(request.data)
        except Exception:
            pass

        return Response(result)
