import requests
from urllib.parse import urlparse

from django.core.files.base import File, ContentFile
from rest_framework.parsers import FileUploadParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, permissions, generics

from apps.uploadapps.serializers import FileSerializer, WebpageSavedSerializer, WpgSavedSerializer, RobotsSerializer
from project.settings import MEDIA_URL, MEDIA_ROOT
from apps.uploadapps.models import WpgSaved


class FileUploadView(APIView):
    # parser_classes = (MultiPartParser,)
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
            return Response({"filename": file_name}, status=status.HTTP_201_CREATED,
                            headers={"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RobotsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        robots_url = request.data["fileurl"]
        name = urlparse(robots_url).path.split("/")[-1]
        o = urlparse(request.build_absolute_uri())
        file_name = "https://" + o.netloc + MEDIA_URL + "uploads/" + name
        serializer = RobotsSerializer(data={"fileurl": robots_url})
        # print("serializer", serializer, serializer.is_valid())
        if serializer.is_valid():
            serializer.save(owner=self.request.user)
            # print("serializer.wpurl", serializer.wpurl)
            # print("serializer.data", serializer.data)
            # return Response({"wpname": wp_name}, status=status.HTTP_201_CREATED)
            return Response({"filename": file_name, "wget_fetch": serializer.wget_fetch, "asterisk_fetch": serializer.asterisk_fetch}, status=status.HTTP_201_CREATED,
                            headers={"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class WpgSavedView(generics.ListCreateAPIView):
    queryset = WpgSaved.objects.all()
    serializer_class = WpgSavedSerializer


'''
# Version 1 with robots.txt processing 
class RobotsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        robots_url = request.data["fileurl"]
        serializer = RobotsSerializer(data={"fileurl": robots_url})
        # print("serializer", serializer, serializer.is_valid())
        if serializer.is_valid():
            print(serializer)
            return Response({"result_data_set": serializer.result_data_set}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
'''
