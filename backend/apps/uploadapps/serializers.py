import os
import requests
from urllib.parse import urlparse
from io import BytesIO
from django.core.files.uploadedfile import UploadedFile
from rest_framework import serializers
from apps.uploadapps.models import Fileupload, WebpageSaved, WpgSaved
import subprocess
import shutil
import scrapy
from scrapy_splash import SplashRequest

from project.settings import MEDIA_ROOT, MEDIA_URL


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


class WpgSavedSerializer(serializers.ModelSerializer, scrapy.Spider):
    name = "crawl"
    custom_settings = {
        "ROBOTSTXT_OBEY": True,
        "SPLASH_URL": "http://localhost:8050",
        "DOWNLOADER_MIDDLEWARES": {
            "scrapy_splash.SplashCookiesMiddleware": 723,
            "scrapy_splash.SplashMiddleware": 725,
            "scrapy.downloadermiddlewares.httpcompression.HttpCompressionMiddleware": 810,
        },
        "SPIDER_MIDDLEWARES": {
            "scrapy_splash.SplashDeduplicateArgsMiddleware": 100,
        },
        "DUPEFILTER_CLASS": "scrapy_splash.SplashAwareDupeFilter",
        "HTTPCACHE_STORAGE": "scrapy_splash.SplashAwareFSCacheStorage",
    }
    start_urls = []
    wpname = serializers.URLField()
    parse_with_splash = serializers.BooleanField(required=False)

    class Meta:
        model = WpgSaved
        fields = ("wpname", "owner", "parse_with_splash")
        extra_kwargs = {"parse_with_splash": {"read_only": True}}

    def create(self, validated_data):
        # url = validated_data.pop("wpname", None)
        url = validated_data["wpname"]
        self.parse_with_splash = validated_data.pop("parse_with_splash")
        self.start_urls.append(url)
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
        wpsaved = WpgSaved(id=None, **validated_data)

        wpath = MEDIA_ROOT + "/uploads/"

        os.chdir(wpath)
        subprocess.run(["wget", "-p", "-k", url])

        fname = urlparse(url).netloc
        SAVE_DIR = os.path.join(wpath, fname)
        # Archive all the files for a zip directory
        shutil.make_archive(SAVE_DIR, "zip", SAVE_DIR)
        zip_archive_name = fname + ".zip"

        # Obtaining the absolute path for the parameters directly. Should change this later.
        o = urlparse(self.context["request"].build_absolute_uri())
        t = (
            "https://" + o.netloc + MEDIA_URL + "uploads/" + zip_archive_name
        )

        wpsaved.wpname = t
        wpsaved.save()
        print(1)

        return wpsaved

    def start_requests(self):
        for url in self.start_urls:
            yield SplashRequest(url, self.parse, args={"wait": 11})

    def parse(self, response, validated_data):
        if self.parse_with_splash:
            subprocess.run(["wget", "-p", "-k", response.url])
            print(2)
