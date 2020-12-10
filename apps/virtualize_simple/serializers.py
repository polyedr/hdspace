import json
import os, sys
import copy
import shutil

import lorem
import numpy as np
import math
import uuid
from statistics import median

from anytree import RenderTree, NodeMixin, AnyNode
from pytesseract import Output
from rest_framework_recursive.fields import RecursiveField

from project.settings import model_forms, MEDIA_ROOT, model_headers, model_footers, MEDIA_URL
from rest_framework import serializers
from apps.projects.models import ScenarioElement, ProjectScreen
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_blobs
from sklearn import cluster as clustermethod
from collections import Counter
import xml.etree.ElementTree as ET
import cv2
import pytesseract

from keras.preprocessing.image import load_img
from keras_preprocessing.image import img_to_array

from apps.utils.object_detection import (
    run_text_detection,
    get_rect_contours,
    show_rects,
    show_rois,
)
from apps.utils.fset1 import (
    recognize_with_tesseract,
    get_dominant_colour,
    ClusterClass,
    Partition,
    dbcluster_split,
    blocks_split,
    closest_node,
    find_or_create_dir,
    calculateDistance,
    SQUARES_OVERLAP_THRESHOLD_TEXT,
    change_permissions_recursive)

config_tesseract = "-l eng --oem 1 --psm 3"

# The constant to remove rectangle when overlaps more than 90% with larger rectangle
SQUARES_OVERLAP_THRESHOLD = 0.9

# The constant to calculate horizontal overlap during the vertical groups detection
VERICAL_GROUPS_HORIZONTAL_OVERLAP_THRESHOLD = 0.75

# The constant to calculate vertical overlap during the horizontal groups detection
HORIZONTAL_GROUPS_VERTICAL_OVERLAP_THRESHOLD = 0.25

VIA_ANNOTATION_ASSEMBLING_FILE = "elements_websites_assembling.txt"


# How to use image preprocessing to improve the accuracy of Tesseract
# https://www.freecodecamp.org/news/getting-started-with-tesseract-part-ii-f7f9a0899b3f/
def apply_threshold(img, argument):
    switcher = {
        1: cv2.threshold(
            cv2.GaussianBlur(img, (9, 9), 0),
            0,
            255,
            cv2.THRESH_BINARY + cv2.THRESH_OTSU,
        )[1],
        2: cv2.threshold(
            cv2.GaussianBlur(img, (7, 7), 0),
            0,
            255,
            cv2.THRESH_BINARY + cv2.THRESH_OTSU,
        )[1],
        3: cv2.threshold(
            cv2.GaussianBlur(img, (5, 5), 0),
            0,
            255,
            cv2.THRESH_BINARY + cv2.THRESH_OTSU,
        )[1],
        18: cv2.adaptiveThreshold(
            cv2.medianBlur(img, 7),
            255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY,
            31,
            2,
        ),
        19: cv2.adaptiveThreshold(
            cv2.medianBlur(img, 5),
            255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY,
            31,
            2,
        ),
        20: cv2.adaptiveThreshold(
            cv2.medianBlur(img, 3),
            255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY,
            31,
            2,
        ),
    }
    return switcher.get(argument, "Invalid method")


def contains_rectangle(r1, r2):
    # Calculation for the case of rois
    return r1[1] < r2[1] < r2[3] < r1[3] and r1[0] < r2[0] < r2[2] < r1[2]


def detect_aligned_element(x1, width_elem, img_width):
    # Detect the alignment of the element
    # Text-align: left, if the left interval is smaller than the right interval
    aligned_element = "left"
    if x1 + (width_elem / 2) > (img_width / 2):
        aligned_element = "right"

    # Middle if the middle point placed at the 20% middle width for the whole image
    if abs(x1 + (width_elem / 2) - (img_width / 2)) < img_width * 0.2:
        aligned_element = "center"

    return aligned_element


# Python program to check if two
# to get unique values from list
# using set
# function to get unique values
def unique(list1):
    # insert the list to the set
    list_set = set(list1)
    # convert the set to the list
    unique_list = list(list_set)
    return unique_list


class ProjectScreenSerializer(serializers.ModelSerializer):
    screen_data_json = serializers.JSONField()

    class Meta:
        model = ProjectScreen
        ref_name = "RecognizeProject"

        fields = (
            "status",
            "project",
            "name",
            "buoyancy",
            "id",
            "image",
            "screen_data_text",
            "screen_data_json",
            "screenscenario",
        )
        extra_kwargs = {"screenscenario": {"read_only": True}, }

    def create(self, validated_data):
        # Extract an appropriate flag value to recognize block as header, footer, form or layout
        # Region dataset has some starting value
        region_dataset = "webpages"
        if validated_data.get("screen_data_json"):
            region_dataset = validated_data["screen_data_json"]["block_type"]
        print(region_dataset)

        fdict = {}  # Output dictionary to write annotation

        fname = ""
        imgpath = ""

        # Create the opencv recognition start
        image_dict = {}
        result_regions = {}

        text = False
        watch = True
        if validated_data.get("image"):
            image_recognize = validated_data.pop("image")
            node = ProjectScreen.objects.create(image=image_recognize,
                **validated_data
            )
            fname = str(image_recognize)
            imgpath = MEDIA_ROOT + "/uploads/" + fname
        else:
            node = ProjectScreen.objects.create(
                **validated_data
            )
        #
        # fname = str(validated_data["image"])
        # imgpath = MEDIA_ROOT + "/uploads/" + fname

        # Read an image with OpenCV start
        image_opencv_input = cv2.imread(imgpath)
        print(fname, imgpath, image_opencv_input)
        image_original = copy.deepcopy(image_opencv_input)
        # detect height and width of the image
        img_height, img_width, img_channels = image_opencv_input.shape
        # print("width:  ", img_width)
        # print("height: ", img_height)
        # print("channel:", img_channels)
        # Read an image with OpenCV end

        # Detect the font-size with tesseract for the whole image start
        whole_img = cv2.cvtColor(image_opencv_input, cv2.COLOR_BGR2GRAY)
        result = pytesseract.image_to_boxes(whole_img)
        lines = result.strip().split("\n")
        font_size = []

        for line in lines:
            chars = line.split(" ")
            try:
                font_size.append(float(chars[4]) - float(chars[2]))
            except Exception:
                font_size.append(12.0)  # Default font-size value is 12px
        font_size_img = int(median(font_size) * 1.7)  # Font-size value of the image
        # Detect the font-size with tesseract for the whole image end

        # Get(take the whole image) the dominant colour for the parent container
        bcolour_container_value = "255,255,255,0"
        domcolour_container = get_dominant_colour(image_opencv_input)
        domcolour_container.append(1)
        bcolour_container_value = ",".join(str(int(x)) for x in domcolour_container)

        # Detect text contours and rectangles on image start
        text_contours = []
        rect_contours = []
        # Detect text regions
        text_contours = run_text_detection(image_opencv_input, text=False)

        # text_contours1 = run_text_detection(image_opencv_input, text=True)
        #
        # print(text_contours1)
        # print("length", len(text_contours), len(text_contours1))
        #
        # input()
        # Detect rect regions
        rect_contours = get_rect_contours(image_opencv_input)

        for text_contour in text_contours:
            # Remove untypically wide text blocks
            width2 = text_contour[3]
            if width2 > (font_size_img * 3):
                text_contours.remove(text_contour)

        for rect_contour in rect_contours:
            # Remove untypically large rect blocks
            width2 = rect_contour[2]
            height2 = rect_contour[3]
            if (width2 * height2) > (img_height * img_width) * 0.75:
                rect_contours.remove(rect_contour)

        # Save all detected regions into dictionary
        result = {"text": text_contours, "rect": rect_contours}
        # Detect text contours and rectangles on image end

        # Create the opencv recognition end

        # Create the recognized_elements array start
        if imgpath:
            if region_dataset in {"forms", "headers", "footers"}:
                # Detect elements with Mask R CNN model start
                # imgpath = fname
                img = load_img(imgpath)
                img = img_to_array(img)

                if region_dataset == "forms":
                    results = model_forms.detect([img], verbose=1)

                if region_dataset == "headers":
                    results = model_headers.detect([img], verbose=1)

                if region_dataset == "footers":
                    results = model_footers.detect([img], verbose=1)

                r = results[0]
                # Detect elements with Mask R CNN model end

            img = load_img(imgpath)
            img = img_to_array(img)

            fsize = str(os.path.getsize(imgpath))
            fnamesize = fname + fsize

            fdict[fnamesize] = {
                "filename": fname,
                "size": fsize,
                "regions": [],
                "file_attributes": {},
            }

            # Window name for printing
            window_name1 = "image_opencv_text"

            if region_dataset in {"forms", "headers", "footers"}:
                # Printing text contours preparations start
                for text_contour in text_contours:
                    x, y, w, h = text_contour
                    # location = i.location  # y, x
                    # size = i.size  # width, height
                    element = "ocrtext"

                    # Fill the attributes dictionary
                    attributes_dict = {
                        "shape_attributes": {
                            "name": "rect",
                            "x": int(x),
                            "y": int(y),
                            "width": int(w),
                            "height": int(h),
                        },
                        "region_attributes": {"HTML element": element},
                    }
                    # Filter out small text contours with height > width
                    if w > h:
                        fdict[fnamesize]["regions"].append(attributes_dict)
                    # cv2.rectangle(image_opencv_input, (x, y), (x + w, y + h), (255, 0, 0), 1)

                # Printing text contours preparations end

                # Printing rect contours with concatenation preparations start
                for rect_contour in rect_contours:
                    x1, y1, w, h = rect_contour
                    x2 = w + x1
                    y2 = h + y1

                    # cv2.rectangle(image_opencv_input, (x1, y1), (x1 + w, y1 + h), (255, 0, 255), 1)
                    # cv2.imshow(window_name1, image_opencv_input)
                    # cv2.waitKey(0)

                    centers_distance_min = 10000

                    class_id_recognized = 7  # Image
                    for idx1, (rect1, class_id1) in enumerate(
                        zip(r["rois"], r["class_ids"])
                    ):
                        #  1,2,4,5,7 means elements except the text class and the radiobutton while merging forms
                        if (
                            (
                                (region_dataset == "forms")
                                and (class_id1 in {1, 2, 4, 5, 7})
                            )
                            or (
                                (region_dataset == "footers")
                                and (class_id1 in {2, 3, 4, 5})
                            )
                            or (
                                (region_dataset == "headers")
                                and (class_id1 in {2, 3, 4, 5, 6, 7, 8})
                            )
                        ):
                            x3 = rect1[1]
                            y3 = rect1[0]
                            x4 = rect1[3]
                            y4 = rect1[2]

                            # cv2.rectangle(image_opencv_input, (x3, y3), (x4, y4), (255, 100, 255), 1)

                            # Borders of the rectangles overlapped area
                            left = max(x1, x3)
                            bottom = max(y1, y3)
                            right = min(x2, x4)
                            top = min(y2, y4)
                            # Sizes of the rectangles overlapped area
                            width = right - left
                            height = top - bottom

                            # The first rectangle square
                            width1, height1 = x2 - x1, y2 - y1

                            # The second rectangle square
                            width2, height2 = x4 - x3, y4 - y3

                            # Calculate distance between rect_contour and idx1 with two dimensions
                            # Find the pair with smallest distance
                            # Save this pair for further processing
                            center_x12 = (x1 + x2) / 2
                            center_y12 = (y1 + y2) / 2
                            center_x34 = (x3 + x4) / 2
                            center_y34 = (y3 + y4) / 2
                            # print(calculateDistance(center_x12, center_y12, center_x34, center_y34))
                            centers_distance = calculateDistance(
                                center_x12, center_y12, center_x34, center_y34
                            )

                            # Check if width, height of the overlapped area less or equal 0
                            if not (width <= 0 or height <= 0):
                                # If the square > 0, calculate the squares of the 3 rectangles
                                square = width * height
                                square1 = width1 * height1
                                square2 = width2 * height2

                                if (
                                    square > square1 * SQUARES_OVERLAP_THRESHOLD_TEXT
                                ) or (
                                    square > square2 * SQUARES_OVERLAP_THRESHOLD_TEXT
                                ):
                                    if centers_distance < centers_distance_min:
                                        centers_distance_min = centers_distance
                                        # idx1_selected = idx1
                                        # Assign the class id value to the rect_contour
                                        class_id_recognized = class_id1
                                        # print("idx1_select", idx1)

                    # cv2.destroyAllWindows()

                    # forms:
                    # write the class value based on class id start
                    if region_dataset == "forms":
                        # Input
                        if class_id_recognized == 1:
                            element = "input"
                        # Button
                        if class_id_recognized == 2:
                            element = "button"
                        # Text
                        if class_id_recognized == 3:
                            element = "text"
                        # Select
                        if class_id_recognized == 4:
                            element = "select"
                        # Checkbox
                        if class_id_recognized == 5:
                            element = "checkbox"
                        # Radiobutton
                        if class_id_recognized == 6:
                            element = "radiobutton"
                        # Image
                        if class_id_recognized == 7:
                            element = "image"

                    # write the class value based on class id end

                    # headers:
                    # write the class value based on class id start
                    if region_dataset == "headers":
                        # Text
                        if class_id_recognized == 1:
                            element = "text"
                        # Image
                        if class_id_recognized == 2:
                            element = "image"
                        # Button
                        if class_id_recognized == 3:
                            element = "button"
                        # Menu
                        if class_id_recognized == 4:
                            element = "menu"
                        # Li
                        if class_id_recognized == 5:
                            element = "li"
                        # Input
                        if class_id_recognized == 6:
                            element = "input"
                        # Select
                        if class_id_recognized == 7:
                            element = "select"
                        # Form
                        if class_id_recognized == 8:
                            element = "form"

                    # write the class value based on class id end

                    # footers:
                    # write the class value based on class id start
                    if region_dataset == "footers":
                        # Text
                        if class_id_recognized == 1:
                            element = "text"
                        # Image
                        if class_id_recognized == 2:
                            element = "image"
                        # Button
                        if class_id_recognized == 3:
                            element = "button"
                        # Select
                        if class_id_recognized == 4:
                            element = "select"
                        # Input
                        if class_id_recognized == 5:
                            element = "input"
                    # write the class value based on class id end

                    # Fill the attributes dictionary
                    attributes_dict = {
                        "shape_attributes": {
                            "name": "rect",
                            "x": int(x1),
                            "y": int(y1),
                            "width": int(w),
                            "height": int(h),
                        },
                        "region_attributes": {"HTML element": element},
                    }
                    fdict[fnamesize]["regions"].append(attributes_dict)
                # Printing rect contours with concatenation preparations end

            if region_dataset in {"webpages"}:
                # Print all the contours to the file
                # Format the file Via-like
                # result = {"text": text_contours, "rect": rect_contours}
                # Printing text contours preparations start
                for text_contour in text_contours:
                    x, y, w, h = text_contour
                    # location = i.location  # y, x
                    # size = i.size  # width, height
                    element = "ocrtext"

                    # Fill the attributes dictionary
                    attributes_dict = {
                        "shape_attributes": {
                            "name": "rect",
                            "x": int(x),
                            "y": int(y),
                            "width": int(w),
                            "height": int(h),
                        },
                        "region_attributes": {"HTML element": element},
                    }
                    fdict[fnamesize]["regions"].append(attributes_dict)
                # Printing text contours preparations end

                # Printing rect contours preparations start
                for rect_contour in rect_contours:
                    x, y, w, h = rect_contour
                    # location = i.location  # y, x
                    # size = i.size  # width, height
                    element = "image"

                    # Fill the attributes dictionary
                    attributes_dict = {
                        "shape_attributes": {
                            "name": "rect",
                            "x": int(x),
                            "y": int(y),
                            "width": int(w),
                            "height": int(h),
                        },
                        "region_attributes": {"HTML element": element},
                    }
                    fdict[fnamesize]["regions"].append(attributes_dict)
                    # Printing rect contours preparations end

        sdj = json.dumps(fdict, indent=4)
        node.screen_data_json = sdj

        return node


class ScenarioElementSerializer(serializers.ModelSerializer):
    parameters = serializers.JSONField()
    styles = serializers.JSONField()
    children = RecursiveField(required=False, allow_null=True, many=True)
    container = serializers.PrimaryKeyRelatedField(source="node.id", read_only=True)
    parent_id = serializers.IntegerField()

    class Meta:
        model = ScenarioElement
        fields = (
            "id",
            "container",
            "name",
            "children",
            "parent_id",
            "struct_type",
            "func_type",
            "direction",
            "buoyancy",
            "image",
            "parameters",
            "styles",
        )

        extra_kwargs = {
            "struct_type": {"read_only": True},
            "func_type": {"read_only": True},
        }

    def create(self, validated_data):
        root_element_data = {
            "struct_type": "container",
            "func_type": "undefined",
            "parameters": {},
            "styles": {},
        }

        # Pre-Root element assignment
        element_root_pre = ScenarioElement.objects.get(id=validated_data["parent_id"])

        # Extract an appropriate flag value to recognize block as header, footer, form or layout
        # Region dataset has some starting value
        region_dataset = "webpages"
        styles_on = 0

        try:
            if validated_data.get("parameters"):
                region_dataset = validated_data["parameters"]["block_type"]
                styles_on = validated_data["parameters"]["styles_on"]
        except Exception:
            pass
        # print(region_dataset)

        fdict = {}  # Output dictionary to write annotation

        # Create the root element mptt start
        # print(validated_data)
        # input()
        # print(root_element_data)
        fname = ""
        imgpath = ""
        if validated_data.get("image"):
            serializer_node = ScenarioElement.objects.create(
                parent=element_root_pre,
                image=validated_data["image"],
                **root_element_data
            )
            fname = str(validated_data["image"])
            imgpath = MEDIA_ROOT + "/uploads/" + fname
        else:
            serializer_node = ScenarioElement.objects.create(
                parent=element_root_pre, **root_element_data
            )
        # Create the root element mptt end

        # Create the opencv recognition start
        image_dict = {}
        result_regions = {}

        text = False
        watch = True

        # Read an image with OpenCV start
        image_opencv_input = cv2.imread(imgpath)
        image_original = copy.deepcopy(image_opencv_input)
        image_maskrcnn_notext = copy.deepcopy(image_opencv_input)
        image_maskrcnn = copy.deepcopy(image_opencv_input)
        image_fclusters = copy.deepcopy(image_opencv_input)
        image_dbclusters = copy.deepcopy(image_opencv_input)
        image_cclusters = copy.deepcopy(image_opencv_input)
        image_allclusters = copy.deepcopy(image_opencv_input)
        image_allcluelems = copy.deepcopy(image_opencv_input)
        image_via = copy.deepcopy(image_opencv_input)
        # detect height and width of the image
        img_height, img_width, img_channels = image_opencv_input.shape
        # print("width:  ", img_width)
        # print("height: ", img_height)
        # print("channel:", img_channels)
        # Read an image with OpenCV end

        # Detect the font-size with tesseract for the whole image start
        whole_img = cv2.cvtColor(image_opencv_input, cv2.COLOR_BGR2GRAY)
        result = pytesseract.image_to_boxes(whole_img)
        lines = result.strip().split("\n")
        font_size = []

        for line in lines:
            chars = line.split(" ")
            try:
                font_size.append(float(chars[4]) - float(chars[2]))
            except Exception:
                font_size.append(12.0)  # Default font-size value is 12px
        font_size_img = int(median(font_size) * 1.7)  # Font-size value of the image
        # Detect the font-size with tesseract for the whole image end

        # Get(take the whole image) the dominant colour for the parent container
        bcolour_container_value = "255,255,255,0"
        domcolour_container = get_dominant_colour(image_opencv_input)
        domcolour_container.append(1)
        bcolour_container_value = ",".join(str(int(x)) for x in domcolour_container)

        # Detect text contours and rectangles on image start
        text_contours = []
        rect_contours = []
        # Detect text regions
        text_contours = run_text_detection(image_opencv_input, text=False)

        # text_contours1 = run_text_detection(image_opencv_input, text=True)
        #
        # print(text_contours1)
        # print("length", len(text_contours), len(text_contours1))
        #
        # input()
        # Detect rect regions
        rect_contours = get_rect_contours(image_opencv_input)

        for text_contour in text_contours:
            # Remove untypically wide text blocks
            width2 = text_contour[3]
            if width2 > (font_size_img * 3):
                text_contours.remove(text_contour)

        # Remove close-by text blocks
        # text contour
        # (161, 80, 243, 24)
        # x, y, width, height
        # x, y, x1, y1
        merged_contours = []
        excluded_contours = set()
        for idx, text_contour in enumerate(text_contours):
            x, y, w, h = text_contour
            for idx1, text_contour1 in enumerate(text_contours):
                x1, y1, w1, h1 = text_contour1
                if idx != idx1:
                    # Intervals should be close to each other not more than for 3px
                    text_contour_x = x
                    text_contour_x1 = x + w
                    text_contour_y = y
                    text_contour_y1 = y + h

                    text_contour1_x = x1
                    text_contour1_x1 = x1 + w1
                    text_contour1_y = y1
                    text_contour1_y1 = y1 + h1

                    # Borders of the overlapped area
                    bottom = max(y, y1)
                    top = min(y + h, y1 + h1)

                    # Length of the overlapped area
                    vertical_overlap = top - bottom

                    if (vertical_overlap > HORIZONTAL_GROUPS_VERTICAL_OVERLAP_THRESHOLD * min(h, h1)):
                        if (text_contour_x1 + 3 > text_contour1_x) and (text_contour_x < text_contour1_x):
                            # Merge these intervals
                            tcont_y = min(text_contour_y, text_contour1_y, text_contour_y1, text_contour1_y1)
                            tcont_y1 = max(text_contour_y, text_contour1_y, text_contour_y1, text_contour1_y1)
                            tcont_x = min(text_contour_x, text_contour1_x, text_contour_x1, text_contour1_x1)
                            tcont_x1 = max(text_contour_x, text_contour1_x, text_contour_x1, text_contour1_x1)

                            tcont_width = tcont_x1 - tcont_x
                            tcont_height = tcont_y1 - tcont_y
                            tcont = (tcont_x, tcont_y, tcont_width, tcont_height)
                            # Add new interval to list
                            merged_contours.append(tcont)

                            # Remove source intervals from list
                            excluded_contours.add(idx)
                            excluded_contours.add(idx1)

        # Remove set of indices from list
        text_contours = [i for j, i in enumerate(text_contours) if j not in excluded_contours]
        # Add merged contours to list
        text_contours.extend(merged_contours)

        for rect_contour in rect_contours:
            # Remove untypically large rect blocks
            width2 = rect_contour[2]
            height2 = rect_contour[3]
            if (width2 * height2) > (img_height * img_width) * 0.75:
                rect_contours.remove(rect_contour)

        # Save all detected regions into dictionary
        result = {"text": text_contours, "rect": rect_contours}
        # Detect text contours and rectangles on image end

        window_name1 = "image_opencv"

        # Create the opencv recognition end

        #
        #
        # Here is the divergency point between images and footers

        # Create the recognized_elements array start
        if imgpath:
            if region_dataset in {"forms", "headers", "footers"}:
                # Detect elements with Mask R CNN model start
                # imgpath = fname
                img = load_img(imgpath)
                img = img_to_array(img)

                if region_dataset == "forms":
                    results = model_forms.detect([img], verbose=1)

                if region_dataset == "headers":
                    results = model_headers.detect([img], verbose=1)

                if region_dataset == "footers":
                    results = model_footers.detect([img], verbose=1)

                r = results[0]
                # Detect elements with Mask R CNN model end

            img = load_img(imgpath)
            img = img_to_array(img)

            fsize = str(os.path.getsize(imgpath))
            fnamesize = fname + fsize

            fdict[fnamesize] = {
                "filename": fname,
                "size": fsize,
                "regions": [],
                "file_attributes": {},
            }

            # Create directory to save HTML for some image processed
            # CURRENT_DIR = os.getcwd()
            SAVE_DIR = os.path.join(MEDIA_ROOT, fname)
            find_or_create_dir(SAVE_DIR)

            os.chmod(SAVE_DIR, 0o755)
            os.chdir(SAVE_DIR)

            if region_dataset in {"forms", "headers", "footers"}:
                # Printing text contours preparations start
                for text_contour in text_contours:
                    x, y, w, h = text_contour
                    # location = i.location  # y, x
                    # size = i.size  # width, height
                    element = "ocrtext"

                    # Fill the attributes dictionary
                    attributes_dict = {
                        "shape_attributes": {
                            "name": "rect",
                            "x": int(x),
                            "y": int(y),
                            "width": int(w),
                            "height": int(h),
                        },
                        "region_attributes": {"HTML element": element},
                    }
                    # Filter out small text contours with height > width
                    if w > h:
                        fdict[fnamesize]["regions"].append(attributes_dict)
                    cv2.rectangle(image_opencv_input, (x, y), (x + w, y + h), (255, 0, 0), 1)

                # Printing text contours preparations end

                # Printing rect contours with concatenation preparations start
                for rect_contour in rect_contours:
                    x1, y1, w, h = rect_contour
                    x2 = w + x1
                    y2 = h + y1

                    cv2.rectangle(image_opencv_input, (x1, y1), (x1 + w, y1 + h), (255, 0, 255), 1)
                    # cv2.imshow(window_name1, image_opencv_input)
                    # cv2.waitKey(0)

                    centers_distance_min = 10000

                    class_id_recognized = 7  # Image
                    for idx1, (rect1, class_id1) in enumerate(
                        zip(r["rois"], r["class_ids"])
                    ):
                        #  1,2,4,5,7 means elements except the text class and the radiobutton while merging forms
                        if (
                            (
                                (region_dataset == "forms")
                                and (class_id1 in {1, 2, 4, 5, 7})
                            )
                            or (
                                (region_dataset == "footers")
                                and (class_id1 in {2, 3, 4, 5})
                            )
                            or (
                                (region_dataset == "headers")
                                and (class_id1 in {2, 3, 4, 5, 6, 7, 8})
                            )
                        ):
                            x3 = rect1[1]
                            y3 = rect1[0]
                            x4 = rect1[3]
                            y4 = rect1[2]

                            # cv2.rectangle(image_opencv_input, (x3, y3), (x4, y4), (255, 100, 255), 1)

                            # Borders of the rectangles overlapped area
                            left = max(x1, x3)
                            bottom = max(y1, y3)
                            right = min(x2, x4)
                            top = min(y2, y4)
                            # Sizes of the rectangles overlapped area
                            width = right - left
                            height = top - bottom

                            # The first rectangle square
                            width1, height1 = x2 - x1, y2 - y1

                            # The second rectangle square
                            width2, height2 = x4 - x3, y4 - y3

                            # Calculate distance between rect_contour and idx1 with two dimensions
                            # Find the pair with smallest distance
                            # Save this pair for further processing
                            center_x12 = (x1 + x2) / 2
                            center_y12 = (y1 + y2) / 2
                            center_x34 = (x3 + x4) / 2
                            center_y34 = (y3 + y4) / 2
                            # print(calculateDistance(center_x12, center_y12, center_x34, center_y34))
                            centers_distance = calculateDistance(
                                center_x12, center_y12, center_x34, center_y34
                            )

                            # Check if width, height of the overlapped area less or equal 0
                            if not (width <= 0 or height <= 0):
                                # If the square > 0, calculate the squares of the 3 rectangles
                                square = width * height
                                square1 = width1 * height1
                                square2 = width2 * height2

                                if (
                                    square > square1 * SQUARES_OVERLAP_THRESHOLD_TEXT
                                ) or (
                                    square > square2 * SQUARES_OVERLAP_THRESHOLD_TEXT
                                ):
                                    if centers_distance < centers_distance_min:
                                        centers_distance_min = centers_distance
                                        # idx1_selected = idx1
                                        # Assign the class id value to the rect_contour
                                        class_id_recognized = class_id1
                                        # print("idx1_select", idx1)

                    # cv2.destroyAllWindows()

                    cv2.imwrite("opencv_contours_" + fname, image_opencv_input)

                    # forms:
                    # write the class value based on class id start
                    if region_dataset == "forms":
                        # Input
                        if class_id_recognized == 1:
                            element = "input"
                        # Button
                        if class_id_recognized == 2:
                            element = "button"
                        # Text
                        if class_id_recognized == 3:
                            element = "text"
                        # Select
                        if class_id_recognized == 4:
                            element = "select"
                        # Checkbox
                        if class_id_recognized == 5:
                            element = "checkbox"
                        # Radiobutton
                        if class_id_recognized == 6:
                            element = "radiobutton"
                        # Image
                        if class_id_recognized == 7:
                            element = "image"

                    # write the class value based on class id end

                    # headers:
                    # write the class value based on class id start
                    if region_dataset == "headers":
                        # Text
                        if class_id_recognized == 1:
                            element = "text"
                        # Image
                        if class_id_recognized == 2:
                            element = "image"
                        # Button
                        if class_id_recognized == 3:
                            element = "button"
                        # Menu
                        if class_id_recognized == 4:
                            element = "menu"
                        # Li
                        if class_id_recognized == 5:
                            element = "li"
                        # Input
                        if class_id_recognized == 6:
                            element = "input"
                        # Select
                        if class_id_recognized == 7:
                            element = "select"
                        # Form
                        if class_id_recognized == 8:
                            element = "form"

                    # write the class value based on class id end

                    # footers:
                    # write the class value based on class id start
                    if region_dataset == "footers":
                        # Text
                        if class_id_recognized == 1:
                            element = "text"
                        # Image
                        if class_id_recognized == 2:
                            element = "image"
                        # Button
                        if class_id_recognized == 3:
                            element = "button"
                        # Select
                        if class_id_recognized == 4:
                            element = "select"
                        # Input
                        if class_id_recognized == 5:
                            element = "input"
                    # write the class value based on class id end

                    # Fill the attributes dictionary
                    attributes_dict = {
                        "shape_attributes": {
                            "name": "rect",
                            "x": int(x1),
                            "y": int(y1),
                            "width": int(w),
                            "height": int(h),
                        },
                        "region_attributes": {"HTML element": element},
                    }
                    fdict[fnamesize]["regions"].append(attributes_dict)
                # Printing rect contours with concatenation preparations end

            if region_dataset in {"webpages"}:
                # Print all the contours to the file
                # Format the file Via-like
                # result = {"text": text_contours, "rect": rect_contours}
                # Printing text contours preparations start
                for text_contour in text_contours:
                    x, y, w, h = text_contour
                    # location = i.location  # y, x
                    # size = i.size  # width, height
                    element = "ocrtext"

                    # Fill the attributes dictionary
                    attributes_dict = {
                        "shape_attributes": {
                            "name": "rect",
                            "x": int(x),
                            "y": int(y),
                            "width": int(w),
                            "height": int(h),
                        },
                        "region_attributes": {"HTML element": element},
                    }
                    fdict[fnamesize]["regions"].append(attributes_dict)
                # Printing text contours preparations end

                # Printing rect contours preparations start
                for rect_contour in rect_contours:
                    x, y, w, h = rect_contour
                    # location = i.location  # y, x
                    # size = i.size  # width, height
                    element = "image"

                    # Fill the attributes dictionary
                    attributes_dict = {
                        "shape_attributes": {
                            "name": "rect",
                            "x": int(x),
                            "y": int(y),
                            "width": int(w),
                            "height": int(h),
                        },
                        "region_attributes": {"HTML element": element},
                    }
                    fdict[fnamesize]["regions"].append(attributes_dict)
                    # Printing rect contours preparations end

        # os.chdir(SCRIPT_DIR)
        """
        # Print the json data to the validation dataset
        with open(region_dataset + "_elements_websites_tr.json", "w") as json_file:
            # print(file_dict)
            json.dump(fdict, json_file)
        """

        # Printing the pure Mask R CNN output without text blocks recognized
        for idx1, (rect1, class_id1) in enumerate(
                zip(r["rois"], r["class_ids"])
        ):
            #  1,2,4,5,7 means elements except the text class and the radiobutton while merging forms
            if (
                    (
                            (region_dataset == "forms")
                            and (class_id1 in {1, 2, 4, 5, 7})
                    )
                    or (
                    (region_dataset == "footers")
                    and (class_id1 in {2, 3, 4, 5})
            )
                    or (
                    (region_dataset == "headers")
                    and (class_id1 in {2, 3, 4, 5, 6, 7, 8})
            )
            ):
                x3 = rect1[1]
                y3 = rect1[0]
                x4 = rect1[3]
                y4 = rect1[2]

                cv2.rectangle(image_maskrcnn_notext, (x3, y3), (x4, y4), (255, 100, 255), 1)
                # Put the class id as a label. Keep in mind, that this label will be different for the specific block types
                cv2.putText(image_maskrcnn_notext, str(class_id1), (x3, y4), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (36, 255, 12), 2)

        cv2.imwrite("maskrcnn_notext_" + fname, image_maskrcnn_notext)

        # Printing the pure Mask R CNN output with text blocks and radiobuttons recognized
        for idx1, (rect1, class_id1) in enumerate(
                zip(r["rois"], r["class_ids"])
        ):
            x3 = rect1[1]
            y3 = rect1[0]
            x4 = rect1[3]
            y4 = rect1[2]

            cv2.rectangle(image_maskrcnn, (x3, y3), (x4, y4), (255, 100, 255), 1)
            # Put the class id as a label. Keep in mind, that this label will be different for the specific block types
            cv2.putText(image_maskrcnn, str(class_id1), (x3, y4), cv2.FONT_HERSHEY_SIMPLEX, 0.6,
                        (36, 255, 12), 2)

        cv2.imwrite("maskrcnn_" + fname, image_maskrcnn)

        # fdict obtained
        # file_dict = fdict

        # Assembling start
        # for filenamesize in fdict:
        # os.chdir(VIA_ANNOTATION_DIR)
        # print("Current Working Directory ", os.getcwd())

        # detect the size of the whole image
        # fsize = os.path.getsize(fname)

        for idx, region in enumerate(fdict[fnamesize]["regions"]):
            x1 = int(region["shape_attributes"]["x"])
            y1 = int(region["shape_attributes"]["y"])
            x2 = int(x1 + region["shape_attributes"]["width"])
            y2 = int(y1 + region["shape_attributes"]["height"])

            # Show VIA annotated regions on image
            cv2.rectangle(image_via, (x1, y1), (x2, y2), (255, 0, 0), 1)

        # Write VIA annotated regions to file
        cv2.imwrite("via_" + fname, image_via)

        # Detect the size of the visible elements region
        # detect the size of the visible elements
        # first do this based on annotated regions
        # go through all the regions
        # find xmin, xmax, ymin, ymax
        # compare this rectangle of visible elements with whole image
        # crop if the distance is more than 20px
        # extend borders if the distance is less than 20px
        min_x1 = img_width
        min_y1 = img_height
        max_x2 = 0
        max_y2 = 0
        # for idx, region in enumerate(fdict[filenamesize]["regions"]):
        for idx, region in enumerate(fdict[fnamesize]["regions"]):
            x1 = int(region["shape_attributes"]["x"])
            y1 = int(region["shape_attributes"]["y"])
            x2 = int(x1 + region["shape_attributes"]["width"])
            y2 = int(y1 + region["shape_attributes"]["height"])

            if min_x1 > x1:
                min_x1 = x1

            if min_y1 > y1:
                min_y1 = y1

            if max_x2 < x2:
                max_x2 = x2

            if max_y2 < y2:
                max_y2 = y2

        # cv2.rectangle(
        #     image_opencv_input, (min_x1, min_y1), (max_x2, max_y2), (255, 255, 0), 1
        # )
        # cv2.imshow(window_name1, image_opencv_input)
        # cv2.waitKey(0)
        # cv2.destroyAllWindows()

        # Find the centers of the elements
        # for idx, region in enumerate(fdict[filenamesize]["regions"]):
        for idx, region in enumerate(fdict[fnamesize]["regions"]):
            x1 = int(region["shape_attributes"]["x"])
            y1 = int(region["shape_attributes"]["y"])
            x2 = int(x1 + region["shape_attributes"]["width"])
            y2 = int(y1 + region["shape_attributes"]["height"])

            # Extend shape_attributes with average values for centers
            x_average = int((x1 + x2) / 2)
            y_average = int((y1 + y2) / 2)
            region["shape_attributes"]["x_average"] = x_average
            region["shape_attributes"]["y_average"] = y_average

        # cv2.imshow(window_name1, image_opencv_input)
        # cv2.waitKey(0)

        if region_dataset in {"webpages"}:
            # Calculation of the excluded indices to remove overlapped elements start
            # Second, calculate the non-text blocks overlap
            excluded_elements = []
            # for rect1 in fdict[filenamesize]["regions"]:
            for rect1 in fdict[fnamesize]["regions"]:
                # for rect2 in fdict[filenamesize]["regions"]:
                for rect2 in fdict[fnamesize]["regions"]:
                    is_menu = (rect1["region_attributes"]["HTML element"] == "menu") or (
                        rect2["region_attributes"]["HTML element"] == "menu"
                    )
                    if (rect1 != rect2) and not is_menu:
                        x1 = rect1["shape_attributes"]["x"]
                        y1 = rect1["shape_attributes"]["y"]
                        x2 = (
                            rect1["shape_attributes"]["x"]
                            + rect1["shape_attributes"]["width"]
                        )
                        y2 = (
                            rect1["shape_attributes"]["y"]
                            + rect1["shape_attributes"]["height"]
                        )
                        x3 = rect2["shape_attributes"]["x"]
                        y3 = rect2["shape_attributes"]["y"]
                        x4 = (
                            rect2["shape_attributes"]["x"]
                            + rect2["shape_attributes"]["width"]
                        )
                        y4 = (
                            rect2["shape_attributes"]["y"]
                            + rect2["shape_attributes"]["height"]
                        )

                        # Borders of the rectangles overlapped area
                        left = max(x1, x3)
                        bottom = max(y1, y3)
                        right = min(x2, x4)
                        top = min(y2, y4)
                        # Sizes of the rectangles overlapped area
                        width = right - left
                        height = top - bottom

                        # The first rectangle square
                        width1, height1 = x2 - x1, y2 - y1

                        # The second rectangle square
                        width2, height2 = x4 - x3, y4 - y3

                        # Check if width, height of the overlapped area less or equal 0
                        if not (width <= 0 or height <= 0):
                            # If the square > 0, calculate the squares of the 3 rectangles
                            square = width * height
                            square1 = width1 * height1
                            square2 = width2 * height2
                            #
                            # print(square, square1, square2)
                            # input()

                            if (square > square1 * SQUARES_OVERLAP_THRESHOLD) or (
                                square > square2 * SQUARES_OVERLAP_THRESHOLD
                            ):
                                if square1 < square2:
                                    excluded_elements.append(rect1)
                                else:
                                    excluded_elements.append(rect2)
                            elif square > square1 * SQUARES_OVERLAP_THRESHOLD:
                                excluded_elements.append(rect2)
                            elif square > square2 * SQUARES_OVERLAP_THRESHOLD:
                                excluded_elements.append(rect1)

            # Remove some items using list comprehension
            fdict[fnamesize]["regions"] = [
                ele
                # for ele in fdict[filenamesize]["regions"]
                for ele in fdict[fnamesize]["regions"]
                if ele not in excluded_elements
            ]
            # Calculation of the excluded indices to remove overlapped elements end

        # find all the clusters based on cluster-making elements
        # (inputs, selects, buttons, free text blocks, maybe large images)
        # root_cluster = ClusterClass(min_x1, min_y1, max_x2, max_y2, elements=[])
        clusters = []
        # Run the ternary assembling algorithm
        # print(min_x1, min_y1, max_x2, max_y2)

        # Cluster: x1, y1, x2, y2, elements[], type(input or select), direction start
        #
        #
        # Vertical clusters input-like with text labels detection
        # The first position is input or select, and the second position is text
        # for idx, recognized_element in enumerate(fdict[filenamesize]["regions"]):
        for idx, recognized_element in enumerate(fdict[fnamesize]["regions"]):
            if recognized_element["region_attributes"]["HTML element"] in {
                "input",
                "select",
                "button",
            }:
                # Assign the textContent values after grouping with text
                # Vertical group when input or select element has another text element
                # at the distance 0.5 from its width
                # Horizontal group when input or select or text are placed horizontally

                # Loop through all the elements recognized
                # Find all the close-by elements if one of them input (1) or select (4),
                # and second one is the text (3)
                # Horizontal overlap 75% of the element with minimal width
                # Vertical max +- 50% for input/select width,
                # middle of the text element should be within this interval

                # First rectangle coordinates
                x1 = int(recognized_element["shape_attributes"]["x"])
                y1 = int(recognized_element["shape_attributes"]["y"])
                x2 = int(x1 + recognized_element["shape_attributes"]["width"])
                y2 = int(y1 + recognized_element["shape_attributes"]["height"])

                # First rectangle width
                width_elem = recognized_element["shape_attributes"]["width"]
                height_elem = recognized_element["shape_attributes"]["height"]

                # Add the initial element to the cluster
                cluster = ClusterClass(x1, y1, x2, y2, elements=[recognized_element])
                # Set some flags for this novel cluster
                cluster.types = "fcluster"
                cluster.is_elements_only = True
                for idx1, recognized_element1 in enumerate(fdict[fnamesize]["regions"]):
                    if recognized_element1["region_attributes"]["HTML element"] in {
                        "text", "ocrtext"
                    }:
                        # Check if the elements were not assigned to the clusters before
                        if (
                            (recognized_element1 not in clr.elements)
                            for clr in clusters
                        ):

                            # Second rectangle coordinates
                            x11 = int(recognized_element1["shape_attributes"]["x"])
                            y11 = int(recognized_element1["shape_attributes"]["y"])
                            x21 = int(
                                x11 + recognized_element1["shape_attributes"]["width"]
                            )
                            y21 = int(
                                y11 + recognized_element1["shape_attributes"]["height"]
                            )

                            # Second rectangle width
                            width_elem1 = x21 - x11
                            height_elem1 = y21 - y11

                            # Borders of the overlapped area
                            left = max(x1, x11)
                            bottom = max(y1, y11)
                            right = min(x2, x21)
                            top = min(y2, y21)

                            # Size of the overlapped area
                            horizontal_overlap = right - left
                            vertical_overlap = top - bottom

                            # Check if the vertical distance between roi and roi1 is sufficient
                            # Middle of the input or select element
                            mid_input = (y1 + y2) / 2

                            # Middle of the text element
                            mid_text = (y11 + y21) / 2

                            border_bottom = y1 - (0.6 * height_elem)
                            border_top = y2 + (0.4 * height_elem)

                            # Check if the text and input elements are close to each other by vertical direction
                            if (border_bottom < mid_text < mid_input) or (
                                mid_input < mid_text < border_top
                            ):
                                # Assign the results to the vertical_group
                                # Check if the horizontal overlap between text label and input is sufficient
                                if (
                                    horizontal_overlap
                                    > VERICAL_GROUPS_HORIZONTAL_OVERLAP_THRESHOLD
                                    * width_elem1
                                ):
                                    # Fill the cluster
                                    # cluster = ClusterClass(min(x1, x11), min(y1, y11), max(x2, x21),
                                    # max(y2, y21), elements = [recognized_element, recognized_element1])
                                    # Update the cluster with new text element
                                    cluster.elements.append(recognized_element1)

                                    # Set some flags for this vertical fcluster
                                    # The cluster contains more than one element
                                    cluster.is_solid = False
                                    # The cluster direction is vertical
                                    cluster.direction = 0
                                    cluster.origin_direction = 0

                                    cluster.x1 = min(cluster.x1, x11)
                                    cluster.y1 = min(cluster.y1, y11)
                                    cluster.x2 = max(cluster.x2, x21)
                                    cluster.y2 = max(cluster.y2, y21)

                                    # Find the center of cluster
                                    center_x = (cluster.x1 + cluster.x2) / 2
                                    center_y = (cluster.y1 + cluster.y2) / 2
                                    cluster.center = center_x, center_y

                                    # Update the clusters list
                                    clusters.append(cluster)

                # Display input-based fclusters
                cv2.rectangle(
                    image_fclusters,
                    (cluster.x1, cluster.y1),
                    (cluster.x2, cluster.y2),
                    (0, 0, 255),
                    1,
                )
                # cv2.imshow(window_name1, image_opencv_input)
                # cv2.waitKey(0)

        # Cluster: x1, y1, x2, y2, elements[], type(input or select), direction end

        # Clusters checkboxes with text labels direction start
        #
        #
        # Horizontal clusters checkbox-like with text labels detection
        # The first position is a checkbox or radiobutton or even the small image,
        # and the second position is text
        # for idx, recognized_element in enumerate(fdict[filenamesize]["regions"]):
        for idx, recognized_element in enumerate(fdict[fnamesize]["regions"]):
            if recognized_element["region_attributes"]["HTML element"] in {
                "checkbox",
                "radiobutton",
                "image",
            }:
                # Horizontal group when checkbox or radiobutton element has another text element
                # at the distance 0.8 from its width

                # Loop through all the elements recognized
                # Find all the close-by elements if one of them is a checkbox or radiobutton,
                # and second one is the text (3)
                # Vertical overlap 75% of the element with minimal width
                # Horizontal min/max +- 80% for checkbox/radiobutton width,
                # start/end of the text element should be within this interval

                # First rectangle coordinates
                x1 = int(recognized_element["shape_attributes"]["x"])
                y1 = int(recognized_element["shape_attributes"]["y"])
                x2 = int(x1 + recognized_element["shape_attributes"]["width"])
                y2 = int(y1 + recognized_element["shape_attributes"]["height"])

                # First rectangle width
                width_elem = recognized_element["shape_attributes"]["width"]
                height_elem = recognized_element["shape_attributes"]["height"]

                # Add the initial element to a cluster
                cluster = ClusterClass(x1, y1, x2, y2, elements=[recognized_element])
                # Set some flags for this novel cluster
                cluster.types = "fcluster"
                cluster.is_elements_only = True
                for idx1, recognized_element1 in enumerate(fdict[fnamesize]["regions"]):
                    if recognized_element1["region_attributes"]["HTML element"] in {
                        "text", "ocrtext"
                    }:
                        # Check if the elements were not assigned to the clusters before
                        if (
                            (recognized_element1 not in clr.elements)
                            for clr in clusters
                        ):

                            # Second rectangle coordinates
                            x11 = int(recognized_element1["shape_attributes"]["x"])
                            y11 = int(recognized_element1["shape_attributes"]["y"])
                            x21 = int(
                                x11 + recognized_element1["shape_attributes"]["width"]
                            )
                            y21 = int(
                                y11 + recognized_element1["shape_attributes"]["height"]
                            )

                            # Second rectangle width
                            width_elem1 = x21 - x11
                            height_elem1 = y21 - y11

                            # Borders of the overlapped area
                            left = max(x1, x11)
                            bottom = max(y1, y11)
                            right = min(x2, x21)
                            top = min(y2, y21)

                            # Size of the overlapped area
                            horizontal_overlap = right - left
                            vertical_overlap = top - bottom

                            # Middle of the checkbox or radiobutton element
                            mid_checkbox = (x1 + x2) / 2

                            # Borders of the text element
                            left_text = x11
                            right_text = x21

                            border_left = x1 - (0.6 * height_elem)
                            border_right = x2 + (0.8 * height_elem)

                            # Check if the text and checkbox elements are close to each other
                            # by horizontal direction
                            if (border_left < right_text < mid_checkbox) or (
                                mid_checkbox < left_text < border_right
                            ):
                                # Assign the results to the horizontal group
                                # Check if the vertical overlap between text label and input is sufficient
                                if (vertical_overlap > HORIZONTAL_GROUPS_VERTICAL_OVERLAP_THRESHOLD * height_elem1):
                                    # Fill the cluster
                                    # cluster = ClusterClass(min(x1, x11), min(y1, y11), max(x2, x21),
                                    # max(y2, y21), elements = [recognized_element, recognized_element1])
                                    # Update the cluster with new text element
                                    cluster.elements.append(recognized_element1)

                                    # Set some flags for this horizontal fcluster
                                    # The cluster contains more than one element
                                    cluster.is_solid = False
                                    # The cluster direction is horizontal
                                    cluster.direction = 1
                                    cluster.origin_direction = 1

                                    cluster.x1 = min(cluster.x1, x11)
                                    cluster.y1 = min(cluster.y1, y11)
                                    cluster.x2 = max(cluster.x2, x21)
                                    cluster.y2 = max(cluster.y2, y21)

                                    # Find the center of cluster
                                    center_x = (cluster.x1 + cluster.x2) / 2
                                    center_y = (cluster.y1 + cluster.y2) / 2
                                    cluster.center = center_x, center_y

                                    # Update the clusters list
                                    clusters.append(cluster)

                # Display checkbox-based fclusters
                cv2.rectangle(
                    image_fclusters,
                    (cluster.x1, cluster.y1),
                    (cluster.x2, cluster.y2),
                    (144, 12, 2),
                    1,
                )

        # Printing fclusters to file
        cv2.imwrite("fclusters_" + fname, image_fclusters)

        # Clusters checkboxes with text labels direction end

        # Place all the free elements for the 1-element clusters
        for idx, recognized_element in enumerate(fdict[fnamesize]["regions"]):
            # First rectangle coordinates
            x1 = int(recognized_element["shape_attributes"]["x"])
            y1 = int(recognized_element["shape_attributes"]["y"])
            x2 = int(x1 + recognized_element["shape_attributes"]["width"])
            y2 = int(y1 + recognized_element["shape_attributes"]["height"])

            element_unique = True
            for cluster in clusters:
                if recognized_element in cluster.elements:
                    element_unique = False
            if element_unique is True:
                # Add the element to the cluster
                cluster = ClusterClass(x1, y1, x2, y2, elements=[recognized_element])

                # Set some flags for this novel cluster
                cluster.types = "fcluster"
                cluster.is_elements_only = True
                # The cluster contains only one element
                cluster.is_solid = True
                # The cluster direction is unseparable
                cluster.direction = 2
                cluster.origin_direction = 2

                # Find the center of cluster
                center_x = (cluster.x1 + cluster.x2) / 2
                center_y = (cluster.y1 + cluster.y2) / 2
                cluster.center = center_x, center_y

                # Update the clusters list
                clusters.append(cluster)

        if region_dataset in ["headers", "footers", "webpages"]:
            # Clear the array of dbclusters
            dbclusters = []
            # DBSCAN clustering start
            # #############################################################################
            # Create numpy centers array clusters-based start
            centers_array = []
            for cluster in clusters:
                centers_array.append(cluster.center)

            centers = np.array(centers_array)
            # print("centers=", centers)
            # Create numpy centers array clusters-based end

            # Compute DBSCAN for the artificial dataset with 750 samples with data centers
            X, labels_true = make_blobs(
                n_samples=750, centers=centers, cluster_std=0.4, random_state=0
            )

            # Concatenate centers and X next after the make_blobs function
            centers_closest_nodes = []
            for center in centers:
                # Find the closest element from X
                # Map the array of centers with array X
                centers_closest_nodes.append(closest_node(center, X))

            # Fit transform X
            X = StandardScaler().fit_transform(X)

            if region_dataset in ["footers", "webpages"]:
                db = clustermethod.DBSCAN(eps=0.4).fit(X)
                # print("db=", db, X, db.labels_, len(X), len(db.labels_))
                # input()

            if region_dataset == "headers":
                db = clustermethod.DBSCAN(eps=0.55).fit(X)

            core_samples_mask = np.zeros_like(db.labels_, dtype=bool)
            core_samples_mask[db.core_sample_indices_] = True
            labels = db.labels_

            # Number of dbclusters in labels, ignoring noise if present.
            n_clusters_ = len(set(labels)) - (1 if -1 in labels else 0)

            # DBSCAN.labels are included to fclusters start
            for cluster in clusters:
                center = cluster.center
                # DB clusters
                # cv2.rectangle(
                #     image_opencv_input,
                #     (int(center[0]), int(center[1])),
                #     (int(center[0]) + 10, int(center[1]) + 10),
                #     (0, 0, 255),
                #     1,
                # )

                for center_closest_node in centers_closest_nodes:
                    # Closest node comparison
                    if (center[0] == center_closest_node[1][0]) and (
                        center[1] == center_closest_node[1][1]
                    ):
                        cluster.X = center_closest_node[2]
                        idx = cluster.idx = center_closest_node[0]
                        cluster.label = labels[idx]
            #
            # cv2.imshow(window_name1, image_opencv_input)
            # cv2.waitKey(0)
            # DBSCAN.labels are included to fclusters end

            # Create dbcluster as a class object
            # Assign elements to dbclusters based on centers information
            for n_cluster in range(n_clusters_):
                # Collect all the elements related to some dbcluster to this array
                cluster_sources = []
                dbcluster = ClusterClass(x1=9999, y1=9999, x2=0, y2=0, elements=[])
                # Set some flags to the dbcluster
                dbcluster.types = "dbcluster"
                dbcluster.is_elements_only = False
                dbcluster.processing = (
                    "unsplitted"  # check if the ternary algorithm was applied
                )
                # Check the directiom with some function
                # dbcluster.direction = ?
                # Check is_solid parameter later
                # is_solid = True  # if clusters contain one element only. Based on flusters making algorithm
                # clusters-based solution start
                for cluster in clusters:
                    # Cluster number label
                    label = cluster.label
                    if label == n_cluster:
                        cluster_sources.append(cluster)
                        # Add flusters to dbclusters
                        cluster.parent = dbcluster

                for cluster_source in cluster_sources:
                    # Construct the dbcluster object
                    # Find min max x1 y1 x2 y2
                    # dbcluster.elements.append(cluster_source)
                    dbcluster.x1 = min(dbcluster.x1, cluster_source.x1)
                    dbcluster.y1 = min(dbcluster.y1, cluster_source.y1)
                    dbcluster.x2 = max(dbcluster.x2, cluster_source.x2)
                    dbcluster.y2 = max(dbcluster.y2, cluster_source.y2)
                # clusters-based solution end

                dbclusters.append(dbcluster)

                # Display dbclusters
                cv2.rectangle(
                    image_dbclusters,
                    (dbcluster.x1, dbcluster.y1),
                    (dbcluster.x2, dbcluster.y2),
                    (164, 24, 4),
                    1,
                )

            # Printing dbclusters to file
            cv2.imwrite("dbclusters_" + fname, image_dbclusters)

        try:
            # Replace clusters for dbclusters if possible
            fclusters = copy.copy(clusters)
            clusters = dbclusters
        except Exception:
            pass
        finally:
            pass

        # Ternary assembling algorithm run after the clusters start
        # Define the root block
        root_block = ClusterClass(min_x1, min_y1, max_x2, max_y2)
        root_block.types = "ccluster"

        x_layout_intervals = []
        y_layout_intervals = []
        for cluster in clusters:
            x_average = int((cluster.x1 + cluster.x2) / 2)
            y_average = int((cluster.y1 + cluster.y2) / 2)
            x_layout_intervals.append([cluster.x1, cluster.x2])
            y_layout_intervals.append([cluster.y1, cluster.y2])

        # print(x_layout_intervals)
        ob1_x = Partition()
        ob1_x_merged = ob1_x.merge(x_layout_intervals)
        # print("ob1_x_merged", ob1_x_merged, type(ob1_x_merged), len(ob1_x_merged))
        #
        # print(y_layout_intervals)
        ob1_y = Partition()
        ob1_y_merged = ob1_y.merge(y_layout_intervals)
        # print("ob1_y_merged", ob1_y_merged, type(ob1_y_merged), len(ob1_y_merged))

        # Choose if the block horizontal vertical or final
        # horizontal
        if len(ob1_x_merged) >= len(ob1_y_merged):
            root_block.direction = 0

        # vertiical
        if len(ob1_x_merged) < len(ob1_y_merged):
            root_block.direction = 1

        # horizontal y length 1 case
        if len(ob1_x_merged) >= len(ob1_y_merged) and (len(ob1_y_merged) == 1):
            root_block.direction = 1

        # vertiical x length 1 case
        if len(ob1_x_merged) < len(ob1_y_merged) and (len(ob1_x_merged) == 1):
            root_block.direction = 0

        # final
        if (len(ob1_x_merged) == 1) and (len(ob1_y_merged) == 1):
            root_block.direction = 2

        # Prepare the copy of image as overlay before rectangles calculations
        overlay = image_opencv_input.copy()
        # Assign the children based on direction
        if root_block.direction == 0:
            for interval in ob1_y_merged:
                ccluster = ClusterClass(
                    min_x1, interval[0], max_x2, interval[1], parent=root_block
                )
                ccluster.types = "ccluster"
                # cv2.rectangle(
                #     image_opencv_input,
                #     (min_x1, interval[0]),
                #     (max_x2, interval[1]),
                #     (70, 50, 135),
                #     -1,
                # )

        if root_block.direction == 1:
            for interval in ob1_x_merged:
                ccluster = ClusterClass(
                    interval[0], min_y1, interval[1], max_y2, parent=root_block
                )
                ccluster.types = "ccluster"
                # cv2.rectangle(
                #     image_opencv_input,
                #     (interval[0], min_y1),
                #     (interval[1], max_y2),
                #     (20, 50, 107),
                #     -1,
                # )

        if root_block.direction == 2:
            for interval_x in ob1_x_merged:
                for interval_y in ob1_y_merged:
                    ccluster = ClusterClass(
                        interval_x[0],
                        interval_y[0],
                        interval_x[1],
                        interval_y[1],
                        parent=root_block,
                    )
                    ccluster.types = "ccluster"

        # Go through all the blocks obtained
        for pre, fill, node in RenderTree(root_block):
            if node != root_block:
                # print(node.name)
                # Split each block
                blocks_split(node, window_name1, image_opencv_input, overlay, clusters)

        # Go through all the blocks obtained after the ternary algorithm
        # Correct the direction of the fclusters
        for pre, fill, node in RenderTree(root_block):
            if node.types == "fcluster":
                if len(node.elements) > 1:
                    node.direction = node.origin_direction

        # Go through all the blocks obtained after the ternary algorithm
        # Correct the dbclusters splitting
        # This part of code should split complex dbclusters and re-arrange their child nodes to descendants
        for pre, fill, node in RenderTree(root_block):
            if node.types == "dbcluster":
                if len(node.children) > 1:
                    dbcluster_split(node, fclusters)

        # Ternary assembling algorithm run after the clusters end

        # Go through all the blocks obtained after the ternary algorithm
        # Print all the cclusters
        for pre, fill, node in RenderTree(root_block):
            if node.types == "ccluster":
                cv2.rectangle(
                    image_cclusters,
                    (node.x1, node.y1),
                    (node.x2, node.y2),
                    (20, 50, 107),
                    1,
                )
        # Printing cclusters to file
        cv2.imwrite("cclusters_" + fname, image_cclusters)

        # Go through all the blocks obtained after the ternary algorithm
        # Print all the clusters
        for pre, fill, node in RenderTree(root_block):
            if node.types == "ccluster":
                cv2.rectangle(
                    image_allclusters,
                    (node.x1, node.y1),
                    (node.x2, node.y2),
                    (20, 50, 107),
                    1,
                )

            if node.types == "dbcluster":
                cv2.rectangle(
                    image_allclusters,
                    (node.x1, node.y1),
                    (node.x2, node.y2),
                    (164, 24, 4),
                    1,
                )

            if node.types == "fcluster":
                cv2.rectangle(
                    image_allclusters,
                    (node.x1, node.y1),
                    (node.x2, node.y2),
                    (0, 0, 255),
                    1,
                )

        # Printing all clusters to file
        cv2.imwrite("allclusters_" + fname, image_allclusters)

        # Go through all the blocks obtained after the ternary algorithm
        # Print all the clusters with elements
        for pre, fill, node in RenderTree(root_block):
            if node.types == "ccluster":
                cv2.rectangle(
                    image_allcluelems,
                    (node.x1, node.y1),
                    (node.x2, node.y2),
                    (20, 50, 107),
                    1,
                )

            if node.types == "dbcluster":
                cv2.rectangle(
                    image_allcluelems,
                    (node.x1, node.y1),
                    (node.x2, node.y2),
                    (164, 24, 4),
                    1,
                )

            if node.types == "fcluster":
                cv2.rectangle(
                    image_allcluelems,
                    (node.x1, node.y1),
                    (node.x2, node.y2),
                    (0, 0, 255),
                    1,
                )

            if node.elements:
                for elem in node.elements:
                    # Define the element dimensions start
                    elem_width = int(elem["shape_attributes"]["width"])
                    elem_height = int(elem["shape_attributes"]["height"])

                    x1 = int(elem["shape_attributes"]["x"])
                    y1 = int(elem["shape_attributes"]["y"])
                    # Define the element dimensions end
                    cv2.rectangle(image_allcluelems, (x1, y1), (x1 + elem_width, y1 + elem_height), (255, 0, 255), 1)

                    label_element = str(elem["region_attributes"]["HTML element"])

                    # Put the class id as a label. Keep in mind, that this label will be different for the specific block types
                    cv2.putText(image_allcluelems, label_element, (x1, y1 + elem_height), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                                (36, 255, 12), 2)

        # Printing all clusters with elements to file
        cv2.imwrite("allclusters_with_elements_" + fname, image_allcluelems)

        # Printing containerization results and all clusters results

        root = ET.Element("html", version="5.0")
        # Передайте родительский узел, имя дочернего узла,
        # и любое количество дополнительных атрибутов
        html_head = ET.SubElement(root, "head")
        html_title = ET.SubElement(root, "title")
        html_title.text = "Title, " + fname
        html_body = ET.SubElement(root, "body")

        # Define the outer container parameters
        outer_div = ET.SubElement(html_body, "div")
        styles = {}
        parameters = {}
        styles["background-color"] = "rgba(" + bcolour_container_value + ")"
        styles["height"] = str(img_height) + "px"
        styles["width"] = str(img_width) + "px"
        str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
        outer_div.set("style", str_styles)
        # print(1694, styles, str_styles)
        # Define the export node
        outer_div_node = ScenarioElement.objects.create(
            parent=serializer_node, struct_type="container", parameters=parameters, styles=styles, buoyancy=0
        )

        for pre, fill, node in RenderTree(root_block):
            # if(node.elements):
            #     print("elements: ", len(node.elements))
            #     input()
            styles = {}
            parameters = {}

            # Define the node dimensions start
            node_width = int(node.x2 - node.x1)
            node_height = int(node.y2 - node.y1)
            # Define the node dimensions end

            # Define the direction of the container start
            # Horizontal
            if node.direction == 1:
                styles["display"] = "flex"
                styles["background"] = "aliceblue"
                if region_dataset in ["headers", "footers"]:
                    styles["justify-content"] = "space-between"
            # Vertical
            if node.direction == 0:
                styles["display"] = "block"
                styles["background"] = "lavenderblush"
            if node.direction == 2:
                if (node.types == "ccluster") or (
                    region_dataset in ["headers", "webpages"]
                ):
                    styles["display"] = "flex"
                    styles["background"] = "lightblue"
                else:
                    styles["display"] = "flex"
                    styles["background"] = "lightblue"
                    # Sometimes node_width and height are 0, should check this.
                    if node_width:
                        styles["width"] = str(node_width) + "px"
                    if node_height:
                        styles["height"] = str(node_height) + "px"
            # Define the direction of the container end

            if node == root_block:
                margin_lr = int((img_width - node_width) / 2)
                margin_tp = int((img_height - node_height) / 2)
                node.div = ET.SubElement(outer_div, "div")
                styles["border"] = "1px solid green"
                styles["margin"] = str(margin_tp) + "px " + str(margin_lr) + "px"

                str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
                node.div.set("style", str_styles)

                # Create a new Scenario Element for the elements chain
                node.scenarioelement = ScenarioElement.objects.create(
                    parent=outer_div_node, struct_type="container", parameters=parameters, styles=styles, buoyancy=0
                )
            else:
                node.div = ET.SubElement(node.parent.div, "div")

                styles["border"] = "1px solid green"

                str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
                node.div.set("style", str_styles)

                # Buoyancy detection start
                # Vertical
                if(node.parent.direction == 1):
                    buoyancy = int(node.y1)
                # Horizontal
                if(node.parent.direction == 0):
                    buoyancy = int(node.x1)
                # Buoyancy detection end

                # Create a new Scenario Element for the elements chain
                node.scenarioelement = ScenarioElement.objects.create(
                    parent=node.parent.scenarioelement,
                    struct_type="container",
                    parameters=parameters, styles=styles, buoyancy=buoyancy
                )

            # Display elements for some fcluster
            if node.types == "fcluster":
                # Arrange the fcluster children based on their coordinates
                if node.direction == 0:
                    array_elements = sorted(
                        node.elements, key=lambda i: i["shape_attributes"]["y"]
                    )
                elif node.direction == 1:
                    array_elements = sorted(
                        node.elements, key=lambda i: i["shape_attributes"]["x"]
                    )
                else:
                    array_elements = node.elements
                for elem in array_elements:
                    # Define the element dimensions start
                    elem_width = int(elem["shape_attributes"]["width"])
                    elem_height = int(elem["shape_attributes"]["height"])

                    x1 = int(elem["shape_attributes"]["x"])
                    y1 = int(elem["shape_attributes"]["y"])
                    # Define the element dimensions end

                    # Cropping to the border box start
                    elem_image = image_original[
                        y1 : y1 + elem_height, x1 : x1 + elem_width
                    ]
                    elem_image_name = uuid.uuid4().hex + fname
                    # print(x1, y1)
                    # input()
                    # Cropping to the border box end

                    styles = {}
                    parameters = {}

                    if styles_on:
                        # Get the dominant colour for the element start
                        bcolour_elem_value = "255,255,255,0"
                        domcolour_elem = get_dominant_colour(elem_image)
                        domcolour_elem.append(1)
                        bcolour_elem_value = ",".join(str(int(x)) for x in domcolour_elem)
                        # Get the dominant colour for the element end

                        # display elem_image start
                        '''
                        cv2.imshow(window_name2, elem_image)
                        print(bcolour_elem_value)
                        cv2.waitKey(0)
                        '''
                        # display elem_image end

                    if elem["region_attributes"]["HTML element"] in {
                        "textinput",
                        "input",
                    }:
                        styles["width"] = str(node_width) + "px"
                        styles["height"] = str(node_height) + "px"
                        styles["padding"] = "3px 0"

                        # displaying various kinds of elements start
                        element = ET.SubElement(node.div, "input")
                        # displaying various kinds of elements end

                        str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
                        element.set("style", str_styles)

                        # Create a new Scenario Element for the elements chain
                        node.scenarioelement = ScenarioElement.objects.create(
                            parent=node.parent.scenarioelement,
                            struct_type="textinput",
                            parameters=parameters, styles=styles, buoyancy=0
                        )

                    elif elem["region_attributes"]["HTML element"] in {"checkbox"}:
                        # displaying various kinds of elements start
                        element = ET.SubElement(node.div, "input")
                        # displaying various kinds of elements end
                        element.set("type", "checkbox")

                        str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
                        element.set("style", str_styles)

                        # Create a new Scenario Element for the elements chain
                        node.scenarioelement = ScenarioElement.objects.create(
                            parent=node.parent.scenarioelement,
                            struct_type="checkbox",
                            parameters=parameters, styles=styles, buoyancy=0
                        )

                    elif elem["region_attributes"]["HTML element"] in {"radiobutton"}:
                        # displaying various kinds of elements start
                        element = ET.SubElement(node.div, "input")
                        # displaying various kinds of elements end
                        element.set("type", "radio")

                        str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
                        element.set("style", str_styles)

                        # Create a new Scenario Element for the elements chain
                        node.scenarioelement = ScenarioElement.objects.create(
                            parent=node.parent.scenarioelement,
                            struct_type="radiobutton",
                            parameters=parameters, styles=styles, buoyancy=0
                        )

                    elif elem["region_attributes"]["HTML element"] == "select":
                        styles["width"] = str(node_width) + "px"
                        styles["height"] = str(node_height) + "px"

                        # displaying various kinds of elements start
                        element = ET.SubElement(node.div, "select")
                        # displaying various kinds of elements end

                        str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
                        element.set("style", str_styles)

                        # Create a new Scenario Element for the elements chain
                        node.scenarioelement = ScenarioElement.objects.create(
                            parent=node.parent.scenarioelement,
                            struct_type="select",
                            parameters=parameters, styles=styles, buoyancy=0
                        )

                    if elem["region_attributes"]["HTML element"] in {"text", "ocrtext"}:
                        # displaying various kinds of elements start
                        element = ET.SubElement(node.div, "div")
                        # displaying various kinds of elements end

                        element.text = lorem.get_word(count=2)

                        parameters["textContent"] = element.text

                        str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
                        element.set("style", str_styles)

                        # Create a new Scenario Element for the elements chain
                        node.scenarioelement = ScenarioElement.objects.create(
                            parent=node.parent.scenarioelement,
                            struct_type="ocrtext",
                            parameters=parameters, styles=styles, buoyancy=0
                        )

                    elif elem["region_attributes"]["HTML element"] in {"textarea"}:
                        # displaying various kinds of elements start
                        element = ET.SubElement(node.div, "textarea")
                        # displaying various kinds of elements end

                        element.set("placeholder", lorem.get_word(count=2))

                        str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
                        element.set("style", str_styles)

                        # Create a new Scenario Element for the elements chain
                        node.scenarioelement = ScenarioElement.objects.create(
                            parent=node.parent.scenarioelement,
                            struct_type="textarea",
                            parameters=parameters, styles=styles, buoyancy=0
                        )

                    elif elem["region_attributes"]["HTML element"] in {"form_heading"}:
                        # displaying various kinds of elements start
                        element = ET.SubElement(node.div, "h3")
                        # displaying various kinds of elements end

                        element.text = lorem.get_word(count=2)

                        parameters["textContent"] = element.text

                        str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
                        element.set("style", str_styles)

                        # Create a new Scenario Element for the elements chain
                        node.scenarioelement = ScenarioElement.objects.create(
                            parent=node.parent.scenarioelement,
                            struct_type="heading",
                            parameters=parameters, styles=styles, buoyancy=0
                        )

                    elif elem["region_attributes"]["HTML element"] in {"form"}:
                        # displaying various kinds of elements start
                        element = ET.SubElement(node.div, "form")
                        # displaying various kinds of elements end

                        str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
                        element.set("style", str_styles)

                        # Create a new Scenario Element for the elements chain
                        node.scenarioelement = ScenarioElement.objects.create(
                            parent=node.parent.scenarioelement,
                            struct_type="container",
                            parameters=parameters, styles=styles, buoyancy=0
                        )

                    elif elem["region_attributes"]["HTML element"] == "image":
                        styles["max-width"] = "100%"
                        styles["height"] = "auto"

                        # Saving an image
                        cv2.imwrite(elem_image_name, elem_image)

                        # displaying various kinds of elements start
                        element = ET.SubElement(node.div, "img")
                        # displaying various kinds of elements end

                        element.set("src", elem_image_name)

                        str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
                        element.set("style", str_styles)

                        # Create a new Scenario Element for the elements chain
                        node.scenarioelement = ScenarioElement.objects.create(
                            parent=node.parent.scenarioelement,
                            struct_type="image",
                            parameters=parameters, styles=styles, buoyancy=0
                        )

                    elif elem["region_attributes"]["HTML element"] == "button":
                        styles["height"] = str(node_height) + "px"

                        # displaying various kinds of elements start
                        element = ET.SubElement(node.div, "button")
                        # displaying various kinds of elements end

                        element.text = lorem.get_word(count=1)

                        parameters["textContent"] = element.text

                        if styles_on:
                            # Set the background colour for styles
                            styles["background-color"] = "rgba(" + bcolour_elem_value + ")"

                        str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
                        element.set("style", str_styles)

                        # Create a new Scenario Element for the elements chain
                        node.scenarioelement = ScenarioElement.objects.create(
                            parent=node.parent.scenarioelement,
                            struct_type="button",
                            parameters=parameters, styles=styles, buoyancy=0
                        )

                    elif elem["region_attributes"]["HTML element"] in {"menu"}:
                        # displaying various kinds of elements start
                        element = ET.SubElement(node.div, "ul")
                        # displaying various kinds of elements end
                        str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
                        element.set("style", str_styles)

                        # Create a new Scenario Element for the elements chain
                        node.scenarioelement = ScenarioElement.objects.create(
                            parent=node.parent.scenarioelement,
                            struct_type="list",
                            parameters=parameters, styles=styles, buoyancy=0
                        )

                    elif elem["region_attributes"]["HTML element"] in {"li"}:
                        # displaying various kinds of elements start
                        element = ET.SubElement(node.div, "li")
                        # displaying various kinds of elements end

                        element.text = lorem.get_word(count=1)

                        parameters["textContent"] = element.text

                        str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
                        element.set("style", str_styles)

                        # Create a new Scenario Element for the elements chain
                        node.scenarioelement = ScenarioElement.objects.create(
                            parent=node.parent.scenarioelement,
                            struct_type="listItem",
                            parameters=parameters, styles=styles, buoyancy=0
                        )

            # Generating HTML for printing
            html = ET.tostring(root, short_empty_elements=False).decode("utf-8")
            # print("html=", html)

            # Print html code
            with open(fname + ".html", "w") as html_file:
                print(html, file=html_file)

            # Print tree to file
            with open(VIA_ANNOTATION_ASSEMBLING_FILE + fname + ".txt", "w") as tree_file:
                for pre, fill, node in RenderTree(root_block):
                    treestr = u"%s%s" % (pre, node.name)
                    print(
                        treestr.ljust(8),
                        node.x1,
                        node.y1,
                        node.x2,
                        node.y2,
                        "direction:",
                        node.direction,
                        node.types,
                        "num_elements:",
                        len(node.elements),
                        "num_children:",
                        len(node.children),
                        "processing:",
                        node.processing,
                        file=tree_file,
                    )

        # Archive all the files for a zip directory
        shutil.make_archive(SAVE_DIR, 'zip', SAVE_DIR)
        zip_archive_name = fname + '.zip'

        # serializer_node.parameters["html"] = html
        serializer_node.parameters["archive"] = MEDIA_URL + zip_archive_name

        return serializer_node


class ScenarioElementAssemblingSerializer(serializers.ModelSerializer):
    parameters = serializers.JSONField()
    styles = serializers.JSONField()
    children = RecursiveField(required=False, allow_null=True, many=True)
    container = serializers.PrimaryKeyRelatedField(source="node.id", read_only=True)
    parent_id = serializers.IntegerField()

    class Meta:
        model = ScenarioElement
        fields = (
            "id",
            "container",
            "name",
            "children",
            "parent_id",
            "struct_type",
            "func_type",
            "direction",
            "buoyancy",
            "image",
            "parameters",
            "styles",
        )

        extra_kwargs = {
            "struct_type": {"read_only": True},
            "func_type": {"read_only": True},
        }

    def create(self, validated_data):
        root_element_data = {
            "struct_type": "container",
            "func_type": "undefined",
            "parameters": {},
            "styles": {},
        }

        # Pre-Root element assignment
        element_root_pre = ScenarioElement.objects.get(id=validated_data["parent_id"])

        # Extract an appropriate flag value to recognize block as header, footer, form or layout
        # Region dataset has some starting value
        region_dataset = "webpages"
        if validated_data.get("parameters"):
            region_dataset = validated_data["parameters"]["block_type"]

        # Create the root element mptt start
        # print(validated_data)
        # input()
        # print(root_element_data)
        fname = ""
        imgpath = ""
        if validated_data.get("image"):
            serializer_node = ScenarioElement.objects.create(
                parent=element_root_pre,
                image=validated_data["image"],
                **root_element_data
            )
            fname = str(validated_data["image"])
            imgpath = MEDIA_ROOT + "/uploads/" + fname
        else:
            serializer_node = ScenarioElement.objects.create(
                parent=element_root_pre, **root_element_data
            )
        # Create the root element mptt end

        # Create the opencv recognition start
        image_dict = {}
        result_regions = {}

        text = False
        watch = True

        # Read an image with OpenCV start
        image_opencv_input = cv2.imread(imgpath)
        image_original = copy.deepcopy(image_opencv_input)
        # detect height and width of the image
        img_height, img_width, img_channels = image_opencv_input.shape
        # print("width:  ", img_width)
        # print("height: ", img_height)
        # print("channel:", img_channels)
        # Read an image with OpenCV end

        # Detect the font-size with tesseract for the whole image start
        whole_img = cv2.cvtColor(image_opencv_input, cv2.COLOR_BGR2GRAY)
        result = pytesseract.image_to_boxes(whole_img)
        lines = result.strip().split("\n")
        font_size = []

        for line in lines:
            chars = line.split(" ")
            try:
                font_size.append(float(chars[4]) - float(chars[2]))
            except Exception:
                font_size.append(12.0)  # Default font-size value is 12px
        font_size_img = int(median(font_size) * 1.7)  # Font-size value of the image
        # Detect the font-size with tesseract for the whole image end

        # Get(take the whole image) the dominant colour for the parent container
        bcolour_container_value = "255,255,255,0"
        domcolour_container = get_dominant_colour(image_opencv_input)
        domcolour_container.append(1)
        bcolour_container_value = ",".join(str(int(x)) for x in domcolour_container)

        # Detect text contours and rectangles on image start
        text_contours = []
        rect_contours = []
        # Detect text regions
        text_contours = run_text_detection(image_opencv_input, text=False)

        # text_contours1 = run_text_detection(image_opencv_input, text=True)
        #
        # print(text_contours1)
        # print("length", len(text_contours), len(text_contours1))
        #
        # input()
        # Detect rect regions
        rect_contours = get_rect_contours(image_opencv_input)

        for text_contour in text_contours:
            # Remove untypically wide text blocks
            width2 = text_contour[3]
            if width2 > (font_size_img * 3):
                text_contours.remove(text_contour)

        for rect_contour in rect_contours:
            # Remove untypically large rect blocks
            width2 = rect_contour[2]
            height2 = rect_contour[3]
            if (width2 * height2) > (img_height * img_width) * 0.75:
                rect_contours.remove(rect_contour)

        # Save all detected regions into dictionary
        result = {"text": text_contours, "rect": rect_contours}
        # Detect text contours and rectangles on image end

        window_name1 = "image_opencv_text"

        # Create the opencv recognition end

        #
        #
        # Here is the divergency point between images and footers

        # Create the recognized_elements array start
        if imgpath:
            img = load_img(imgpath)
            img = img_to_array(img)

            fsize = str(os.path.getsize(imgpath))
            fnamesize = fname + fsize

            # fdict[fnamesize] = {
            #     "filename": fname,
            #     "size": fsize,
            #     "regions": [],
            #     "file_attributes": {},
            # }

        # Read the region annotation from parameters
        fdict = None
        if validated_data.get("parameters"):
            try:
                fdict = validated_data["parameters"]["annotation"]
            except Exception:
                pass

        if fdict:
            # Assembling start
            # for filenamesize in fdict:
            # os.chdir(VIA_ANNOTATION_DIR)
            # print("Current Working Directory ", os.getcwd())

            # detect the size of the whole image
            # fsize = os.path.getsize(fname)

            # Show text contours on image start
            window_name1 = "image_opencv_text"

            for idx, region in enumerate(fdict[fnamesize]["regions"]):
                x1 = int(region["shape_attributes"]["x"])
                y1 = int(region["shape_attributes"]["y"])
                x2 = int(x1 + region["shape_attributes"]["width"])
                y2 = int(y1 + region["shape_attributes"]["height"])

            #     cv2.rectangle(image_opencv_input, (x1, y1), (x2, y2), (255, 0, 0), 1)
            # cv2.imshow(window_name1, image_opencv_input)
            # cv2.waitKey(0)
            # cv2.destroyAllWindows()

            # Detect the size of the visible elements region
            # detect the size of the visible elements
            # first do this based on annotated regions
            # go through all the regions
            # find xmin, xmax, ymin, ymax
            # compare this rectangle of visible elements with whole image
            # crop if the distance is more than 20px
            # extend borders if the distance is less than 20px
            min_x1 = img_width
            min_y1 = img_height
            max_x2 = 0
            max_y2 = 0
            # for idx, region in enumerate(fdict[filenamesize]["regions"]):
            for idx, region in enumerate(fdict[fnamesize]["regions"]):
                x1 = int(region["shape_attributes"]["x"])
                y1 = int(region["shape_attributes"]["y"])
                x2 = int(x1 + region["shape_attributes"]["width"])
                y2 = int(y1 + region["shape_attributes"]["height"])

                if min_x1 > x1:
                    min_x1 = x1

                if min_y1 > y1:
                    min_y1 = y1

                if max_x2 < x2:
                    max_x2 = x2

                if max_y2 < y2:
                    max_y2 = y2

            # cv2.rectangle(
            #     image_opencv_input, (min_x1, min_y1), (max_x2, max_y2), (255, 255, 0), 1
            # )
            # cv2.imshow(window_name1, image_opencv_input)
            # cv2.waitKey(0)
            # cv2.destroyAllWindows()

            # Find the centers of the elements
            # for idx, region in enumerate(fdict[filenamesize]["regions"]):
            for idx, region in enumerate(fdict[fnamesize]["regions"]):
                x1 = int(region["shape_attributes"]["x"])
                y1 = int(region["shape_attributes"]["y"])
                x2 = int(x1 + region["shape_attributes"]["width"])
                y2 = int(y1 + region["shape_attributes"]["height"])

                # Extend shape_attributes with average values for centers
                x_average = int((x1 + x2) / 2)
                y_average = int((y1 + y2) / 2)
                region["shape_attributes"]["x_average"] = x_average
                region["shape_attributes"]["y_average"] = y_average

            # cv2.imshow(window_name1, image_opencv_input)
            # cv2.waitKey(0)

            # Calculation of the excluded indices to remove overlapped elements start
            # Second, calculate the non-text blocks overlap
            excluded_elements = []
            # for rect1 in fdict[filenamesize]["regions"]:
            for rect1 in fdict[fnamesize]["regions"]:
                # for rect2 in fdict[filenamesize]["regions"]:
                for rect2 in fdict[fnamesize]["regions"]:
                    is_menu = (rect1["region_attributes"]["HTML element"] == "menu") or (
                        rect2["region_attributes"]["HTML element"] == "menu"
                    )
                    if (rect1 != rect2) and not is_menu:
                        x1 = rect1["shape_attributes"]["x"]
                        y1 = rect1["shape_attributes"]["y"]
                        x2 = (
                            rect1["shape_attributes"]["x"]
                            + rect1["shape_attributes"]["width"]
                        )
                        y2 = (
                            rect1["shape_attributes"]["y"]
                            + rect1["shape_attributes"]["height"]
                        )
                        x3 = rect2["shape_attributes"]["x"]
                        y3 = rect2["shape_attributes"]["y"]
                        x4 = (
                            rect2["shape_attributes"]["x"]
                            + rect2["shape_attributes"]["width"]
                        )
                        y4 = (
                            rect2["shape_attributes"]["y"]
                            + rect2["shape_attributes"]["height"]
                        )

                        # Borders of the rectangles overlapped area
                        left = max(x1, x3)
                        bottom = max(y1, y3)
                        right = min(x2, x4)
                        top = min(y2, y4)
                        # Sizes of the rectangles overlapped area
                        width = right - left
                        height = top - bottom

                        # The first rectangle square
                        width1, height1 = x2 - x1, y2 - y1

                        # The second rectangle square
                        width2, height2 = x4 - x3, y4 - y3

                        # Check if width, height of the overlapped area less or equal 0
                        if not (width <= 0 or height <= 0):
                            # If the square > 0, calculate the squares of the 3 rectangles
                            square = width * height
                            square1 = width1 * height1
                            square2 = width2 * height2
                            #
                            # print(square, square1, square2)
                            # input()

                            if (square > square1 * SQUARES_OVERLAP_THRESHOLD) or (
                                square > square2 * SQUARES_OVERLAP_THRESHOLD
                            ):
                                if square1 < square2:
                                    excluded_elements.append(rect1)
                                else:
                                    excluded_elements.append(rect2)
                            elif square > square1 * SQUARES_OVERLAP_THRESHOLD:
                                excluded_elements.append(rect2)
                            elif square > square2 * SQUARES_OVERLAP_THRESHOLD:
                                excluded_elements.append(rect1)

            # Remove some items using list comprehension
            # fdict[filenamesize]["regions"] = [
            fdict[fnamesize]["regions"] = [
                ele
                # for ele in fdict[filenamesize]["regions"]
                for ele in fdict[fnamesize]["regions"]
                if ele not in excluded_elements
            ]
            # Calculation of the excluded indices to remove overlapped elements end

            # find all the clusters based on cluster-making elements
            # (inputs, selects, buttons, free text blocks, maybe large images)
            # root_cluster = ClusterClass(min_x1, min_y1, max_x2, max_y2, elements=[])
            clusters = []
            # Run the ternary assembling algorithm
            # print(min_x1, min_y1, max_x2, max_y2)

            # Cluster: x1, y1, x2, y2, elements[], type(input or select), direction start
            #
            #
            # Vertical clusters input-like with text labels detection
            # The first position is input or select, and the second position is text
            # for idx, recognized_element in enumerate(fdict[filenamesize]["regions"]):
            for idx, recognized_element in enumerate(fdict[fnamesize]["regions"]):
                if recognized_element["region_attributes"]["HTML element"] in {
                    "input",
                    "select",
                    "button",
                }:
                    # Assign the textContent values after grouping with text
                    # Vertical group when input or select element has another text element
                    # at the distance 0.5 from its width
                    # Horizontal group when input or select or text are placed horizontally

                    # Loop through all the elements recognized
                    # Find all the close-by elements if one of them input (1) or select (4),
                    # and second one is the text (3)
                    # Horizontal overlap 75% of the element with minimal width
                    # Vertical max +- 50% for input/select width,
                    # middle of the text element should be within this interval

                    # First rectangle coordinates
                    x1 = int(recognized_element["shape_attributes"]["x"])
                    y1 = int(recognized_element["shape_attributes"]["y"])
                    x2 = int(x1 + recognized_element["shape_attributes"]["width"])
                    y2 = int(y1 + recognized_element["shape_attributes"]["height"])

                    # First rectangle width
                    width_elem = recognized_element["shape_attributes"]["width"]
                    height_elem = recognized_element["shape_attributes"]["height"]

                    # Add the initial element to the cluster
                    cluster = ClusterClass(x1, y1, x2, y2, elements=[recognized_element])
                    # Set some flags for this novel cluster
                    cluster.types = "fcluster"
                    cluster.is_elements_only = True
                    for idx1, recognized_element1 in enumerate(fdict[fnamesize]["regions"]):
                        if recognized_element1["region_attributes"]["HTML element"] in {
                            "text"
                        }:
                            # Check if the elements were not assigned to the clusters before
                            if (
                                (recognized_element1 not in clr.elements)
                                for clr in clusters
                            ):

                                # Second rectangle coordinates
                                x11 = int(recognized_element1["shape_attributes"]["x"])
                                y11 = int(recognized_element1["shape_attributes"]["y"])
                                x21 = int(
                                    x11 + recognized_element1["shape_attributes"]["width"]
                                )
                                y21 = int(
                                    y11 + recognized_element1["shape_attributes"]["height"]
                                )

                                # Second rectangle width
                                width_elem1 = x21 - x11
                                height_elem1 = y21 - y11

                                # Borders of the overlapped area
                                left = max(x1, x11)
                                bottom = max(y1, y11)
                                right = min(x2, x21)
                                top = min(y2, y21)

                                # Size of the overlapped area
                                horizontal_overlap = right - left
                                vertical_overlap = top - bottom

                                # Check if the vertical distance between roi and roi1 is sufficient
                                # Middle of the input or select element
                                mid_input = (y1 + y2) / 2

                                # Middle of the text element
                                mid_text = (y11 + y21) / 2

                                border_bottom = y1 - (0.6 * height_elem)
                                border_top = y2 + (0.4 * height_elem)

                                # Check if the text and input elements are close to each other by vertical direction
                                if (border_bottom < mid_text < mid_input) or (
                                    mid_input < mid_text < border_top
                                ):
                                    # Assign the results to the vertical_group
                                    # Check if the horizontal overlap between text label and input is sufficient
                                    if (
                                        horizontal_overlap
                                        > VERICAL_GROUPS_HORIZONTAL_OVERLAP_THRESHOLD
                                        * width_elem1
                                    ):
                                        # Fill the cluster
                                        # cluster = ClusterClass(min(x1, x11), min(y1, y11), max(x2, x21),
                                        # max(y2, y21), elements = [recognized_element, recognized_element1])
                                        # Update the cluster with new text element
                                        cluster.elements.append(recognized_element1)

                                        # Set some flags for this vertical fcluster
                                        # The cluster contains more than one element
                                        cluster.is_solid = False
                                        # The cluster direction is vertical
                                        cluster.direction = 0
                                        cluster.origin_direction = 0

                                        cluster.x1 = min(cluster.x1, x11)
                                        cluster.y1 = min(cluster.y1, y11)
                                        cluster.x2 = max(cluster.x2, x21)
                                        cluster.y2 = max(cluster.y2, y21)

                                        # Find the center of cluster
                                        center_x = (cluster.x1 + cluster.x2) / 2
                                        center_y = (cluster.y1 + cluster.y2) / 2
                                        cluster.center = center_x, center_y

                                        # Update the clusters list
                                        clusters.append(cluster)

                    # cv2.rectangle(
                    #     image_opencv_input,
                    #     (cluster.x1, cluster.y1),
                    #     (cluster.x2, cluster.y2),
                    #     (0, 0, 255),
                    #     1,
                    # )
                    # cv2.imshow(window_name1, image_opencv_input)
                    # cv2.waitKey(0)

            # Cluster: x1, y1, x2, y2, elements[], type(input or select), direction end

            # Clusters checkboxes with text labels direction start
            #
            #
            # Horizontal clusters checkbox-like with text labels detection
            # The first position is a checkbox or radiobutton or even the small image,
            # and the second position is text
            # for idx, recognized_element in enumerate(fdict[filenamesize]["regions"]):
            for idx, recognized_element in enumerate(fdict[fnamesize]["regions"]):
                if recognized_element["region_attributes"]["HTML element"] in {
                    "checkbox",
                    "radiobutton",
                    "image",
                }:
                    # Horizontal group when checkbox or radiobutton element has another text element
                    # at the distance 0.8 from its width

                    # Loop through all the elements recognized
                    # Find all the close-by elements if one of them is a checkbox or radiobutton,
                    # and second one is the text (3)
                    # Vertical overlap 75% of the element with minimal width
                    # Horizontal min/max +- 80% for checkbox/radiobutton width,
                    # start/end of the text element should be within this interval

                    # First rectangle coordinates
                    x1 = int(recognized_element["shape_attributes"]["x"])
                    y1 = int(recognized_element["shape_attributes"]["y"])
                    x2 = int(x1 + recognized_element["shape_attributes"]["width"])
                    y2 = int(y1 + recognized_element["shape_attributes"]["height"])

                    # First rectangle width
                    width_elem = recognized_element["shape_attributes"]["width"]
                    height_elem = recognized_element["shape_attributes"]["height"]

                    # Add the initial element to the cluster
                    cluster = ClusterClass(x1, y1, x2, y2, elements=[recognized_element])
                    # Set some flags for this novel cluster
                    cluster.types = "fcluster"
                    cluster.is_elements_only = True
                    for idx1, recognized_element1 in enumerate(fdict[fnamesize]["regions"]):
                        if recognized_element1["region_attributes"]["HTML element"] in {
                            "text"
                        }:
                            # Check if the elements were not assigned to the clusters before
                            if (
                                (recognized_element1 not in clr.elements)
                                for clr in clusters
                            ):

                                # Second rectangle coordinates
                                x11 = int(recognized_element1["shape_attributes"]["x"])
                                y11 = int(recognized_element1["shape_attributes"]["y"])
                                x21 = int(
                                    x11 + recognized_element1["shape_attributes"]["width"]
                                )
                                y21 = int(
                                    y11 + recognized_element1["shape_attributes"]["height"]
                                )

                                # Second rectangle width
                                width_elem1 = x21 - x11
                                height_elem1 = y21 - y11

                                # Borders of the overlapped area
                                left = max(x1, x11)
                                bottom = max(y1, y11)
                                right = min(x2, x21)
                                top = min(y2, y21)

                                # Size of the overlapped area
                                horizontal_overlap = right - left
                                vertical_overlap = top - bottom

                                # Middle of the checkbox or radiobutton element
                                mid_checkbox = (x1 + x2) / 2

                                # Borders of the text element
                                left_text = x11
                                right_text = x21

                                border_left = x1 - (0.6 * height_elem)
                                border_right = x2 + (0.8 * height_elem)

                                # Check if the text and checkbox elements are close to each other
                                # by horizontal direction
                                if (border_left < right_text < mid_checkbox) or (
                                    mid_checkbox < left_text < border_right
                                ):
                                    # Assign the results to the horizontal group
                                    # Check if the vertical overlap between text label and input is sufficient
                                    if (vertical_overlap > HORIZONTAL_GROUPS_VERTICAL_OVERLAP_THRESHOLD * height_elem1):
                                        # Fill the cluster
                                        # cluster = ClusterClass(min(x1, x11), min(y1, y11), max(x2, x21),
                                        # max(y2, y21), elements = [recognized_element, recognized_element1])
                                        # Update the cluster with new text element
                                        cluster.elements.append(recognized_element1)

                                        # Set some flags for this horizontal fcluster
                                        # The cluster contains more than one element
                                        cluster.is_solid = False
                                        # The cluster direction is horizontal
                                        cluster.direction = 1
                                        cluster.origin_direction = 1

                                        cluster.x1 = min(cluster.x1, x11)
                                        cluster.y1 = min(cluster.y1, y11)
                                        cluster.x2 = max(cluster.x2, x21)
                                        cluster.y2 = max(cluster.y2, y21)

                                        # Find the center of cluster
                                        center_x = (cluster.x1 + cluster.x2) / 2
                                        center_y = (cluster.y1 + cluster.y2) / 2
                                        cluster.center = center_x, center_y

                                        # Update the clusters list
                                        clusters.append(cluster)

            #
            #
            # Clusters checkboxes with text labels direction end

            # Place all the free elements for the 1-element clusters
            for idx, recognized_element in enumerate(fdict[fnamesize]["regions"]):
                # First rectangle coordinates
                x1 = int(recognized_element["shape_attributes"]["x"])
                y1 = int(recognized_element["shape_attributes"]["y"])
                x2 = int(x1 + recognized_element["shape_attributes"]["width"])
                y2 = int(y1 + recognized_element["shape_attributes"]["height"])

                element_unique = True
                for cluster in clusters:
                    if recognized_element in cluster.elements:
                        element_unique = False
                if element_unique is True:
                    # Add the element to the cluster
                    cluster = ClusterClass(x1, y1, x2, y2, elements=[recognized_element])

                    # Set some flags for this novel cluster
                    cluster.types = "fcluster"
                    cluster.is_elements_only = True
                    # The cluster contains only one element
                    cluster.is_solid = True
                    # The cluster direction is unseparable
                    cluster.direction = 2
                    cluster.origin_direction = 2

                    # Find the center of cluster
                    center_x = (cluster.x1 + cluster.x2) / 2
                    center_y = (cluster.y1 + cluster.y2) / 2
                    cluster.center = center_x, center_y

                    # Update the clusters list
                    clusters.append(cluster)

            if region_dataset in ["headers", "footers", "webpages"]:
                # Clear the array of dbclusters
                dbclusters = []
                # DBSCAN clustering start
                # #############################################################################
                # Create numpy centers array clusters-based start
                centers_array = []
                for cluster in clusters:
                    centers_array.append(cluster.center)

                centers = np.array(centers_array)
                # print("centers=", centers)
                # Create numpy centers array clusters-based end

                # Compute DBSCAN for the artificial dataset with 750 samples with data centers
                X, labels_true = make_blobs(
                    n_samples=750, centers=centers, cluster_std=0.4, random_state=0
                )

                # Concatenate centers and X next after the make_blobs function
                centers_closest_nodes = []
                for center in centers:
                    # Find the closest element from X
                    # Map the array of centers with array X
                    centers_closest_nodes.append(closest_node(center, X))

                # Fit transform X
                X = StandardScaler().fit_transform(X)

                if region_dataset in ["footers", "webpages"]:
                    db = clustermethod.DBSCAN(eps=0.4).fit(X)
                    # print("db=", db, X, db.labels_, len(X), len(db.labels_))
                    # input()

                if region_dataset == "headers":
                    db = clustermethod.DBSCAN(eps=0.55).fit(X)

                core_samples_mask = np.zeros_like(db.labels_, dtype=bool)
                core_samples_mask[db.core_sample_indices_] = True
                labels = db.labels_

                # Number of dbclusters in labels, ignoring noise if present.
                n_clusters_ = len(set(labels)) - (1 if -1 in labels else 0)

                # DBSCAN.labels are included to fclusters start
                for cluster in clusters:
                    center = cluster.center
                    # DB clusters
                    # cv2.rectangle(
                    #     image_opencv_input,
                    #     (int(center[0]), int(center[1])),
                    #     (int(center[0]) + 10, int(center[1]) + 10),
                    #     (0, 0, 255),
                    #     1,
                    # )

                    for center_closest_node in centers_closest_nodes:
                        # Closest node comparison
                        if (center[0] == center_closest_node[1][0]) and (
                            center[1] == center_closest_node[1][1]
                        ):
                            cluster.X = center_closest_node[2]
                            idx = cluster.idx = center_closest_node[0]
                            cluster.label = labels[idx]
                #
                # cv2.imshow(window_name1, image_opencv_input)
                # cv2.waitKey(0)
                # DBSCAN.labels are included to fclusters end

                # Create dbcluster as a class object
                # Assign elements to dbclusters based on centers information
                for n_cluster in range(n_clusters_):
                    # Collect all the elements related to some dbcluster to this array
                    cluster_sources = []
                    dbcluster = ClusterClass(x1=9999, y1=9999, x2=0, y2=0, elements=[])
                    # Set some flags to the dbcluster
                    dbcluster.types = "dbcluster"
                    dbcluster.is_elements_only = False
                    dbcluster.processing = (
                        "unsplitted"  # check if the ternary algorithm was applied
                    )
                    # Check the directiom with some function
                    # dbcluster.direction = ?
                    # Check is_solid parameter later
                    # is_solid = True  # if clusters contain one element only. Based on flusters making algorithm
                    # clusters-based solution start
                    for cluster in clusters:
                        # Cluster number label
                        label = cluster.label
                        if label == n_cluster:
                            cluster_sources.append(cluster)
                            # Add flusters to dbclusters
                            cluster.parent = dbcluster

                    for cluster_source in cluster_sources:
                        # Construct the dbcluster object
                        # Find min max x1 y1 x2 y2
                        # dbcluster.elements.append(cluster_source)
                        dbcluster.x1 = min(dbcluster.x1, cluster_source.x1)
                        dbcluster.y1 = min(dbcluster.y1, cluster_source.y1)
                        dbcluster.x2 = max(dbcluster.x2, cluster_source.x2)
                        dbcluster.y2 = max(dbcluster.y2, cluster_source.y2)
                    # clusters-based solution end

                    dbclusters.append(dbcluster)

            try:
                # Replace clusters for dbclusters if possible
                fclusters = copy.copy(clusters)
                clusters = dbclusters
            except Exception:
                pass
            finally:
                pass

            # Ternary assembling algorithm run after the clusters start
            # Define the root block
            root_block = ClusterClass(min_x1, min_y1, max_x2, max_y2)
            root_block.types = "ccluster"

            x_layout_intervals = []
            y_layout_intervals = []
            for cluster in clusters:
                x_average = int((cluster.x1 + cluster.x2) / 2)
                y_average = int((cluster.y1 + cluster.y2) / 2)
                x_layout_intervals.append([cluster.x1, cluster.x2])
                y_layout_intervals.append([cluster.y1, cluster.y2])

            # print(x_layout_intervals)
            ob1_x = Partition()
            ob1_x_merged = ob1_x.merge(x_layout_intervals)
            # print("ob1_x_merged", ob1_x_merged, type(ob1_x_merged), len(ob1_x_merged))
            #
            # print(y_layout_intervals)
            ob1_y = Partition()
            ob1_y_merged = ob1_y.merge(y_layout_intervals)
            # print("ob1_y_merged", ob1_y_merged, type(ob1_y_merged), len(ob1_y_merged))

            # Choose if the block horizontal vertical or final
            # horizontal
            if len(ob1_x_merged) >= len(ob1_y_merged):
                root_block.direction = 0

            # vertiical
            if len(ob1_x_merged) < len(ob1_y_merged):
                root_block.direction = 1

            # horizontal y length 1 case
            if len(ob1_x_merged) >= len(ob1_y_merged) and (len(ob1_y_merged) == 1):
                root_block.direction = 1

            # vertiical x length 1 case
            if len(ob1_x_merged) < len(ob1_y_merged) and (len(ob1_x_merged) == 1):
                root_block.direction = 0

            # final
            if (len(ob1_x_merged) == 1) and (len(ob1_y_merged) == 1):
                root_block.direction = 2

            # Prepare the copy of image as overlay before rectangles calculations
            overlay = image_opencv_input.copy()
            # Assign the children based on direction
            if root_block.direction == 0:
                for interval in ob1_y_merged:
                    ccluster = ClusterClass(
                        min_x1, interval[0], max_x2, interval[1], parent=root_block
                    )
                    ccluster.types = "ccluster"
                    # cv2.rectangle(
                    #     image_opencv_input,
                    #     (min_x1, interval[0]),
                    #     (max_x2, interval[1]),
                    #     (70, 50, 135),
                    #     -1,
                    # )

            if root_block.direction == 1:
                for interval in ob1_x_merged:
                    ccluster = ClusterClass(
                        interval[0], min_y1, interval[1], max_y2, parent=root_block
                    )
                    ccluster.types = "ccluster"
                    # cv2.rectangle(
                    #     image_opencv_input,
                    #     (interval[0], min_y1),
                    #     (interval[1], max_y2),
                    #     (20, 50, 107),
                    #     -1,
                    # )

            if root_block.direction == 2:
                for interval_x in ob1_x_merged:
                    for interval_y in ob1_y_merged:
                        ccluster = ClusterClass(
                            interval_x[0],
                            interval_y[0],
                            interval_x[1],
                            interval_y[1],
                            parent=root_block,
                        )
                        ccluster.types = "ccluster"

            # Go through all the blocks obtained
            for pre, fill, node in RenderTree(root_block):
                if node != root_block:
                    # print(node.name)
                    # Split each block
                    blocks_split(node, window_name1, image_opencv_input, overlay, clusters)

            # Go through all the blocks obtained after the ternary algorithm
            # Correct the direction of the fclusters
            for pre, fill, node in RenderTree(root_block):
                if node.types == "fcluster":
                    if len(node.elements) > 1:
                        node.direction = node.origin_direction

            # Go through all the blocks obtained after the ternary algorithm
            # Correct the dbclusters splitting
            # This part of code should split complex dbclusters and re-arrange their child nodes to descendants
            for pre, fill, node in RenderTree(root_block):
                if node.types == "dbcluster":
                    if len(node.children) > 1:
                        dbcluster_split(node, fclusters)

            # Ternary assembling algorithm run after the clusters end

            # Create directtory to save HTML for some image processed
            SAVE_DIR = os.path.join(MEDIA_ROOT, fname)
            find_or_create_dir(SAVE_DIR)

            os.chdir(SAVE_DIR)

            root = ET.Element("html", version="5.0")
            # Передайте родительский узел, имя дочернего узла,
            # и любое количество дополнительных атрибутов
            html_head = ET.SubElement(root, "head")
            html_title = ET.SubElement(root, "title")
            html_title.text = "Title, " + fname
            html_body = ET.SubElement(root, "body")

            # Define the outer container parameters
            outer_div = ET.SubElement(html_body, "div")
            styles = {}
            parameters = {}
            styles["background-color"] = "rgba(" + bcolour_container_value + ")"
            styles["height"] = str(img_height) + "px"
            styles["width"] = str(img_width) + "px"
            str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
            outer_div.set("style", str_styles)
            # print(1277, styles, str_styles)
            # Define the export node
            outer_div_node = ScenarioElement.objects.create(
                parent=serializer_node, struct_type="container", parameters=parameters, styles=styles, buoyancy=0
            )

            for pre, fill, node in RenderTree(root_block):
                # if(node.elements):
                #     print("elements: ", len(node.elements))
                #     input()
                styles = {}
                parameters = {}

                # Define the node dimensions start
                node_width = int(node.x2 - node.x1)
                node_height = int(node.y2 - node.y1)
                # Define the node dimensions end

                # Define the direction of the container start
                # Horizontal
                if node.direction == 1:
                    styles["display"] = "flex"
                    styles["background"] = "aliceblue"
                    if region_dataset in ["headers", "footers"]:
                        styles["justify-content"] = "space-between"
                # Vertical
                if node.direction == 0:
                    styles["display"] = "block"
                    styles["background"] = "lavenderblush"
                if node.direction == 2:
                    if (node.types == "ccluster") or (
                        region_dataset in ["headers", "webpages"]
                    ):
                        styles["display"] = "flex"
                        styles["background"] = "lightblue"
                    else:
                        styles["display"] = "flex"
                        styles["background"] = "lightblue"
                        # Sometimes node_width and height are 0, should check this.
                        if node_width:
                            styles["width"] = str(node_width) + "px"
                        if node_height:
                            styles["height"] = str(node_height) + "px"
                # Define the direction of the container end

                if node == root_block:
                    margin_lr = int((img_width - node_width) / 2)
                    margin_tp = int((img_height - node_height) / 2)
                    node.div = ET.SubElement(outer_div, "div")
                    styles["border"] = "1px solid green"
                    styles["margin"] = str(margin_tp) + "px " + str(margin_lr) + "px"

                    str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
                    node.div.set("style", str_styles)

                    # Create a new Scenario Element for the elements chain
                    node.scenarioelement = ScenarioElement.objects.create(
                        parent=outer_div_node, struct_type="container", parameters=parameters, styles=styles, buoyancy=0
                    )
                else:
                    node.div = ET.SubElement(node.parent.div, "div")

                    styles["border"] = "1px solid green"

                    str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
                    node.div.set("style", str_styles)

                    # Create a new Scenario Element for the elements chain
                    node.scenarioelement = ScenarioElement.objects.create(
                        parent=node.parent.scenarioelement,
                        struct_type="container",
                        parameters=parameters, styles=styles, buoyancy=0
                    )

                # Display elements for some fcluster
                if node.types == "fcluster":
                    # Arrange the fcluster children based on their coordinates
                    if node.direction == 0:
                        array_elements = sorted(
                            node.elements, key=lambda i: i["shape_attributes"]["y"]
                        )
                    elif node.direction == 1:
                        array_elements = sorted(
                            node.elements, key=lambda i: i["shape_attributes"]["x"]
                        )
                    else:
                        array_elements = node.elements
                    for elem in array_elements:
                        # Define the element dimensions start
                        elem_width = int(elem["shape_attributes"]["width"])
                        elem_height = int(elem["shape_attributes"]["height"])

                        x1 = int(elem["shape_attributes"]["x"])
                        y1 = int(elem["shape_attributes"]["y"])
                        # Define the element dimensions end

                        # Cropping to the border box start
                        elem_image = image_original[
                            y1 : y1 + elem_height, x1 : x1 + elem_width
                        ]
                        elem_image_name = uuid.uuid4().hex + fname
                        # print(x1, y1)
                        # input()
                        # Cropping to the border box end

                        styles = {}
                        parameters = {}
                        if elem["region_attributes"]["HTML element"] in {
                            "textinput",
                            "input",
                        }:
                            styles["width"] = str(node_width) + "px"
                            styles["height"] = str(node_height) + "px"

                            # displaying various kinds of elements start
                            element = ET.SubElement(node.div, "input")
                            # displaying various kinds of elements end

                            str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
                            element.set("style", str_styles)

                            # Create a new Scenario Element for the elements chain
                            node.scenarioelement = ScenarioElement.objects.create(
                                parent=node.parent.scenarioelement,
                                struct_type="textinput",
                                parameters=parameters, styles=styles, buoyancy=0
                            )

                        elif elem["region_attributes"]["HTML element"] in {"checkbox"}:
                            # displaying various kinds of elements start
                            element = ET.SubElement(node.div, "input")
                            # displaying various kinds of elements end
                            element.set("type", "checkbox")

                            str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
                            element.set("style", str_styles)

                            # Create a new Scenario Element for the elements chain
                            node.scenarioelement = ScenarioElement.objects.create(
                                parent=node.parent.scenarioelement,
                                struct_type="checkbox",
                                parameters=parameters, styles=styles, buoyancy=0
                            )

                        elif elem["region_attributes"]["HTML element"] in {"radiobutton"}:
                            # displaying various kinds of elements start
                            element = ET.SubElement(node.div, "input")
                            # displaying various kinds of elements end
                            element.set("type", "radio")

                            str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
                            element.set("style", str_styles)

                            # Create a new Scenario Element for the elements chain
                            node.scenarioelement = ScenarioElement.objects.create(
                                parent=node.parent.scenarioelement,
                                struct_type="radiobutton",
                                parameters=parameters, styles=styles, buoyancy=0
                            )

                        elif elem["region_attributes"]["HTML element"] == "select":
                            styles["width"] = str(node_width) + "px"
                            styles["height"] = str(node_height) + "px"

                            # displaying various kinds of elements start
                            element = ET.SubElement(node.div, "select")
                            # displaying various kinds of elements end

                            str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
                            element.set("style", str_styles)

                            # Create a new Scenario Element for the elements chain
                            node.scenarioelement = ScenarioElement.objects.create(
                                parent=node.parent.scenarioelement,
                                struct_type="select",
                                parameters=parameters, styles=styles, buoyancy=0
                            )

                        if elem["region_attributes"]["HTML element"] in {"text", "ocrtext"}:
                            # displaying various kinds of elements start
                            element = ET.SubElement(node.div, "div")
                            # displaying various kinds of elements end

                            element.text = lorem.get_word(count=2)

                            parameters["textContent"] = element.text

                            str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
                            element.set("style", str_styles)

                            # Create a new Scenario Element for the elements chain
                            node.scenarioelement = ScenarioElement.objects.create(
                                parent=node.parent.scenarioelement,
                                struct_type="ocrtext",
                                parameters=parameters, styles=styles, buoyancy=0
                            )

                        elif elem["region_attributes"]["HTML element"] in {"textarea"}:
                            # displaying various kinds of elements start
                            element = ET.SubElement(node.div, "textarea")
                            # displaying various kinds of elements end

                            element.set("placeholder", lorem.get_word(count=2))

                            str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
                            element.set("style", str_styles)

                            # Create a new Scenario Element for the elements chain
                            node.scenarioelement = ScenarioElement.objects.create(
                                parent=node.parent.scenarioelement,
                                struct_type="textarea",
                                parameters=parameters, styles=styles, buoyancy=0
                            )

                        elif elem["region_attributes"]["HTML element"] in {"form_heading"}:
                            # displaying various kinds of elements start
                            element = ET.SubElement(node.div, "h3")
                            # displaying various kinds of elements end

                            element.text = lorem.get_word(count=2)

                            parameters["textContent"] = element.text

                            str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
                            element.set("style", str_styles)

                            # Create a new Scenario Element for the elements chain
                            node.scenarioelement = ScenarioElement.objects.create(
                                parent=node.parent.scenarioelement,
                                struct_type="heading",
                                parameters=parameters, styles=styles, buoyancy=0
                            )

                        elif elem["region_attributes"]["HTML element"] in {"form"}:
                            # displaying various kinds of elements start
                            element = ET.SubElement(node.div, "form")
                            # displaying various kinds of elements end

                            str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
                            element.set("style", str_styles)

                            # Create a new Scenario Element for the elements chain
                            node.scenarioelement = ScenarioElement.objects.create(
                                parent=node.parent.scenarioelement,
                                struct_type="container",
                                parameters=parameters, styles=styles, buoyancy=0
                            )

                        elif elem["region_attributes"]["HTML element"] == "image":
                            styles["max-width"] = "100%"
                            styles["heigh"] = "auto"

                            # Saving an image
                            cv2.imwrite(elem_image_name, elem_image)

                            # displaying various kinds of elements start
                            element = ET.SubElement(node.div, "img")
                            # displaying various kinds of elements end

                            element.set("src", elem_image_name)

                            str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
                            element.set("style", str_styles)

                            # Create a new Scenario Element for the elements chain
                            node.scenarioelement = ScenarioElement.objects.create(
                                parent=node.parent.scenarioelement,
                                struct_type="image",
                                parameters=parameters, styles=styles, buoyancy=0
                            )

                        elif elem["region_attributes"]["HTML element"] == "button":
                            styles["height"] = str(node_height) + "px"

                            # displaying various kinds of elements start
                            element = ET.SubElement(node.div, "button")
                            # displaying various kinds of elements end

                            element.text = lorem.get_word(count=1)

                            parameters["textContent"] = element.text

                            str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
                            element.set("style", str_styles)

                            # Create a new Scenario Element for the elements chain
                            node.scenarioelement = ScenarioElement.objects.create(
                                parent=node.parent.scenarioelement,
                                struct_type="button",
                                parameters=parameters, styles=styles, buoyancy=0
                            )

                        elif elem["region_attributes"]["HTML element"] in {"menu"}:
                            # displaying various kinds of elements start
                            element = ET.SubElement(node.div, "ul")
                            # displaying various kinds of elements end
                            str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
                            element.set("style", str_styles)

                            # Create a new Scenario Element for the elements chain
                            node.scenarioelement = ScenarioElement.objects.create(
                                parent=node.parent.scenarioelement,
                                struct_type="list",
                                parameters=parameters, styles=styles, buoyancy=0
                            )

                        elif elem["region_attributes"]["HTML element"] in {"li"}:
                            # displaying various kinds of elements start
                            element = ET.SubElement(node.div, "li")
                            # displaying various kinds of elements end

                            element.text = lorem.get_word(count=1)

                            parameters["textContent"] = element.text

                            str_styles = '; '.join('{}:{}'.format(key, val) for key, val in styles.items())
                            element.set("style", str_styles)

                            # Create a new Scenario Element for the elements chain
                            node.scenarioelement = ScenarioElement.objects.create(
                                parent=node.parent.scenarioelement,
                                struct_type="listItem",
                                parameters=parameters, styles=styles, buoyancy=0
                            )

        return serializer_node
