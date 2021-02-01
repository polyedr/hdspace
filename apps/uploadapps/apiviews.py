import requests
from urllib.parse import urlparse

from django.core.files.base import File, ContentFile
from rest_framework.parsers import FileUploadParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, permissions

from apps.uploadapps.serializers import FileSerializer
from project.settings import MEDIA_URL, MEDIA_ROOT


class FileUploadView(APIView):
    parser_classes = (MultiPartParser,)
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        img_url = request.data["fileurl"]
        name = urlparse(img_url).path.split("/")[-1]
        o = urlparse(request.build_absolute_uri())
        file_name = "https://" + o.netloc + MEDIA_URL + "uploads/" + name
        serializer = FileSerializer(data={"fileurl": img_url})
        # print("serializer", serializer)
        if serializer.is_valid():
            serializer.save(owner=self.request.user)
            # print("serializer.fileurl", serializer.fileurl)
            # print("serializer.data", serializer.data)
            return Response({"filename": file_name}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
