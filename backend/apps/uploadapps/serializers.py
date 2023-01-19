import os
from zipfile import ZipFile

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
import json

from project.settings import MEDIA_ROOT, MEDIA_URL, BASE_DIR
from apps.utils.fset1 import update_or_create_dir, extract_zip
from apps.projects.models import ProjectImage, ProjectIllustrationSet
from apps.projects.serializers import ImageSerializer, IllustrationSetSerializer


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


class ObjectsMoveSerializer(serializers.ModelSerializer):
    EXPORT = "export"
    IMPORT = "import"
    ACTION_TYPE = (
        (EXPORT, "EXPORT"),
        (IMPORT, "IMPORT"),
    )

    SCENARIO = "scenario"
    SCREEN = "screen"
    PROJECT = "project"
    PROJECTIMAGE = "projectimage"
    PROJECTIMAGESET = "projectimageset"
    OBJECT_TYPE = (
        (SCENARIO, "SCENARIO"),
        (SCREEN, "SCREEN"),
        (PROJECT, "PROJECT"),
        (PROJECTIMAGE, "PROJECTIMAGE"),
        (PROJECTIMAGESET, "PROJECTIMAGESET"),
    )

    action = serializers.ChoiceField(
        choices=ACTION_TYPE, default=EXPORT
    )

    object_type = serializers.ChoiceField(
        choices=OBJECT_TYPE, default=SCENARIO
    )

    wpname = serializers.URLField(required=False)
    archive = serializers.FileField(required=False)
    object_id = serializers.IntegerField(required=False)
    # no_robots = serializers.BooleanField(required=False)

    class Meta:
        model = WpgSaved
        fields = ("wpname", "owner", "archive", "action", "object_type", "object_id")
        extra_kwargs = {"action": {"read_only": True}, "object_type": {"read_only": True}, "object_id": {"read_only": True}, "archive": {"read_only": True}}

    def create(self, validated_data):
        # url = validated_data.pop("wpname", None)
        wpname = validated_data["wpname"]
        self.action = validated_data.pop("action")
        self.object_type = validated_data.pop("object_type")
        print(self.object_type)

        json_response = {}

        t = ""
        if (self.action == "export"):
            self.object_id = validated_data.pop("object_id")
            if (self.object_type == "projectimage"):
                queryset = ProjectImage.objects.get(pk=self.object_id)
                serializer = ImageSerializer(queryset)
                json_response = serializer.data
                image = BASE_DIR + serializer.data["image"]
                print("base dir path", BASE_DIR)
                print(json_response)
                print(image)

            if (self.object_type == "projectimageset"):
                queryset = ProjectIllustrationSet.objects.get(pk=self.object_id)
                serializer = IllustrationSetSerializer(queryset)
                json_response = serializer.data
                # image = BASE_DIR + serializer.data["image"]
                print("base dir path", BASE_DIR)
                print(json_response)
                # print(image)

            wpath = MEDIA_ROOT + "/uploads/"
            os.chdir(wpath)

            fname = self.object_type + '_' + str(self.object_id)
            SAVE_DIR = os.path.join(wpath, fname)
            update_or_create_dir(SAVE_DIR)
            os.chmod(SAVE_DIR, 0o755)
            # Clear content at the SAVE_DIR
            os.chdir(SAVE_DIR)
            subprocess.run(['rm -rf *'], shell=True)

            try:
                # Copying images to the object pre-archived folder
                # for ProjectImages
                shutil.copy2(image, SAVE_DIR)
            except Exception:
                pass

            # Write a file
            with open('objectjson.json', 'w') as outfile:
                outfile.write(json.dumps(json_response))

            # Archive all the files for a zip directory
            os.chdir(wpath)
            shutil.make_archive(SAVE_DIR, "zip", SAVE_DIR)
            zip_archive_name = fname + ".zip"

            # Obtaining the absolute path for the parameters directly. Should change this later.
            o = urlparse(self.context["request"].build_absolute_uri())
            t = (
                "https://" + o.netloc + MEDIA_URL + "uploads/" + zip_archive_name
            )

            # wpsaved.wpname = t

        if (self.action == "import"):
            if (self.object_type == "projectimage"):

                self.archive = validated_data.pop("archive")
                # Read the archive
                files = extract_zip(self.archive)
                # print(files.namelist())
                # print(type(files["50723_jira_reactos_org_login_jsp_os__1_qe6wKpw.png"]))
                o_data = json.loads(files["objectjson.json"])
                # Clear the illustration set (parent object) value
                o_data["illustration_set"] = None
                print("io", o_data["image"], os.path.basename(o_data["image"]))

                imgname = os.path.basename(o_data["image"])
                o_data["image"] = UploadedFile(
                    BytesIO(files[imgname]), name=imgname
                )
                del o_data["fileurl"]
                del o_data["id"]
                # print(o_data)
                print(os.path.abspath(os.getcwd()))
                projectimage = ProjectImage(**o_data)
                # projectimage.image = files["50723_jira_reactos_org_login_jsp_os__1_qe6wKpw.png"]
                projectimage.save()
                object_id = projectimage.id

            if (self.object_type == "projectimageset"):

                self.archive = validated_data.pop("archive")
                # Read the archive
                files = extract_zip(self.archive)
                # print(files.namelist())
                # print(type(files["50723_jira_reactos_org_login_jsp_os__1_qe6wKpw.png"]))
                o_data = json.loads(files["objectjson.json"])
                # Clear the project (parent object) value
                del o_data["project"]
                # print("io", o_data["image"], os.path.basename(o_data["image"]))

                # imgname = os.path.basename(o_data["image"])
                # o_data["image"] = UploadedFile(BytesIO(files[imgname]), name=imgname)
                del o_data["images"]
                del o_data["id"]
                # print(o_data)
                print(os.path.abspath(os.getcwd()))
                projectimageset = ProjectIllustrationSet(**o_data)
                # projectimage.image = files["50723_jira_reactos_org_login_jsp_os__1_qe6wKpw.png"]
                projectimageset.save()
                object_id = projectimageset.id


        # Create a record for the object move
        wpsaved = WpgSaved(id=None, **validated_data)
        wpsaved.wpname = t
        try:
            wpsaved.object_id = object_id
        except Exception:
            pass
        wpsaved.save()
        return wpsaved

