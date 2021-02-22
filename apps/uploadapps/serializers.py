import os
import requests
from urllib.parse import urlparse
from io import BytesIO
from django.core.files.uploadedfile import UploadedFile
from rest_framework import serializers
from apps.uploadapps.models import Fileupload, WebpageSaved, WpgSaved
import subprocess

from project.settings import MEDIA_URL, MEDIA_ROOT


class FileSerializer(serializers.ModelSerializer):
    fileurl = serializers.URLField()

    class Meta:
        model = Fileupload
        fields = ("filename", "owner", "fileurl")
        extra_kwargs = {
            "fileurl": {"read_only": True},
            "filename": {"write_only": True},
        }

    def create(self, validated_data):
        url = validated_data.pop("fileurl", None)
        # Remove url from the submitted data
        # validated_data['fileurl'] = ''
        # Download data from url (requires `requests` module.  Can also be done with urllib)
        response = requests.get(url)
        # Set FileField to binary file
        filename = urlparse(url).path.split("/")[-1]
        validated_data["filename"] = UploadedFile(
            BytesIO(response.content), name=filename
        )
        fileupload = Fileupload(id=None, **validated_data)
        fileupload.save()
        return fileupload


class WebpageSavedSerializer(serializers.ModelSerializer):
    wpurl = serializers.URLField()

    class Meta:
        model = WebpageSaved
        fields = ("wpname", "owner", "wpurl")
        extra_kwargs = {"wpurl": {"read_only": True}, "wpname": {"write_only": True}}

    def create(self, validated_data):
        url = validated_data.pop("wpurl", None)
        # Remove url from the submitted data
        # validated_data['fileurl'] = ''
        # Download data from url (requires `requests` module.  Can also be done with urllib)
        response = requests.get(url)
        # Set FileField to binary file
        wpname = urlparse(url).path.split("/")[-1]
        if not wpname:
            wpname = urlparse(url).netloc
        print("wpname=", wpname)
        validated_data["wpname"] = UploadedFile(BytesIO(response.content), name=wpname)
        wpsaved = WebpageSaved(id=None, **validated_data)
        wpsaved.save()

        wpath = MEDIA_ROOT + "/uploads/"

        os.chdir(wpath)
        subprocess.run(["wget", "-p", "-k", url])

        return wpsaved


class WpgSavedSerializer(serializers.ModelSerializer):
    wpname = serializers.URLField()

    class Meta:
        model = WpgSaved
        fields = ("wpname", "owner")
        # extra_kwargs = {"wpurl": {"read_only": True}, "wpname": {"write_only": True}}

    def create(self, validated_data):
        # url = validated_data.pop("wpname", None)
        url = validated_data["wpname"]
        # Remove url from the submitted data
        # validated_data['fileurl'] = ''
        # Download data from url (requires `requests` module.  Can also be done with urllib)
        # response = requests.get(url)
        # Set FileField to binary file
        '''
        wpname = urlparse(url).path.split("/")[-1]
        if not wpname:
            wpname = urlparse(url).netloc
        '''
        # print("wpname=", wpname)
        # validated_data["wpname"] = UploadedFile(BytesIO(response.content), name=wpname)
        wpsaved = WebpageSaved(id=None, **validated_data)
        wpsaved.save()

        wpath = MEDIA_ROOT + "/uploads/"

        os.chdir(wpath)
        subprocess.run(["wget", "-p", "-k", url])

        return wpsaved
