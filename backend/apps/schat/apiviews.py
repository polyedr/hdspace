import stream_chat
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from apps.schat.serializers import TokenObtainSerializer


class SchatView(APIView):
    """
    Obtain the Stream chat token
    """
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        server_client = stream_chat.StreamChat(api_key="STREAM_KEY", api_secret="STREAM_SECRET")
        token = server_client.create_token('self.request.user.id')
        return Response(token)

class CutomObtainPairView(TokenObtainPairView):
    serializer_class = TokenObtainSerializer
