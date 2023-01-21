import os
from zipfile import ZipFile

import requests
from urllib.parse import urlparse
from io import BytesIO
from django.core.files.uploadedfile import UploadedFile
from rest_framework import serializers
from rest_framework.renderers import JSONRenderer

from apps.uploadapps.models import Fileupload, WebpageSaved, WpgSaved, ObjectMove
import subprocess
import shutil
import scrapy
from scrapy_splash import SplashRequest
import urllib.robotparser
import json

from project.settings import MEDIA_ROOT, MEDIA_URL, BASE_DIR
from apps.utils.fset1 import (
    update_or_create_dir,
    extract_zip,
    item_generator,
    recursive_lookup,
    update_nested,
)
from apps.projects.models import (
    ProjectImage,
    ProjectIllustrationSet,
    ScreenScenario,
    ProjectScreen,
    Project,
)
from apps.projects.serializers import (
    ImageSerializer,
    IllustrationSetSerializer,
    ScreenScenarioSerializer,
    ScreenScenarioExportSerializer,
    ScreenScenarioImportSerializer,
    ProjectImportExportSerializer,
    ProjectScreenImportSerializer,
)


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
        AGENT_NAME = "Wget"

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
            if line.startswith("Allow"):  # this is for allowed url
                result_data_set["Allowed"].append(
                    line.split(": ")[1].split(" ")[0]
                )  # to neglect the comments or other junk info
            elif line.startswith("Disallow"):  # this is for disallowed url
                try:
                    result_data_set["Disallowed"].append(
                        line.split(": ")[1].split(" ")[0]
                    )
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
        "SPIDER_MIDDLEWARES": {"scrapy_splash.SplashDeduplicateArgsMiddleware": 100},
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
        extra_kwargs = {
            "parse_with_splash": {"read_only": True},
            "no_robots": {"read_only": True},
        }

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
        """
        wpname = urlparse(url).path.split("/")[-1]
        if not wpname:
            wpname = urlparse(url).netloc
        """
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
        if self.no_robots:
            subprocess.run(["wget", "-e robots=off", "-p", "-k", url])
        else:
            subprocess.run(["wget", "-p", "-k", url])
        # Archive all the files for a zip directory
        shutil.make_archive(SAVE_DIR, "zip", SAVE_DIR)
        zip_archive_name = fname + ".zip"

        # Obtaining the absolute path for the parameters directly. Should change this later.
        o = urlparse(self.context["request"].build_absolute_uri())
        t = "https://" + o.netloc + MEDIA_URL + "uploads/" + zip_archive_name

        wpsaved.wpname = t
        wpsaved.save()

        return wpsaved

    def start_requests(self):
        for url in self.start_urls:
            yield SplashRequest(url, self.parse, args={"wait": 11})

    def parse(self, response, validated_data):
        if self.parse_with_splash:
            subprocess.run(["wget", "-p", "-k", response.url])


class ObjectMoveSerializer(serializers.ModelSerializer):
    archive = serializers.FileField(required=False)

    class Meta:
        model = ObjectMove
        fields = ("link", "archive", "action", "object_type", "object_id")
        # extra_kwargs = {"action": {"read_only": True}, "object_type": {"read_only": True}, "object_id": {"read_only": True}, "archive": {"read_only": True}}
        extra_kwargs = {
            "action": {"write_only": True},
            "object_type": {"write_only": True},
            "archive": {"read_only": True},
        }

    def create(self, validated_data):
        self.action = validated_data["action"]
        self.object_type = validated_data["object_type"]
        print(self.object_type)
        # Object id has the meaning for export at the validated data
        try:
            object_id = self.object_id = validated_data.pop("object_id")
        except Exception:
            object_id = self.object_id = -1

        json_response = {}

        # archive_link = ""
        if self.action == "export":
            images = []
            if self.object_type == "projectimage":
                queryset = ProjectImage.objects.get(pk=self.object_id)
                serializer = ImageSerializer(queryset)
                json_response = serializer.data
                # The image full path
                image = BASE_DIR + serializer.data["image"]
                images.append(image)
                print("base dir path", BASE_DIR)
                print(json_response)
                print("image: ", image)
                print("images: ", images)

            if self.object_type == "projectimageset":
                queryset = ProjectIllustrationSet.objects.get(pk=self.object_id)
                serializer = IllustrationSetSerializer(queryset)
                json_response = serializer.data
                imgdatas = serializer.data["images"]
                # Take non-empty images
                for imgdata in imgdatas:
                    if imgdata["image"]:
                        image = BASE_DIR + imgdata["image"]
                        images.append(image)
                print("base dir path", BASE_DIR)
                print(json_response)
                # print(image)
                print("images", serializer.data["images"])

            if self.object_type == "scenario":
                queryset = ScreenScenario.objects.get(pk=self.object_id)
                serializer = ScreenScenarioExportSerializer(queryset)
                json_response = serializer.data
                # The image full path
                # image = BASE_DIR + serializer.data["image"]
                # images.append(image)
                # print("base dir path:", BASE_DIR)
                # print("json_response:", json_response)

                # Take non-empty images
                for element in json_response["elements"]:
                    for key in element["parameters"]:
                        if key == "imageURL":
                            o = urlparse(element["parameters"]["imageURL"])
                            image = BASE_DIR + o.path
                            images.append(image)

            if self.object_type == "screen":
                queryset = ProjectScreen.objects.get(pk=self.object_id)
                serializer = ProjectScreenImportSerializer(queryset)
                json_response = serializer.data

                # Read the json
                content_json = json.loads(JSONRenderer().render(json_response))
                # The image full path
                # image = BASE_DIR + serializer.data["image"]
                # images.append(image)
                print("base dir path", BASE_DIR)
                # print(json_response)
                print(content_json)
                # Find image urls recursively. They are at elements parameters usually. Take non-empty images
                imageurls = item_generator(content_json, "imageURL")
                print(imageurls)
                for imageurl in imageurls:
                    # print(imageurl)
                    o = urlparse(imageurl)
                    image = BASE_DIR + o.path
                    print(image)
                    images.append(image)

            if self.object_type == "project":
                queryset = Project.objects.get(pk=self.object_id)
                serializer = ProjectImportExportSerializer(queryset)
                json_response = serializer.data

                # Read the json
                content_json = json.loads(JSONRenderer().render(json_response))
                # The image full path
                # image = BASE_DIR + serializer.data["image"]
                # images.append(image)
                # print("base dir path", BASE_DIR)
                # print(json_response)
                # print(content_json)
                # Find image urls recursively. They are at elements parameters usually. Take non-empty images
                imageurls = item_generator(content_json, "imageURL")
                # print(imageurls)
                for imageurl in imageurls:
                    # print(imageurl)
                    o = urlparse(imageurl)
                    image = BASE_DIR + o.path
                    print(image)
                    images.append(image)

            wpath = MEDIA_ROOT + "/uploads/"
            os.chdir(wpath)

            fname = self.object_type + "_" + str(self.object_id)
            SAVE_DIR = os.path.join(wpath, fname)
            update_or_create_dir(SAVE_DIR)
            os.chmod(SAVE_DIR, 0o755)
            # Clear content at the SAVE_DIR
            os.chdir(SAVE_DIR)
            subprocess.run(["rm -rf *"], shell=True)
            # print("SD", SAVE_DIR)

            for image in images:
                # Copying images to the object pre-archived folder
                # for ProjectImage, ProjectImageSet
                try:
                    shutil.copy2(image, SAVE_DIR)
                    print("SD", SAVE_DIR)
                except Exception:
                    pass

            # Write a file
            with open("objectjson.json", "w") as outfile:
                outfile.write(json.dumps(json_response))

            # Archive all the files for a zip directory
            os.chdir(wpath)
            shutil.make_archive(SAVE_DIR, "zip", SAVE_DIR)
            zip_archive_name = fname + ".zip"

            # Obtaining the absolute path for the parameters directly. Should change this later.
            o = urlparse(self.context["request"].build_absolute_uri())
            archive_link = (
                "https://" + o.netloc + MEDIA_URL + "uploads/" + zip_archive_name
            )

        if self.action == "import":
            self.archive = validated_data.pop("archive")
            # Read the archive
            files = extract_zip(self.archive)
            o_data = json.loads(files["objectjson.json"])

            # Create the upload directory
            UPLOAD_FOLDER = (
                MEDIA_URL
                + "uploads/"
                + self.context["request"].user.username
                + "/"
                + os.path.splitext(str(self.archive))[0]
            )
            UPLOAD_DIR = (
                MEDIA_ROOT
                + "/uploads/"
                + self.context["request"].user.username
                + "/"
                + os.path.splitext(str(self.archive))[0]
            )
            # update_or_create_dir(UPLOAD_DIR)
            os.makedirs(UPLOAD_DIR, exist_ok=True)
            os.chmod(UPLOAD_DIR, 0o755)
            # Enter the UPLOAD_DIR
            os.chdir(UPLOAD_DIR)
            # Extract files to the upload directory
            ZipFile(self.archive).extractall()

            if self.object_type == "projectimage":
                # Clear the illustration set (parent object) value
                o_data["illustration_set"] = None

                print("io", o_data["image"], os.path.basename(o_data["image"]))

                imgname = os.path.basename(o_data["image"])
                o_data["image"] = UploadedFile(BytesIO(files[imgname]), name=imgname)

                del o_data["fileurl"]
                del o_data["id"]

                projectimage = ProjectImage(**o_data)
                projectimage.save()
                object_id = projectimage.id

            if self.object_type == "projectimageset":
                # Clear the project (parent object) value
                del o_data["project"]
                # print("io", o_data["images"], BASE_DIR)
                imagedatas = o_data.pop("images")
                projectimages = []
                for imagedata in imagedatas:
                    if imagedata["image"]:
                        print(imagedata)
                        del imagedata["illustration_set"]
                        del imagedata["fileurl"]
                        del imagedata["id"]
                        projectimage = ProjectImage(**imagedata)
                        projectimage.save()
                        projectimages.append(projectimage)

                del o_data["id"]
                # print(o_data)
                print(os.path.abspath(os.getcwd()))
                projectimageset = ProjectIllustrationSet(**o_data)
                projectimageset.save()
                # Adding images
                for projectimage in projectimages:
                    projectimage.illustration_set = projectimageset
                    projectimage.save()

                object_id = projectimageset.id

            if self.object_type == "scenario":
                # Clear the screen (parent object) value
                o_data["screen"] = None
                """
                # Re-write non-empty images for elements parameters. Elements are recursive.
                # It is a simplification for one level. More complex solution means a multi-level nested dictionary update
                for element in o_data["elements"]:
                    for key in element["parameters"]:
                        if key == "imageURL":
                            imgname = urlparse(element["parameters"]["imageURL"]).path.split("/")[-1]
                            o = urlparse(self.context['request'].build_absolute_uri())
                            imageURL = "https://" + o.netloc + UPLOAD_FOLDER + "/" + imgname
                            element["parameters"]["imageURL"] = imageURL
                """
                # Re-write non-empty images for elements parameters. Elements are recursive.
                o = urlparse(self.context["request"].build_absolute_uri())
                pre_imageURL = "https://" + o.netloc + UPLOAD_FOLDER + "/"
                update_nested(o_data, "imageURL", pre_imageURL)

                serializer = ScreenScenarioImportSerializer(data=o_data)
                serializer.is_valid(raise_exception=True)
                object = serializer.save()
                object_id = object.id

            if self.object_type == "screen":
                # Clear the project (parent object) value
                o_data["project"] = None

                # Re-write non-empty images for elements parameters. Elements are recursive.
                o = urlparse(self.context["request"].build_absolute_uri())
                pre_imageURL = "https://" + o.netloc + UPLOAD_FOLDER + "/"
                update_nested(o_data, "imageURL", pre_imageURL)

                # Nulling parent ids for scenarios
                for screenscenario in o_data["screenscenario"]:
                    moved_indices_screen = screenscenario.pop("screen", None)

                serializer = ProjectScreenImportSerializer(data=o_data)
                serializer.is_valid(raise_exception=True)
                # serializer.save()
                object = serializer.save()
                object_id = object.id

            if self.object_type == "project":
                # Clear the user (parent object) value
                o_data["user"] = self.context["request"].user.id
                # Re-write non-empty images for elements parameters. Elements are recursive.
                o = urlparse(self.context["request"].build_absolute_uri())
                pre_imageURL = "https://" + o.netloc + UPLOAD_FOLDER + "/"
                update_nested(o_data, "imageURL", pre_imageURL)

                # Nulling parent ids for screens and scenarios
                for screen in o_data["projectscreen"]:
                    moved_indices_project = screen.pop("project", None)
                    for screenscenario in screen:
                        moved_indices_screen = screen.pop("screen", None)

                serializer = ProjectImportExportSerializer(
                    data=o_data, context={"request": self.context["request"]}
                )
                serializer.is_valid(raise_exception=True)
                object = serializer.save()
                object_id = object.id

        # Create a record for the object move
        objectmove = ObjectMove(id=None, **validated_data)
        objectmove.object_id = object_id
        try:
            objectmove.link = archive_link
        except Exception:
            pass

        objectmove.save()
        return objectmove
