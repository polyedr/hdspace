from urllib.parse import urlparse

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, permissions, generics

from apps.uploadapps.serializers import (
    FileSerializer,
    WpgSavedSerializer,
    RobotsSerializer, ObjectsMoveSerializer,
)
from project.settings import MEDIA_URL
from apps.uploadapps.models import WpgSaved


class FileUploadView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        img_url = request.data["fileurl"]
        name = urlparse(img_url).path.split("/")[-1]
        o = urlparse(request.build_absolute_uri())
        file_name = "https://" + o.netloc + MEDIA_URL + "uploads/" + name
        serializer = FileSerializer(data={"fileurl": img_url})
        if serializer.is_valid():
            serializer.save(owner=self.request.user)
            return Response(
                {"filename": file_name},
                status=status.HTTP_201_CREATED,
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                },
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RobotsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        robots_url = request.data["fileurl"]
        name = urlparse(robots_url).path.split("/")[-1]
        o = urlparse(request.build_absolute_uri())
        file_name = "https://" + o.netloc + MEDIA_URL + "uploads/" + name
        serializer = RobotsSerializer(data={"fileurl": robots_url})

        if serializer.is_valid():
            serializer.save(owner=self.request.user)
            return Response(
                {
                    "filename": file_name,
                    "wget_fetch": serializer.wget_fetch,
                    "asterisk_fetch": serializer.asterisk_fetch,
                    "robots_exist": serializer.robots_exist,
                },
                status=status.HTTP_201_CREATED,
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                },
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class WpgSavedView(generics.ListCreateAPIView):
    queryset = WpgSaved.objects.all()
    serializer_class = WpgSavedSerializer


class ObjectsMoveView(generics.CreateAPIView):
    queryset = WpgSaved.objects.all()
    serializer_class = ObjectsMoveSerializer