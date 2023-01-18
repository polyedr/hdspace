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
import urllib.robotparser

from project.settings import MEDIA_ROOT, MEDIA_URL
from apps.utils.fset1 import update_or_create_dir


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


# Version 2,based on FileSerializer
class RobotsSerializer(serializers.ModelSerializer):
    fileurl = serializers.URLField()

    class Meta:
        model = Fileupload
        fields = ("filename", "owner", "fileurl")
        extra_kwargs = {
            "fileurl": {"read_only": True},
            "filename": {"write_only": True},
            "asterisk_fetch": {"write_only": True},
            "wget_fetch": {"write_only": True},
            "robots_exist": {"write_only": True},
        }

    def does_url_exist(self, url):
        try:
            r = requests.head(url)
            if r.status_code < 400:
                return True
            else:
                return False
        except requests.exceptions.RequestException as e:
            return False

    def create(self, validated_data):
        url = validated_data.pop("fileurl", None)
        # print(url)
        if not (self.does_url_exist(url)):
            self.asterisk_fetch = True
            self.wget_fetch = True
            self.robots_exist = False
            return False

        rp = urllib.robotparser.RobotFileParser()
        rp.set_url(url)
        rp.read()

        # A constant to define user-agent name
        AGENT_NAME = 'Wget'

        self.asterisk_fetch = rp.can_fetch("*", "/")
        self.wget_fetch = rp.can_fetch(AGENT_NAME, "/")
        self.robots_exist = True
        # print("wget_fetch", self.wget_fetch)

        # Remove url from the submitted data
        # validated_data['fileurl'] = ''
        # Download data from url (requires `requests` module.  Can also be done with urllib)
        response = requests.get(url)
        # Set FileField to binary file
        filename = urlparse(url).path.split("/")[-1]
        upfile = validated_data["filename"] = UploadedFile(
            BytesIO(response.content), name=filename
        )

        # Printing result data set start
        result = upfile.read().decode()

        result_data_set = {"Disallowed": [], "Allowed": []}

        for line in result.split("\n"):
            if line.startswith('Allow'):  # this is for allowed url
                result_data_set["Allowed"].append(
                    line.split(': ')[1].split(' ')[0])  # to neglect the comments or other junk info
            elif line.startswith('Disallow'):  # this is for disallowed url
                try:
                    result_data_set["Disallowed"].append(line.split(': ')[1].split(' ')[0])
                except Exception:
                    pass
        print(result_data_set)
        # Printing result data set end

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
    no_robots = serializers.BooleanField(required=False)

    class Meta:
        model = WpgSaved
        fields = ("wpname", "owner", "parse_with_splash", "no_robots")
        extra_kwargs = {"parse_with_splash": {"read_only": True}, "no_robots": {"read_only": True}}

    def create(self, validated_data):
        # url = validated_data.pop("wpname", None)
        url = validated_data["wpname"]
        self.parse_with_splash = validated_data.pop("parse_with_splash")
        self.no_robots = validated_data.pop("no_robots")
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

        fname = urlparse(url).netloc
        SAVE_DIR = os.path.join(wpath, fname)
        update_or_create_dir(SAVE_DIR)
        os.chmod(SAVE_DIR, 0o755)
        # Clear content at the SAVE_DIR
        os.chdir(SAVE_DIR)
        subprocess.run(["rm", "-rf", "*"])

        os.chdir(wpath)
        if (self.no_robots):
            subprocess.run(["wget", "-e robots=off", "-p", "-k", url])
        else:
            subprocess.run(["wget", "-p", "-k", url])
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

        return wpsaved

    def start_requests(self):
        for url in self.start_urls:
            yield SplashRequest(url, self.parse, args={"wait": 11})

    def parse(self, response, validated_data):
        if self.parse_with_splash:
            subprocess.run(["wget", "-p", "-k", response.url])


class ImportExportUploadSerializer(serializers.ModelSerializer):
    name = "crawl"
    start_urls = []
    wpname = serializers.URLField()
    parse_with_splash = serializers.BooleanField(required=False)
    no_robots = serializers.BooleanField(required=False)

    class Meta:
        model = WpgSaved
        fields = ("wpname", "owner", "parse_with_splash", "no_robots")
        extra_kwargs = {"parse_with_splash": {"read_only": True}, "no_robots": {"read_only": True}}

    def create(self, validated_data):
        # url = validated_data.pop("wpname", None)
        url = validated_data["wpname"]
        self.parse_with_splash = validated_data.pop("parse_with_splash")
        self.no_robots = validated_data.pop("no_robots")
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

        fname = urlparse(url).netloc
        SAVE_DIR = os.path.join(wpath, fname)
        update_or_create_dir(SAVE_DIR)
        os.chmod(SAVE_DIR, 0o755)
        # Clear content at the SAVE_DIR
        os.chdir(SAVE_DIR)
        subprocess.run(["rm", "-rf", "*"])

        os.chdir(wpath)
        if (self.no_robots):
            subprocess.run(["wget", "-e robots=off", "-p", "-k", url])
        else:
            subprocess.run(["wget", "-p", "-k", url])
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

        return wpsaved

