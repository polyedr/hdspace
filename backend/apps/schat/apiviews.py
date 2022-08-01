from rest_framework.response import Response
from rest_framework import permissions

# Create your views here.
from rest_framework.views import APIView

import stream_chat


class SchatView(APIView):
    """
    Obtain the Stream chat token
    """
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        server_client = stream_chat.StreamChat(api_key="STREAM_KEY", api_secret="STREAM_SECRET")
        token = server_client.create_token('self.request.user')
        return Response(token)