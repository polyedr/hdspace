import requests
from urllib.parse import urlparse
from io import BytesIO
from django.core.files.uploadedfile import UploadedFile
from rest_framework import serializers
from apps.uploadapps.models import Fileupload


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
