import json
import os, sys
import copy
import shutil
from urllib.parse import urlparse

import lorem
import numpy as np
import math
import uuid
from statistics import median

from anytree import RenderTree
from rest_framework_recursive.fields import RecursiveField

from project.settings import (
    MEDIA_ROOT,
    MEDIA_URL,
    model_forms,
    model_headers,
    model_footers,
)
from rest_framework import serializers
from apps.projects.models import ScenarioElement, ProjectScreen
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_blobs
from sklearn import cluster as clustermethod
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
    isRectangleOverlap,
    Rectangle,
    ClusterClass,
    Partition,
    dbcluster_split,
    blocks_split,
    closest_node,
    find_or_create_dir,
    calculateDistance,
    SQUARES_OVERLAP_THRESHOLD_CONTOUR,
    change_permissions_recursive,
    contains_rectangle, isRectangleOverlap_nonnested, nodesorted,
)

from apps.virtualize_simple.merge import pipeline_merge, write_elem_value

config_tesseract = "-l eng --oem 1 --psm 3"

# The constant to remove rectangle when overlaps more than 90% with larger rectangle
SQUARES_OVERLAP_THRESHOLD = 0.9

# The constant to calculate horizontal overlap during the vertical groups detection
# An empirical value derived from observations
VERICAL_GROUPS_HORIZONTAL_OVERLAP_THRESHOLD = 0.75

# The constant to calculate vertical overlap during the horizontal groups detection
# An empirical value derived from observations
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


def calculate_margins(node):
    # Calculate margins for vertically stacked items start
    margin_bottom = 0
    margin_left = 0

    # Extract siblings
    siblings = node.siblings

    # A vertical case
    if (node.parent.direction == 0):
        # Check if the node has the first order, the last order, or the node is internal, extract node.siblings
        # previous_sibling_y1 is calculated for a parent node, if the node has the first order
        # next_sibling_y2 is calculated for a parent node, if the node has the last order
        array_siblings_y1_min = 0
        try:
            array_siblings_y1 = min(siblings, key=lambda i: abs(i.y1 - node.y2))
            array_siblings_y1_min = array_siblings_y1.y1 - node.y2
        except Exception:
            pass
        '''
        print(node.parent.direction, " direction ", len(siblings), " siblings")
        print("compare: ", node.y2, array_siblings_y1.y1)
        for sibling in siblings:
            print("y1, 2: ", sibling.y1, sibling.y2)

        print("margin:", array_siblings_y1_min)
        '''
        # Filter out negative margins
        if(array_siblings_y1_min > 0):
            margin_bottom = array_siblings_y1_min

    # A horizontal case
    if (node.parent.direction == 1):
        array_siblings_x1 = min(siblings, key=lambda i: abs(node.x1 - i.x2))
        array_siblings_x1_min = node.x1 - array_siblings_x1.x2
        '''
        print(node.parent.direction, " direction ", len(siblings), " siblings")
        print("compare: ", node.y2, array_siblings_y1.y1)
        for sibling in siblings:
            print("y1, 2: ", sibling.y1, sibling.y2)

        print("margin:", array_siblings_y1_min)
        '''

        # Filter out positive margins
        if(array_siblings_x1_min > 0):
            margin_left = array_siblings_x1_min

    return margin_bottom
    # Calculate margins for vertically stacked items end


def extract_colour_palette(elem_image):
    # Extract a color palette start
    # Get the dominant colour for the element start
    try:
        domcolour_elem = get_dominant_colour(elem_image)[0]
        domcolour_elem.append(1)
        bcolour_elem_value = ",".join(
            str(int(x)) for x in domcolour_elem
        )
    # Get the dominant colour for the element end
    except Exception:
        bcolour_elem_value = "255,255,255,0"
    finally:
        pass

    # Get the font colour for the element start
    try:
        fcolour_elem = get_dominant_colour(elem_image)[1]
        fcolour_elem.append(1)
        fcolour_elem_value = ",".join(str(int(x)) for x in fcolour_elem)
    except Exception:
        fcolour_elem_value = "91,91,91,0"
    finally:
        pass
    # Get the font colour for the element end
    # Extract a color palette end

    return bcolour_elem_value, fcolour_elem_value


# Detect elements for the root block function
def elements_rootblock(root_block, styles_on, region_dataset, img_width, img_height, outer_div,
                       image_original, fname, o, serializing="virtualize_simple", node_width=0, node_height=0):
    # Function elements creation, loop through the root_block
    for pre, fill, node in RenderTree(root_block):
        styles = {}
        parameters = {}
        if serializing == "freecanvas":
            parameters["freeCanvas"] = {}

            parameters["freeCanvas"]["zIndex"] = 0
            parameters["freeCanvas"]["width"] = node_width
            parameters["freeCanvas"]["height"] = node_height
            parameters["freeCanvas"]["left"] = int(node.x1)
            parameters["freeCanvas"]["top"] = int(node.y1)

        # Define the node dimensions start
        node_width = int(node.x2 - node.x1)
        node_height = int(node.y2 - node.y1)
        # Define the node dimensions end

        # Define the direction of the container start
        # Horizontal
        if node.direction == 1:
            styles["display"] = "flex"

            if not styles_on:
                styles["background"] = "aliceblue"
            if region_dataset in ["headers", "footers"]:
                styles["justify-content"] = "space-between"
        # Vertical
        if node.direction == 0:
            styles["display"] = "block"

            if not styles_on:
                styles["background"] = "lavenderblush"
        if node.direction == 2:
            if (node.types == "ccluster") or (
                    region_dataset in ["headers", "webpages"]
            ):
                styles["display"] = "flex"
                if not styles_on:
                    styles["background"] = "lightblue"
            else:
                styles["display"] = "flex"
                if not styles_on:
                    styles["background"] = "lightgreen"
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

            str_styles = "; ".join(
                "{}:{}".format(key, val) for key, val in styles.items()
            )
            node.div.set("style", str_styles)

            node.scenarioelement_kwargs = {
                "struct_type": "container",
                "parameters": parameters,
                "styles": styles,
                "buoyancy": 0,
            }

            # # Create a new Scenario Element for the elements chain
            # node.scenarioelement = ScenarioElement.objects.create(
            #     parent=outer_div_node,
            #     **node.scenarioelement_kwargs
            # )

        else:
            # Calculate margins for vertically and horizontally stacked items
            margin_bottom = calculate_margins(node)
            styles["margin-bottom"] = str(margin_bottom) + "px"

            node.div = ET.SubElement(node.parent.div, "div")

            styles["border"] = ""

            if not styles_on:
                styles["border"] = "1px solid green"

            str_styles = "; ".join(
                "{}:{}".format(key, val) for key, val in styles.items()
            )
            node.div.set("style", str_styles)

            # Buoyancy detection start
            # Horizontal
            if node.parent.direction == 1:
                buoyancy = int(node.x1)
            # Vertical
            elif node.parent.direction == 0:
                buoyancy = int(node.y1)
            # Other cases
            else:
                buoyancy = int(node.x1)
            # Buoyancy detection end

            # Create a new Scenario Element for the elements chain
            # Before that, check that the node is not final and doesn't have element
            # if(node.elements):
            # if((len(node.children) > 0) or (len(node.elements) > 0)):
            node.scenarioelement_kwargs = {
                "struct_type": "container",
                "parameters": parameters,
                "styles": styles,
                "buoyancy": buoyancy,
            }

        # Correct the struct_type based on the element_assigned value
        # The correction is actual for dbclusters
        # ul li detection
        if (node.element_assigned):
            node.scenarioelement_kwargs["struct_type"] = node.element_assigned
            print(node.element_assigned)

        if (serializing == "freecanvas"):
            # Attach elements for some fcluster
            if node.types == "fcluster":
                # Arrange the fcluster children based on their coordinates
                pass

        elif (serializing in {"virtualize_simple", "assemble"}):
            '''
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
            '''
            # node.scenarioelement_inner_kwargs_list = []
            # for elem in array_elements:
            # Prepare an empty list to define scenario element structure for the further chain joining
            scenarioelement_inner_kwargs = {}
            # Define the element dimensions start
            # Rectangle width and height
            elem_width = node.x2 - node.x1
            elem_height = node.y2 - node.y1
            # Rectangle coordinates
            x1 = node.x1
            y1 = node.y1
            # Define the element dimensions end

            # Cropping to the border box start
            elem_image = image_original[y1: y1 + elem_height, x1: x1 + elem_width]
            elem_image_name = uuid.uuid4().hex + fname
            # Cropping to the border box end

            # Detect the font-size with tesseract for some elements
            text_elem_tesseract = ""
            if node.element_assigned in {
                "textinput",
                "input",
                "select",
                "text",
                "ocrtext",
                "textarea",
                "form_heading",
                "button",
            }:
                # Defiine a scenarioelement_inner dictionary
                scenarioelement_inner_kwargs = {}
                # Detect the font-size with tesseract for some element start
                # Convert to the grey colour
                elem_image_gray = cv2.cvtColor(elem_image, cv2.COLOR_BGR2GRAY)
                result = pytesseract.image_to_boxes(elem_image_gray)
                # print(result)

                lines = result.strip().split("\n")
                font_size = []

                for line in lines:
                    chars = line.split(" ")
                    try:
                        font_size.append(float(chars[4]) - float(chars[2]))
                    except Exception:
                        font_size.append(
                            12.0
                        )  # Default font-size value is 12px
                font_size_value = int(median(font_size) * 1.7)

                # Read the string with tesseract
                text_elem_tesseract = pytesseract.image_to_string(
                    elem_image_gray, config=config_tesseract
                )
                # if text_elem_tesseract:
                #     print("text:", text_elem_tesseract, font_size_value, font_size_img)
                # Show tesseract results only when font is larger than 12
                if font_size_value < 12:
                    text_elem_tesseract = ""
                # Detect the font-size with tesseract for some element end

            styles = {}
            parameters = {}
            styles["text-transform"] = "none"

            bcolour_elem_value, fcolour_elem_value = extract_colour_palette(elem_image)

            # display elem_image start
            """
            cv2.imshow(window_name2, elem_image)
            print(bcolour_elem_value)
            cv2.waitKey(0)
            """
            # display elem_image end

            if node.element_assigned in {
                "textinput",
                "input",
            }:
                styles["width"] = str(node_width) + "px"
                styles["height"] = str(node_height) + "px"
                styles["height"] = ""
                styles["padding"] = "3px 0"
                styles["border-width"] = "1px"
                styles["border-color"] = "rgba(244, 244, 244, 1)"
                styles["background-color"] = (
                        "rgba(" + bcolour_elem_value + ")"
                )
                # displaying various kinds of elements start
                element = ET.SubElement(node.div, "input")
                # displaying various kinds of elements end

                # Text assignment
                if text_elem_tesseract:
                    parameters["textContent"] = text_elem_tesseract

                str_styles = "; ".join(
                    "{}:{}".format(key, val) for key, val in styles.items()
                )
                element.set("style", str_styles)

                # Create a new Scenario Element for the elements chain
                # if(hasattr('node.parent', 'scenarioelement')):
                scenarioelement_inner_kwargs = {
                    "struct_type": "textinput",
                    "parameters": parameters,
                    "styles": styles,
                    "buoyancy": 0,
                }

            elif node.element_assigned in {"checkbox"}:
                styles["width"] = str(min(node_width, node_height)) + "px"
                styles["height"] = str(min(node_width, node_height)) + "px"
                # displaying various kinds of elements start
                element = ET.SubElement(node.div, "input")
                # displaying various kinds of elements end
                element.set("type", "checkbox")

                str_styles = "; ".join(
                    "{}:{}".format(key, val) for key, val in styles.items()
                )
                element.set("style", str_styles)

                # Create a new Scenario Element for the elements chain
                # if(hasattr('node.parent', 'scenarioelement')):
                scenarioelement_inner_kwargs = {
                    "struct_type": "checkbox",
                    "parameters": parameters,
                    "styles": styles,
                    "buoyancy": 0,
                }

            elif node.element_assigned in {"radiobutton"}:
                # displaying various kinds of elements start
                element = ET.SubElement(node.div, "input")
                # displaying various kinds of elements end
                element.set("type", "radio")

                str_styles = "; ".join(
                    "{}:{}".format(key, val) for key, val in styles.items()
                )
                element.set("style", str_styles)

                # Create a new Scenario Element for the elements chain
                # if(hasattr('node.parent', 'scenarioelement')):
                scenarioelement_inner_kwargs = {
                    "struct_type": "radiobutton",
                    "parameters": parameters,
                    "styles": styles,
                    "buoyancy": 0,
                }

            elif node.element_assigned == "select":
                styles["width"] = str(node_width) + "px"
                styles["height"] = str(node_height) + "px"

                # displaying various kinds of elements start
                element = ET.SubElement(node.div, "select")
                # displaying various kinds of elements end

                # Text assignment
                if text_elem_tesseract:
                    parameters["textContent"] = text_elem_tesseract

                str_styles = "; ".join(
                    "{}:{}".format(key, val) for key, val in styles.items()
                )
                element.set("style", str_styles)

                # Create a new Scenario Element for the elements chain
                # if(hasattr('node.parent', 'scenarioelement')):
                scenarioelement_inner_kwargs = {
                    "struct_type": "select",
                    "parameters": parameters,
                    "styles": styles,
                    "buoyancy": 0,
                }

            if node.element_assigned in {"text", "ocrtext"}:
                styles["color"] = styles["color"] = (
                        "rgba(" + fcolour_elem_value + ")"
                )
                # displaying various kinds of elements start
                element = ET.SubElement(node.div, "div")
                # displaying various kinds of elements end

                element.text = lorem.get_word(count=2)
                parameters["textContent"] = element.text
                # Text assignment
                if text_elem_tesseract:
                    parameters["textContent"] = text_elem_tesseract
                    element.text = text_elem_tesseract

                str_styles = "; ".join(
                    "{}:{}".format(key, val) for key, val in styles.items()
                )
                element.set("style", str_styles)

                # Create a new Scenario Element for the elements chain
                # if(hasattr('node.parent', 'scenarioelement')):
                scenarioelement_inner_kwargs = {
                    "struct_type": "ocrtext",
                    "parameters": parameters,
                    "styles": styles,
                    "buoyancy": 0,
                }

            elif node.element_assigned in {"textarea"}:
                # displaying various kinds of elements start
                element = ET.SubElement(node.div, "textarea")
                # displaying various kinds of elements end

                element.set("placeholder", lorem.get_word(count=2))
                # Text assignment
                if text_elem_tesseract:
                    parameters["placeholder"] = text_elem_tesseract

                str_styles = "; ".join(
                    "{}:{}".format(key, val) for key, val in styles.items()
                )
                element.set("style", str_styles)

                # Create a new Scenario Element for the elements chain
                # if(hasattr('node.parent', 'scenarioelement')):
                scenarioelement_inner_kwargs = {
                    "struct_type": "textarea",
                    "parameters": parameters,
                    "styles": styles,
                    "buoyancy": 0,
                }

            elif node.element_assigned in {"form_heading"}:
                # displaying various kinds of elements start
                element = ET.SubElement(node.div, "h3")
                # displaying various kinds of elements end

                element.text = lorem.get_word(count=2)
                parameters["textContent"] = element.text
                # Text assignment
                if text_elem_tesseract:
                    parameters["textContent"] = text_elem_tesseract
                    element.text = text_elem_tesseract

                str_styles = "; ".join(
                    "{}:{}".format(key, val) for key, val in styles.items()
                )
                element.set("style", str_styles)

                # Create a new Scenario Element for the elements chain
                # if(hasattr('node.parent', 'scenarioelement')):
                scenarioelement_inner_kwargs = {
                    "struct_type": "heading",
                    "parameters": parameters,
                    "styles": styles,
                    "buoyancy": 0,
                }

            elif node.element_assigned in {"form"}:
                # displaying various kinds of elements start
                element = ET.SubElement(node.div, "form")
                # displaying various kinds of elements end

                str_styles = "; ".join(
                    "{}:{}".format(key, val) for key, val in styles.items()
                )
                element.set("style", str_styles)

                # Create a new Scenario Element for the elements chain
                # if(hasattr('node.parent', 'scenarioelement')):
                scenarioelement_inner_kwargs = {
                    "struct_type": "container",
                    "parameters": parameters,
                    "styles": styles,
                    "buoyancy": 0,
                }

            elif node.element_assigned == "image":
                styles["max-width"] = "100%"
                styles["height"] = "auto"

                # Saving an image
                cv2.imwrite(elem_image_name, elem_image)
                # Setting path to the image source
                elem_image_sourcename = fname + "/" + elem_image_name

                parameters["imageURL"] = (
                        "https://" + o.netloc + MEDIA_URL + elem_image_sourcename
                )

                # displaying various kinds of elements start
                element = ET.SubElement(node.div, "img")
                # displaying various kinds of elements end

                element.set("src", elem_image_name)

                str_styles = "; ".join(
                    "{}:{}".format(key, val) for key, val in styles.items()
                )
                element.set("style", str_styles)

                # Create a new Scenario Element for the elements chain
                # if(hasattr('node.parent', 'scenarioelement')):
                scenarioelement_inner_kwargs = {
                    "struct_type": "image",
                    "image": elem_image_sourcename,
                    "parameters": parameters,
                    "styles": styles,
                    "buoyancy": 0,
                }

            elif node.element_assigned == "button":
                styles["height"] = str(node_height) + "px"
                styles["color"] = (
                        "rgba(" + fcolour_elem_value + ")"
                )

                # displaying various kinds of elements start
                element = ET.SubElement(node.div, "button")
                # displaying various kinds of elements end
                element.text = lorem.get_word(count=1)
                parameters["textContent"] = element.text
                # Text assignment
                if text_elem_tesseract:
                    parameters["textContent"] = text_elem_tesseract
                    element.text = text_elem_tesseract

                if styles_on:
                    # Set the background colour for styles
                    styles["background-color"] = (
                            "rgba(" + bcolour_elem_value + ")"
                    )

                str_styles = "; ".join(
                    "{}:{}".format(key, val) for key, val in styles.items()
                )
                element.set("style", str_styles)

                # Create a new Scenario Element for the elements chain
                # if(hasattr('node.parent', 'scenarioelement')):
                scenarioelement_inner_kwargs = {
                    "struct_type": "button",
                    "parameters": parameters,
                    "styles": styles,
                    "buoyancy": 0,
                }

            elif node.element_assigned in {"menu"}:
                # displaying various kinds of elements start
                element = ET.SubElement(node.div, "ul")
                # displaying various kinds of elements end
                str_styles = "; ".join(
                    "{}:{}".format(key, val) for key, val in styles.items()
                )
                element.set("style", str_styles)

                # Create a new Scenario Element for the elements chain
                # if(hasattr('node.parent', 'scenarioelement')):
                scenarioelement_inner_kwargs = {
                    "struct_type": "list",
                    "parameters": parameters,
                    "styles": styles,
                    "buoyancy": 0,
                }

            elif node.element_assigned in {"li"}:
                # displaying various kinds of elements start
                element = ET.SubElement(node.div, "li")
                # displaying various kinds of elements end

                element.text = lorem.get_word(count=1)
                parameters["textContent"] = element.text
                # Text assignment
                if text_elem_tesseract:
                    parameters["textContent"] = text_elem_tesseract
                    element.text = text_elem_tesseract

                str_styles = "; ".join(
                    "{}:{}".format(key, val) for key, val in styles.items()
                )
                element.set("style", str_styles)

                # Create a new Scenario Element for the elements chain
                # if(hasattr('node.parent', 'scenarioelement')):
                scenarioelement_inner_kwargs = {
                    "struct_type": "listItem",
                    "parameters": parameters,
                    "styles": styles,
                    "buoyancy": 0,
                }

            node.scenarioelement_kwargs = scenarioelement_inner_kwargs
            # node.scenarioelement_inner_kwargs_list.append(scenarioelement_inner_kwargs)

    return True


# Create elements for the root block function serializer
def elements_rootblock_create(root_block, outer_div_node, serializing="virtualize_simple", children=[]):
    # Function elements creation, loop through the root_block
    for pre, fill, node in RenderTree(root_block):
        if node == root_block:
            # Create a new Scenario Element for the elements chain
            node.scenarioelement = ScenarioElement.objects.create(
                parent=outer_div_node,
                **node.scenarioelement_kwargs
            )
        else:
            node.scenarioelement = ScenarioElement.objects.create(
                parent=node.parent.scenarioelement,
                **node.scenarioelement_kwargs
            )
        if (serializing == "freecanvas"):
            # Attach elements for some fcluster
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

                    # Attach element to cluster
                    for child in children:
                        if (child.parameters):
                            if int(child.parameters["freeCanvas"]["width"]) == elem_width:
                                if int(child.parameters["freeCanvas"]["height"]) == elem_height:
                                    if int(child.parameters["freeCanvas"]["left"]) == x1:
                                        if int(child.parameters["freeCanvas"]["top"]) == y1:
                                            # print(child, child.struct_type, child.parent, child.parent_id)
                                            # input()
                                            child.move_to(node.scenarioelement)
        '''
        elif (serializing in {"virtualize_simple", "assemble"}):
            # Create elements for some fcluster
            if node.types == "fcluster":
                for inner_kwarg in node.scenarioelement_inner_kwargs_list:
                    node.scenarioelement_inner = ScenarioElement.objects.create(
                        parent=node.scenarioelement, **inner_kwarg
                    )
        '''

    return True


def htmltree_initialize(fname, bcolour_container_value, img_width):
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
    # The magic number 30 to solve presence of wide elements have been measured with px
    styles["width"] = str(img_width + 30) + "px"
    str_styles = "; ".join("{}:{}".format(key, val) for key, val in styles.items())
    outer_div.set("style", str_styles)
    return root, outer_div, styles, parameters


def clusters_printing(root_block, root_firstcluster, fname, input_image=[]):
    if len(input_image):
        image_allclusters = copy.deepcopy(input_image)
        image_cclusters = copy.deepcopy(input_image)
        image_firstclusters1 = copy.deepcopy(input_image)
        image_allcluelems = copy.deepcopy(input_image)

    # Go through all the first clusters obtained after the annotation
    if len(image_firstclusters1):
        # Print all the firstclusters
        for pre, fill, node in RenderTree(root_firstcluster):
            if node.types == "firstcluster":
                   cv2.rectangle(
                    image_firstclusters1,
                    (node.x1, node.y1),
                    (node.x2, node.y2),
                    (20, 50, 107),
                    1,
                )

        # Printing cclusters to file
        cv2.imwrite("firstclusters1_" + fname, image_firstclusters1)

    # Go through all the blocks obtained after the ternary algorithm
    if len(image_cclusters):
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
    if len(image_allclusters):
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

    if len(image_allcluelems):
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
                    cv2.rectangle(
                        image_allcluelems,
                        (x1, y1),
                        (x1 + elem_width, y1 + elem_height),
                        (255, 0, 255),
                        1,
                    )

                    label_element = str(elem["region_attributes"]["HTML element"])

                    # Put the class id as a label.
                    # Keep in mind, that this label will be different for the specific block types
                    cv2.putText(
                        image_allcluelems,
                        label_element,
                        (x1, y1 + elem_height),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.5,
                        (36, 255, 12),
                        2,
                    )

        # Printing all clusters with elements to file
        cv2.imwrite("allclusters_with_elements_" + fname, image_allcluelems)

    return True


def ternary_assembling_run(min_x1, min_y1, max_x2, max_y2, root_firstcluster, image_opencv_input, window_name1):
    # Ternary assembling algorithm runs after the clusters pro function start
    # Define the root block
    root_block = ClusterClass(min_x1, min_y1, max_x2, max_y2)
    root_block.types = "ccluster"

    # Find horizontal and vertical intervals
    x_layout_intervals = []
    y_layout_intervals = []

    # for cluster in clusters:
    for pre, fill, node in RenderTree(root_firstcluster):
        if node is not root_firstcluster:
            x_average = int((node.x1 + node.x2) / 2)
            y_average = int((node.y1 + node.y2) / 2)
            x_layout_intervals.append([node.x1, node.x2])
            y_layout_intervals.append([node.y1, node.y2])

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

    # For the top level (children of the root_block) cclusters only
    # Go through all the top level cclusters obtained after the ternary algorithm
    # Check if there are non-elment firstclusters, fclusters, dbclusters in
    # Attach them to these cclusters
    # Special sorting is necessary to prevent a double iteration
    for pre, fill, node in RenderTree(root_block, childiter=nodesorted):
        if node != root_block:
            for pre1, fill1, node1 in RenderTree(root_firstcluster):
                # Check if (node1 in node):
                r1_e = (node.x1, node.y1, node.x2, node.y2)
                r2_e = (node1.x1, node1.y1, node1.x2, node1.y2)
                # print(r1_e, r2_e, node1.element_assigned)
                if ((not (node1.element_assigned)) or (node1.element_assigned in {"div", "container"})) and (contains_rectangle(r1_e, r2_e)):
                    # print(node.name, node1.name)
                    # print(node.types, node1.types)
                    # print(r1_e, r2_e)
                    # print("node1.parent = node")
                    # print(node.element_assigned, node1.element_assigned)
                    node1.parent = node

    # Go through all the blocks obtained after the ternary algorithm
    # Split each block
    for pre, fill, node in RenderTree(root_block):
        if node != root_block:
            if node.types in {"ccluster"}:
                blocks_split(node, window_name1, image_opencv_input, overlay, root_firstcluster)

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
                # dbcluster_split(node, fclusters)
                pass
    # Ternary assembling algorithm run after the clusters pro function end
    return root_block


def calculate_dbclusters(region_dataset, root_firstcluster, fname, image_dbclusters=[]):
    # Clear the array of dbclusters pro-function start
    dbclusters = []
    # DBSCAN clustering start
    # #############################################################################
    # Create numpy centers array clusters-based start
    centers_array = []
    # DBclusters are calculated on fclusters and single leaves
    # Second order (add later), parents of the final nodes
    for pre, fill, node in RenderTree(root_firstcluster):
        if (node.types == "fcluster") or (node.is_leaf is True):
            # Find the center of cluster
            center_x = (node.x1 + node.x2) / 2
            center_y = (node.y1 + node.y2) / 2
            node.center = center_x, center_y
            centers_array.append(node.center)

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

    # DBSCAN.labels are included to fclusters and single leaves start
    for pre, fill, node in RenderTree(root_firstcluster):
        if (node.types == "fcluster") or (node.is_leaf is True):
            # Find the center of cluster
            center = node.center
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
                    node.X = center_closest_node[2]
                    idx = node.idx = center_closest_node[0]
                    node.label = labels[idx]

    #
    # cv2.imshow(window_name1, image_opencv_input)
    # cv2.waitKey(0)
    # DBSCAN.labels are included to fclusters end

    # Create dbcluster as a class object
    # Assign children to dbclusters based on centers information
    for n_cluster in range(n_clusters_):
        # Collect all the elements related to some dbcluster to this array
        cluster_sources = []
        dbcluster = ClusterClass(x1=9999, y1=9999, x2=0, y2=0)
        # Set some flags to the dbcluster
        dbcluster.types = "dbcluster"
        dbcluster.is_elements_only = False
        dbcluster.processing = (
            "unsplitted"  # check if the ternary algorithm was applied
        )
        # Assign an unordered HTML list to the dbcluster
        dbcluster.element_assigned = "list"
        # Check the directiom with some function
        # dbcluster.direction = ?
        # Check is_solid parameter later
        # is_solid = True  # if clusters contain one element only. Based on flusters making algorithm
        # clusters-based solution start
        for pre, fill, node in RenderTree(root_firstcluster):
            if (node.types == "fcluster") or ((node.is_leaf is True) and (node.types != "dbcluster")):
                # Why dbclusters are leaves now? This should be corrected
                # Cluster number label
                print("label:", node.label)
                label = node.label
                if label == n_cluster:
                    cluster_sources.append(node)

                    # Maybe should change this parent assignment later
                    # Detect parents for dbclusters
                    dbcluster.parent = node.parent

                    # Add flusters to dbclusters
                    # node.parent = dbcluster
                    # dbcluster.children.extend(node)

        for cluster_source in cluster_sources:
            # Construct the dbcluster object
            # Find min max x1 y1 x2 y2
            # dbcluster.elements.append(cluster_source)
            dbcluster.x1 = min(dbcluster.x1, cluster_source.x1)
            dbcluster.y1 = min(dbcluster.y1, cluster_source.y1)
            dbcluster.x2 = max(dbcluster.x2, cluster_source.x2)
            dbcluster.y2 = max(dbcluster.y2, cluster_source.y2)

            # Assign a list element to the source cluster
            cluster_source.element_assigned = "listItem"

        # clusters-based solution end

        dbclusters.append(dbcluster)

        if len(image_dbclusters):
            # Display dbclusters
            cv2.rectangle(
                image_dbclusters,
                (dbcluster.x1, dbcluster.y1),
                (dbcluster.x2, dbcluster.y2),
                (164, 24, 4),
                1,
            )

    if len(image_dbclusters):
        # Printing dbclusters to file
        cv2.imwrite("dbclusters_" + fname, image_dbclusters)
        # Clear the array of dbclusters pro-function end

    return dbclusters


# Processing simple elements chains at the level of the firstclusters
def firstclusters_elements_chains_processing(root_firstcluster, fname):
    for pre, fill, node in RenderTree(root_firstcluster):
        if (node.height == 1) and node.element_assigned in {
            "input",
            "select",
            "button",
            "image",
        }:
            # Process only a singles labels
            if(len(node.children)) == 1:
                for child in node.children:
                    if(child.element_assigned in {
                        "ocrtext",

                    }):

                        node.placeholder = [child.x1, child.y1, child.x2, child.y2]
                        # Child Node Detach
                        child.parent = None

    return root_firstcluster


def calculate_fclusters(root_firstcluster, fname, image_fclusters=[]):
    # find all the clusters based on cluster-making elements
    # (inputs, selects, buttons, free text blocks, maybe large images)
    # root_cluster = ClusterClass(min_x1, min_y1, max_x2, max_y2, elements=[])
    # clusters = []
    # Cluster: x1, y1, x2, y2, elements[], type(input or select), direction start
    #
    #
    # Vertical clusters input-like with text labels detection
    # The first position is input or select, and the second position is text

    # for idx, recognized_element in enumerate(fdict[fnamesize]["regions"]):
    for pre, fill, node in RenderTree(root_firstcluster):
        if node.element_assigned in {
            "input",
            "select",
            "button",
        }:
            # Assign the textContent values after grouping with text
            # Vertical group when input or select element has another text element
            # at the distance 0.5 from its width
            # Horizontal group when input or select or text are placed horizontally

            # Loop through all the firstclusters with assigned elements
            # Find all the close-by elements if one of them input (1) or select (4),
            # and second one is the text (3)
            # Horizontal overlap 75% of the element with minimal width
            # Vertical max +- 50% for input/select width,
            # middle of the text element should be within this interval

            # First rectangle coordinates
            x1 = node.x1
            y1 = node.y1
            x2 = node.x2
            y2 = node.y2

            # First rectangle width and height
            width_elem = x2 - x1
            height_elem = y2 - y1

            # for idx1, recognized_element1 in enumerate(fdict[fnamesize]["regions"]):
            for pre, fill, node1 in RenderTree(root_firstcluster):
                if node1.element_assigned in {
                    "text",
                    "ocrtext",
                }:
                    # Check if the elements were not assigned to the clusters before
                    # if (
                    #         (recognized_element1 not in clr.elements)
                    #         for clr in clusters
                    # ):
                    if (node1.parent.types != "fcluster"):

                        # Second rectangle coordinates
                        x11 = node1.x1
                        y11 = node1.y1
                        x21 = node1.x2
                        y21 = node1.y2

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

                                # Add the initial element to the cluster
                                # Define some values to this novel cluster
                                cluster = ClusterClass(x1, y1, x2, y2)
                                cluster.types = "fcluster"
                                cluster.is_elements_only = True

                                # Not sure that this assignment is important
                                cluster.parent = node.parent
                                # Fill the cluster
                                # cluster = ClusterClass(min(x1, x11), min(y1, y11), max(x2, x21),
                                # max(y2, y21), elements = [recognized_element, recognized_element1])

                                # Update the cluster with new parent-child relations
                                node.parent = cluster
                                node1.parent = cluster

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
                                # center_x = (cluster.x1 + cluster.x2) / 2
                                # center_y = (cluster.y1 + cluster.y2) / 2
                                # cluster.center = center_x, center_y

                                # Update the clusters list
                                # clusters.append(cluster)

            if len(image_fclusters):
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
    for pre, fill, node in RenderTree(root_firstcluster):
        if node.element_assigned in {
            "input",
            "select",
            "button",
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
            x1 = node.x1
            y1 = node.y1
            x2 = node.x2
            y2 = node.y2

            # First rectangle width and height
            width_elem = x2 - x1
            height_elem = y2 - y1

            for pre, fill, node1 in RenderTree(root_firstcluster):
                if node1.element_assigned in {
                    "text",
                    "ocrtext",
                }:
                    # Check if the elements were not assigned to the clusters before
                    if (node1.parent.types != "fcluster"):

                        # Second rectangle coordinates
                        x11 = node1.x1
                        y11 = node1.y1
                        x21 = node1.x2
                        y21 = node1.y2

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
                            if (
                                    vertical_overlap
                                    > HORIZONTAL_GROUPS_VERTICAL_OVERLAP_THRESHOLD
                                    * height_elem1
                            ):
                                # Add the initial element to the cluster
                                # Define some values to this novel cluster
                                cluster = ClusterClass(x1, y1, x2, y2)
                                cluster.types = "fcluster"
                                cluster.is_elements_only = True

                                # Not sure that this assignment is important
                                cluster.parent = node.parent
                                # Fill the cluster
                                # cluster = ClusterClass(min(x1, x11), min(y1, y11), max(x2, x21),
                                # max(y2, y21), elements = [recognized_element, recognized_element1])

                                # Update the cluster with new parent-child relations
                                node.parent = cluster
                                node1.parent = cluster

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
                                # clusters.append(cluster)

            if len(image_fclusters):
                # Display checkbox-based fclusters
                cv2.rectangle(
                    image_fclusters,
                    (cluster.x1, cluster.y1),
                    (cluster.x2, cluster.y2),
                    (144, 12, 2),
                    1,
                )
    if len(image_fclusters):
        # Printing fclusters to file
        cv2.imwrite("fclusters_" + fname, image_fclusters)
    # Clusters checkboxes with text labels direction end

    return root_firstcluster


def calculate_excluded_indices(fdict, fnamesize):
    # Calculation of the excluded indices to remove overlapped elements
    # Second, calculate the non-text blocks overlap
    excluded_elements = []
    for rect1 in fdict[fnamesize]["regions"]:
        for rect2 in fdict[fnamesize]["regions"]:
            is_nonexcluded = (
                              rect1["region_attributes"]["HTML element"] in {"menu", "container"}
                      ) or (rect2["region_attributes"]["HTML element"] in {"menu", "container"})
            if (rect1 != rect2) and not is_nonexcluded:
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
                # Define the overlapping area between the rectangles
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
                # I compare the two rectangles to detect if they overlap.
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
    return True


def calculate_ocvclusters(fdict, fnamesize):
    # Calculation of the excluded indices to remove overlapped elements pro function for a some ocvclusters level start
    # Second, calculate the non-text blocks overlap
    excluded_elements = []
    for rect1 in fdict[fnamesize]["regions"]:
        for rect2 in fdict[fnamesize]["regions"]:
            if rect1 != rect2:
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
                # Define the overlapping area between the rectangles
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
                # I compare the two rectangles to detect if they overlap.
                if not (width <= 0 or height <= 0):
                    # If the square > 0, calculate the squares of the 3 rectangles
                    square = width * height
                    square1 = width1 * height1
                    square2 = width2 * height2

                    min_square = min(square1, square2)
                    min_square_dim = min(height, width)

                    # change two borders for the min_square (rect1) to separate the item
                    # Should correct this later, to find proper borders
                    if square > min_square * 0.75:
                        if square1 < square2:
                            x1 = x1 + width
                            y1 = y1 + height
                        else:
                            x3 = x3 + width
                            y3 = y3 + height

                    # change one border for the min_square to separate the item
                    # Should correct this later. To do this, find, which borders are under intersection
                    elif square < min_square * 0.25:
                        if square1 < square2:
                            if height < width:
                                x1 = x1 + min_square_dim
                            else:
                                y1 = y1 + min_square_dim
                        else:
                            if height < width:
                                x3 = x3 + min_square_dim
                            else:
                                y3 = y3 + min_square_dim

                    # Remove overlapped items
                    elif square * 0.25 < min_square < square * 0.75:

                        if square1 < square2:
                            excluded_elements.append(rect1)
                        else:
                            excluded_elements.append(rect2)

                    else:
                        pass

    # Remove some items using list comprehension
    fdict[fnamesize]["regions"] = [
        ele
        # for ele in fdict[filenamesize]["regions"]
        for ele in fdict[fnamesize]["regions"]
        if ele not in excluded_elements
    ]

    # Create a set of independent ocvclusters
    for rect in fdict[fnamesize]["regions"]:
        x1 = rect["shape_attributes"]["x"]
        y1 = rect["shape_attributes"]["y"]
        x2 = rect["shape_attributes"]["x"] + rect["shape_attributes"]["width"]
        y2 = rect["shape_attributes"]["y"] + rect["shape_attributes"]["height"]
        ocvcluster = ClusterClass(x1, y1, x2, y2)
        # Set some flags for this novel ocvcluster
        ocvcluster.types = "ocvcluster"
        # Check a cluster definition

    return True


# This function extracts rectangle from some fdict regions
def extract_rectangle_coordinates(rect):

    x1 = rect["shape_attributes"]["x"]
    y1 = rect["shape_attributes"]["y"]
    x2 = rect["shape_attributes"]["x"] + rect["shape_attributes"]["width"]
    y2 = rect["shape_attributes"]["y"] + rect["shape_attributes"]["height"]

    return (x1, y1, x2, y2)


# For some rectangle. Go through all the rectangles in (calculate this on the fly).
# Find rectangles without parents, they are level rectangles. Create firstclusters for them.
# Repeat the process (the function is recursive)
def chain_firstclusters(rectangles, firstcluster, image_firstclusters):
    level_blocks = firstcluster.level_blocks
    # print(level_blocks)
    # input()
    for level_block in level_blocks:
        next_level_blocks = []
        for r1 in rectangles:
            # Check if r1 in level_block
            r1_e = extract_rectangle_coordinates(r1)
            level_block_e = extract_rectangle_coordinates(level_block)
            print(r1_e, level_block_e)
            if (contains_rectangle(level_block_e, r1_e) is True) and (level_block_e != r1_e):
                print("contains_rectangle")
                is_parent = False
                is_final = True
                for r2 in rectangles:
                    # Check if r2 in level_block
                    r2_e = extract_rectangle_coordinates(r2)
                    # print(level_block_e, r2_e)
                    if (contains_rectangle(level_block_e, r2_e) is True) and (level_block_e != r2_e):
                        print("is_not_final")
                        # find rectangles without parents
                        # Check if r2 in r1
                        # if contains_rectangle(r2_e, r1_e) is False:
                        if (contains_rectangle(r1_e, r2_e) is True) and (r1_e != r2_e):
                            print(level_block_e, r1_e, r2_e)
                            print("is_parent")
                            is_parent = True
                            is_final = False

                        # Check if r1 is placed in r2
                        if (contains_rectangle(r2_e, r1_e) is True) and (r1_e != r2_e):
                            print(level_block_e, r1_e, r2_e)

                            # Check if it is a parent for the level of interest
                            # Double false means that the block of interest is from the next level
                            print("is_parent")
                            is_parent = False
                            is_final = False

                print(is_parent, is_final)
                # Extend the set of the next level blocks
                if (is_parent is True):
                    # print("r1=", r1)
                    next_level_blocks.append(r1)
                    print(*r1_e)
                    next_level_block_firstcluster = ClusterClass(*r1_e)
                    next_level_block_firstcluster.types = "firstcluster"
                    next_level_block_firstcluster.parent = firstcluster
                    next_level_block_firstcluster.element_assigned = r1["region_attributes"]["HTML element"]
                    next_level_block_firstcluster.level_blocks = next_level_blocks

                    (x1, y1, x2, y2) = r1_e
                    cv2.rectangle(
                        image_firstclusters,
                        (x1, y1),
                        (x2, y2),
                        (20, 90, 255),
                        1,
                    )
                    chain_firstclusters(rectangles, next_level_block_firstcluster, image_firstclusters)
                elif (is_final is True):
                    # print("r1=", r1)
                    print(*r1_e)
                    next_level_block_firstcluster = ClusterClass(*r1_e)
                    next_level_block_firstcluster.types = "firstcluster"
                    next_level_block_firstcluster.element_assigned = r1["region_attributes"]["HTML element"]
                    next_level_block_firstcluster.parent = firstcluster

                    (x1, y1, x2, y2) = r1_e
                    cv2.rectangle(
                        image_firstclusters,
                        (x1, y1),
                        (x2, y2),
                        (100, 80, 155),
                        1,
                    )
                print(x1, y1, x2, y2)
            # cv2.imshow("window_name1", image_firstclusters)
            # cv2.waitKey(0)

    return True


def calculate_firstclusters(fdict, fname, fnamesize, node, img_height, img_width, image_firstclusters):
    # img_height, img_width, img_channels = image_firstclusters.shape
    # print(image_firstclusters.shape)
    # Detect top level blocks
    top_level_blocks = []
    # top_level_block is a nested dictionary
    top_level_block = {}
    top_level_block["shape_attributes"] = {}
    top_level_block["shape_attributes"]["x"] = 0
    top_level_block["shape_attributes"]["y"] = 0
    top_level_block["shape_attributes"]["width"] = img_width
    top_level_block["shape_attributes"]["height"] = img_height

    top_level_blocks.append(top_level_block)

    # Create a set of rectangles
    rectangles = []
    for rect in fdict[fnamesize]["regions"]:
        # The commented if- statement is used for calculation of the menu
        # if (rect["region_attributes"]["HTML element"] in {"container", "list"}):
        # Now all the rectangles are processed. They should be prepared properly.
        rectangles.append(rect)

    # Create a top level firstcluster based on whole image size
    # This top block should not be displayed at the final output
    # Top levels blocks should be included for this data structure
    top_level_block_e = extract_rectangle_coordinates(top_level_block)
    root_firstcluster = ClusterClass(*top_level_block_e)
    root_firstcluster.types = "firstcluster"
    root_firstcluster.level_blocks = top_level_blocks

    # For some rectangle. Go through all the rectangles in. Find rectangles without parents, they are level rectangles.
    # Save sets of rectangles placed for each level rectangle. Repeat the process.
    chain_firstclusters(rectangles, root_firstcluster, image_firstclusters)

    # Printing firstclusters to file
    # if len(image_firstclusters):
    #     imgpath = MEDIA_ROOT + "/uploads/" + "firstclusters_" + fname
    #     cv2.imwrite(imgpath, image_firstclusters)
    #     node.parameters["image"] = "firstclusters_" + fname

    return root_firstcluster


def print_clusters_length(root_firstcluster):
    for pre, fill, node in RenderTree(root_firstcluster):
        # Print clusters start
        print(node.types, node.element_assigned)
        # Print clusters end
        return True
    else:
        return False


def supplement_fdict_calc_printing(fdict, fname, fnamesize, img_width, img_height, image_via=[]):
    # Supplementary parameters calculation and printing of the fdict start
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

        if len(image_via):
            # Show VIA annotated regions on image
            cv2.rectangle(image_via, (x1, y1), (x2, y2), (255, 0, 0), 1)

    if len(image_via):
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
    # Cropping the image is essential for further OCR applying.
    min_x1 = img_width
    min_y1 = img_height
    max_x2 = 0
    max_y2 = 0

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

    # Supplementary parameters calculation and printing of the fdict end
    return min_x1, min_y1, max_x2, max_y2


def print_maskrcnn_output(region_dataset, image_maskrcnn_notext, fname, fnamesize, r, cnndict, element, image_maskrcnn):
    # Printing the pure Mask R CNN output without text blocks recognized
    for idx1, (rect1, class_id1) in enumerate(zip(r["rois"], r["class_ids"])):
        #  1,2,4,5,7 means elements except the text class and the radiobutton while merging forms
        if (
                ((region_dataset == "forms") and (class_id1 in {1, 2, 4, 5, 7}))
                or ((region_dataset == "footers") and (class_id1 in {2, 3, 4, 5}))
                or (
                (region_dataset == "headers")
                and (class_id1 in {2, 3, 4, 5, 6, 7, 8})
        )
        ):
            x3 = rect1[1]
            y3 = rect1[0]
            x4 = rect1[3]
            y4 = rect1[2]

            cv2.rectangle(
                image_maskrcnn_notext, (x3, y3), (x4, y4), (255, 100, 255), 1
            )
            # Put the class id as a label. Keep in mind, that this label will be different for the specific block types
            cv2.putText(
                image_maskrcnn_notext,
                str(class_id1),
                (x3, y4),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (36, 255, 12),
                2,
            )

    cv2.imwrite("maskrcnn_notext_" + fname, image_maskrcnn_notext)


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
        extra_kwargs = {"screenscenario": {"read_only": True}}

    def create(self, validated_data):
        # Extract an appropriate block_type flag value to recognize block as header, footer, form or webpage
        region_dataset = "webpages"  # Region dataset has a default value
        if validated_data.get("screen_data_json"):
            region_dataset = validated_data["screen_data_json"]["block_type"]

        # Display the region_dataset value
        # print(region_dataset) #####console
        #
        # fname = ""
        # imgpath = ""

        # Create the opencv recognition start
        if validated_data.get("image"):
            image_recognize = validated_data.pop("image")
            node = ProjectScreen.objects.create(image=image_recognize, **validated_data)
            fname = str(image_recognize)
            imgpath = MEDIA_ROOT + "/uploads/" + fname
        else:
            node = ProjectScreen.objects.create(**validated_data)

        # Calculate a chain of functions for merging
        # if imgpath:
        sdj = pipeline_merge(imgpath, region_dataset, fname)

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
                styles_on = int(validated_data["parameters"]["styles_on"])
        except Exception:
            pass
        # print(region_dataset)

        fdict = (
            {}
        )  # Output dictionary to write annotation, maskrcnn-opencv with AND predicate
        fordict = (
            {}
        )  # Output dictionary to write annotation, maskrcnn-opencv with OR predicate
        cnndict = {}  # Output dictionary to write annotation, maskrcnn only. Maybe better start extending with that.

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

        print(imgpath)
        print(cv2.imread(imgpath))

        # Read an image with OpenCV start
        image_opencv_input = cv2.imread(imgpath)
        image_original = copy.deepcopy(image_opencv_input)
        image_maskrcnn_notext = copy.deepcopy(image_opencv_input)
        image_maskrcnn = copy.deepcopy(image_opencv_input)
        image_maskrcnn_or = copy.deepcopy(image_opencv_input)
        # image_maskrcnn_and = copy.deepcopy(image_opencv_input)
        image_fclusters = copy.deepcopy(image_opencv_input)
        image_dbclusters = copy.deepcopy(image_opencv_input)
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
        domcolour_container = get_dominant_colour(image_opencv_input)[0]
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

                    if (
                        vertical_overlap
                        > HORIZONTAL_GROUPS_VERTICAL_OVERLAP_THRESHOLD * min(h, h1)
                    ):
                        if (text_contour_x1 + 3 > text_contour1_x) and (
                            text_contour_x < text_contour1_x
                        ):
                            # Merge these intervals
                            tcont_y = min(
                                text_contour_y,
                                text_contour1_y,
                                text_contour_y1,
                                text_contour1_y1,
                            )
                            tcont_y1 = max(
                                text_contour_y,
                                text_contour1_y,
                                text_contour_y1,
                                text_contour1_y1,
                            )
                            tcont_x = min(
                                text_contour_x,
                                text_contour1_x,
                                text_contour_x1,
                                text_contour1_x1,
                            )
                            tcont_x1 = max(
                                text_contour_x,
                                text_contour1_x,
                                text_contour_x1,
                                text_contour1_x1,
                            )

                            tcont_width = tcont_x1 - tcont_x
                            tcont_height = tcont_y1 - tcont_y
                            tcont = (tcont_x, tcont_y, tcont_width, tcont_height)
                            # Add new interval to list
                            merged_contours.append(tcont)

                            # Remove source intervals from list
                            excluded_contours.add(idx)
                            excluded_contours.add(idx1)

        # Remove set of indices from list
        text_contours = [
            i for j, i in enumerate(text_contours) if j not in excluded_contours
        ]
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
            # Loading the image and converting to the numpy array
            img = load_img(imgpath)
            img = img_to_array(img)

            # Detect a size of the file uploaded
            fsize = str(os.path.getsize(imgpath))

            # Write a merged string with fname and size
            fnamesize = fname + fsize

            # Prepare a dictionary (AND- based) to store recognized shapes
            fdict[fnamesize] = {
                "filename": fname,
                "size": fsize,
                "regions": [],
                "file_attributes": {},
            }

            # Prepare a dictionary (OR- based) to store recognized shapes
            fordict[fnamesize] = {
                "filename": fname,
                "size": fsize,
                "regions": [],
                "file_attributes": {},
            }

            # Prepare a dictionary (CNN) to store recognized shapes
            cnndict[fnamesize] = {
                "filename": fname,
                "size": fsize,
                "regions": [],
                "file_attributes": {},
            }

            # Create a directory to save HTML for some image processed
            # CURRENT_DIR = os.getcwd()
            SAVE_DIR = os.path.join(MEDIA_ROOT, fname)
            find_or_create_dir(SAVE_DIR)

            os.chmod(SAVE_DIR, 0o755)
            os.chdir(SAVE_DIR)

            # Detect elements for the case of "forms", "headers", "footers"
            if region_dataset in {"forms", "headers", "footers"}:
                # Detect elements with Mask R CNN model start
                if region_dataset == "forms":
                    results = model_forms.detect([img], verbose=1)

                if region_dataset == "headers":
                    results = model_headers.detect([img], verbose=1)

                if region_dataset == "footers":
                    results = model_footers.detect([img], verbose=1)

                # Results of the Mask R CNN recognition
                r = results[0]
                # Detect elements with Mask R CNN model end

                # Printing text contours preparations (AND) start
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
                    # Here is the filtering of the text blocks.
                    # The small text contours with height > width were often a junk contours,
                    # especially not for the whole webpages, but for some smaller blocks (forms, headers, footers).
                    # Probably a better filtering strategy will be found later here
                    if w > h:
                        fdict[fnamesize]["regions"].append(attributes_dict)
                    cv2.rectangle(
                        image_opencv_input, (x, y), (x + w, y + h), (255, 0, 0), 1
                    )

                # Printing text contours preparations (AND) end

                # Printing rect contours with concatenation preparations start
                for rect_contour in rect_contours:
                    x1, y1, w, h = rect_contour
                    x2 = w + x1
                    y2 = h + y1

                    cv2.rectangle(
                        image_opencv_input, (x1, y1), (x1 + w, y1 + h), (255, 0, 255), 1
                    )
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
                            # Define the overlapping area between the rectangles
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
                            # I compare the two rectangles to detect if they overlap.
                            if not (width <= 0 or height <= 0):
                                # If the square > 0, calculate the squares of the 3 rectangles
                                square = width * height
                                square1 = width1 * height1
                                square2 = width2 * height2
                                if (
                                    square > square1 * SQUARES_OVERLAP_THRESHOLD_CONTOUR
                                ) or (
                                    square > square2 * SQUARES_OVERLAP_THRESHOLD_CONTOUR
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

                # Printing text contours preparations (OR) start
                for text_contour in text_contours:
                    x, y, w, h = text_contour
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
                    # Here is the filtering of the text blocks.
                    # The small text contours with height > width were often a junk contours,
                    # especially not for the whole webpages, but for some smaller blocks (forms, headers, footers).
                    # Probably a better filtering strategy will be found later here
                    if w > h:
                        fordict[fnamesize]["regions"].append(attributes_dict)
                    cv2.rectangle(
                        image_maskrcnn_or, (x, y), (x + w, y + h), (255, 0, 0), 1
                    )
                # Printing text contours preparations (OR) end

                # Printing rect contours with OR concatenation preparations start
                for rect_contour in rect_contours:
                    x1, y1, w, h = rect_contour
                    x2 = w + x1
                    y2 = h + y1

                    cv2.rectangle(
                        image_maskrcnn_or, (x1, y1), (x1 + w, y1 + h), (255, 0, 255), 1
                    )

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
                            # Define the overlapping area between the rectangles
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
                            # I compare the two rectangles to detect if they overlap.
                            if not (width <= 0 or height <= 0):
                                # If the square > 0, calculate the squares of the 3 rectangles
                                square = width * height
                                square1 = width1 * height1
                                square2 = width2 * height2
                                if (
                                    square > square1 * SQUARES_OVERLAP_THRESHOLD_CONTOUR
                                ) or (
                                    square > square2 * SQUARES_OVERLAP_THRESHOLD_CONTOUR
                                ):
                                    if centers_distance < centers_distance_min:
                                        centers_distance_min = centers_distance
                                        # idx1_selected = idx1
                                        # Assign the class id value to the rect_contour
                                        class_id_recognized = class_id1
                                        # print("idx1_select", idx1)

                    # cv2.destroyAllWindows()

                    cv2.imwrite("opencv_contours_or_" + fname, image_maskrcnn_or)

                    element = write_elem_value(region_dataset, class_id_recognized)

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
                    fordict[fnamesize]["regions"].append(attributes_dict)
                # Printing rect contours with OR concatenation preparations end

                # Printing contours with mask r cnn only start
                for idx1, (rect1, class_id1) in enumerate(
                    zip(r["rois"], r["class_ids"])
                ):
                    x3 = rect1[1]
                    y3 = rect1[0]
                    x4 = rect1[3]
                    y4 = rect1[2]

                    # The second rectangle square
                    width, height = x4 - x3, y4 - y3

                    element = write_elem_value(region_dataset, class_id1)

                    # Fill the attributes dictionary
                    attributes_dict = {
                        "shape_attributes": {
                            "name": "rect",
                            "x": int(x3),
                            "y": int(y3),
                            "width": int(width),
                            "height": int(height),
                        },
                        "region_attributes": {"HTML element": element},
                    }
                    cnndict[fnamesize]["regions"].append(attributes_dict)
                # Printing contours with mask r cnn only end

            # Detect elements for the case of "webpages"
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
                    element = "div"

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

        if region_dataset not in {"webpages"}:
            # Printing the Mask R CNN output function call
            # Try to fill cnndict (second time)
            print_maskrcnn_output(region_dataset, image_maskrcnn_notext, fname, fnamesize, r, cnndict, element, image_maskrcnn)

        # fdict obtained
        # file_dict = fdict
        # print("fdict: ", fdict)
        # print("fordict: ", fordict)

        # this asignment used for headers testing purposes
        # fdict = cnndict
        # cnndict = fordict
        # print("fdict: ", fdict)

        # Assembling start
        # Supplementary parameters calculation and printing of the fdict function call
        min_x1, min_y1, max_x2, max_y2 = supplement_fdict_calc_printing(fdict, fname, fnamesize, img_width, img_height, image_via=image_via)

        # Supplementary parameters calculation and printing of the cnndict function call
        min_cnnx1, min_cnny1, max_cnnx2, max_cnny2 = supplement_fdict_calc_printing(cnndict, fname, fnamesize, img_width, img_height)

        # This should be replaced to create nested structure. Clusters obtained from text blocks
        # and from rect blocks should save this information
        if region_dataset in {"webpages"}:
            # Calculate the excluded indices to remove overlapped elements function calling
            calculate_excluded_indices(fdict, fnamesize)

        # Create ocvclusters
        # Creating a nested structure.
        # Clusters obtained from text blocks and from rect blocks should save this information
        if region_dataset in {"webpages"}:
            # Calculate ocvclusters function calling
            calculate_ocvclusters(fdict, fnamesize)

        # Calculate fclusters function calling
        root_firstcluster = calculate_fclusters(fdict, fname, image_fclusters=image_fclusters)

        # Calculate fclusters cnn function calling
        clusters_cnn = calculate_fclusters(cnndict, fname)

        if region_dataset in ["headers", "footers", "webpages"]:
            # Calculate dbclusters function calling
            dbclusters = calculate_dbclusters(region_dataset, root_firstcluster, fname, image_dbclusters)
            # Calculate dbclusters cnn function calling.
            # Should remove image_dbclusters here to display info properly
            dbclusters_cnn = calculate_dbclusters(region_dataset, clusters_cnn, fname, image_dbclusters)

        '''
        try:
            # Replace clusters for dbclusters if possible
            fclusters = copy.copy(clusters)
            clusters = dbclusters
        except Exception:
            pass
        finally:
            pass
        '''

        try:
            # Replace clusters cnn for dbclusters cnn if possible
            fclusters_cnn = copy.copy(clusters_cnn)
            clusters_cnn = dbclusters_cnn
        except Exception:
            pass
        finally:
            pass

        # Ternary assembling algorithm function calling
        root_block = ternary_assembling_run(min_x1, min_y1, max_x2, max_y2, root_firstcluster,
                                            image_opencv_input, window_name1)

        # Ternary assembling algorithm cnn function calling
        # Should remove image_opencv_input here to display info properly
        root_block_cnn = ternary_assembling_run(min_cnnx1, min_cnny1, max_cnnx2, max_cnny2,
                                                clusters_cnn, image_opencv_input, window_name1, fclusters_cnn)

        # Printing clusters function calling
        clusters_printing(root_block, fname, input_image=[])

        # HTML tree initialize function call
        root, outer_div, styles, parameters = htmltree_initialize(fname, bcolour_container_value, img_width)

        # Serializer only
        # Define the export node start
        outer_div_node = ScenarioElement.objects.create(
            parent=serializer_node,
            struct_type="container",
            parameters=parameters,
            styles=styles,
            buoyancy=0,
        )
        # Define the export node end

        # Obtaining the absolute path for the parameters directly. Should change this later.
        o = urlparse(self.context["request"].build_absolute_uri())
        # Detect elements for the root block
        elements_rootblock(root_block, styles_on, region_dataset, img_width, img_height, outer_div,
                           image_original, fname, o, serializing="virtualize_simple")
        # Serializer only
        elements_rootblock_create(root_block, outer_div_node, serializing="virtualize_simple")

        # Detect elements for the root block double cnn
        elements_rootblock(root_block_cnn, styles_on, region_dataset, img_width, img_height, outer_div,
                           image_original, fname, o, serializing="virtualize_simple")
        # Serializer only cnn
        elements_rootblock_create(root_block_cnn, outer_div_node, serializing="virtualize_simple")

        '''
        # Detect elements for the root block triple
        elements_rootblock(root_block, styles_on, region_dataset, img_width, img_height, outer_div,
                           image_original, fname, o, serializing="virtualize_simple")
        # Serializer only
        elements_rootblock_create(root_block, outer_div_node, serializing="virtualize_simple")
        '''

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
        shutil.make_archive(SAVE_DIR, "zip", SAVE_DIR)
        zip_archive_name = fname + ".zip"

        # serializer_node.parameters["html"] = html
        # Obtaining the absolute path for the parameters directly. Should change this later.
        o = urlparse(self.context["request"].build_absolute_uri())
        serializer_node.parameters["archive"] = (
            "https://" + o.netloc + MEDIA_URL + zip_archive_name
        )

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

        # Define styles variable switching on, this variable is placed at parameters with other serializers as a flag
        styles_on = 1
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
        image_firstclusters = copy.deepcopy(image_opencv_input)
        image_fdict_before = copy.deepcopy(image_opencv_input)
        image_fdict_after = copy.deepcopy(image_opencv_input)
        image_dbclusters = copy.deepcopy(image_opencv_input)

        # Create a directory to save cluters for some image processed
        SAVE_DIR = os.path.join(MEDIA_ROOT, fname)
        find_or_create_dir(SAVE_DIR)

        os.chmod(SAVE_DIR, 0o755)
        os.chdir(SAVE_DIR)

        # detect height and width of the image
        img_height, img_width, img_channels = image_opencv_input.shape
        # Read an image with OpenCV end

        # Get(take the whole image) the dominant colour for the parent container
        bcolour_container_value = "255,255,255,0"
        domcolour_container = get_dominant_colour(image_opencv_input)[0]
        domcolour_container.append(1)
        bcolour_container_value = ",".join(str(int(x)) for x in domcolour_container)

        window_name1 = "image_opencv_text"
        # Create the opencv recognition end

        #
        #
        # Here is the divergency point between images and footers
        # Create the recognized_elements array start
        if imgpath:
            # These calculations should be moved to the previous serializer later
            # Maybe write this to the parameters
            fsize = str(os.path.getsize(imgpath))
            fnamesize = fname + fsize

        # Read the region annotation from parameters
        fdict = None
        if validated_data.get("parameters"):
            try:
                fdict = validated_data["parameters"]["annotation"]
            except Exception:
                pass

        if fdict:
            fdict = json.loads(fdict)
            # fdict = fdict
            # print(type(fdict), fdict)
            # Assembling start
            # Supplementary parameters calculation and printing of the fdict function call
            min_x1, min_y1, max_x2, max_y2 = supplement_fdict_calc_printing(fdict, fname, fnamesize, img_width, img_height)

            # Calculate the excluded indices to remove overlapped elements function calling
            # Show the output before the indices exclusion
            print("fdict_before", fdict)
            for idx, region in enumerate(fdict[fnamesize]["regions"]):
                x1 = int(region["shape_attributes"]["x"])
                y1 = int(region["shape_attributes"]["y"])
                x2 = int(x1 + region["shape_attributes"]["width"])
                y2 = int(y1 + region["shape_attributes"]["height"])

                if len(image_fdict_before):
                    # Show VIA annotated regions on image
                    cv2.rectangle(image_fdict_before, (x1, y1), (x2, y2), (255, 0, 0), 1)

            # Printing image_fdict_before to file
            if len(image_fdict_before):
                imgpath = MEDIA_ROOT + "/uploads/" + "fdict_before_" + fname
                cv2.imwrite(imgpath, image_fdict_before)

            # The indices exclusion should be added to the firstclusters calculation
            # calculate_excluded_indices(fdict, fnamesize)

            # Show the output after the indices exclusion
            print("fdict_after", fdict)
            for idx, region in enumerate(fdict[fnamesize]["regions"]):
                x1 = int(region["shape_attributes"]["x"])
                y1 = int(region["shape_attributes"]["y"])
                x2 = int(x1 + region["shape_attributes"]["width"])
                y2 = int(y1 + region["shape_attributes"]["height"])

                if len(image_fdict_after):
                    # Show VIA annotated regions on image
                    cv2.rectangle(image_fdict_after, (x1, y1), (x2, y2), (255, 0, 0), 1)

            # Printing image_fdict_before to file
            if len(image_fdict_after):
                imgpath = MEDIA_ROOT + "/uploads/" + "fdict_after_" + fname
                cv2.imwrite(imgpath, image_fdict_after)

            # Here should write firstclusters detecting step
            # How to detect firstclusters from fdict?
            # Maybe use this function for the first time
            # calculate_ocvclusters(fdict, fnamesize)
            root_firstcluster = calculate_firstclusters(fdict, fname, fnamesize, serializer_node, img_height, img_width, image_firstclusters)

            # Elements-based clusters printing
            for pre, fill, node in RenderTree(root_firstcluster):
                treestr = u"%s%s" % (pre, node.name)
                print(treestr.ljust(8), node.element_assigned,node.types, (node.x1, node.y1), (node.x2, node.y2))
                cv2.rectangle(image_firstclusters, (node.x1, node.y1), (node.x2, node.y2), (20, 50, 107), 1)

            # Printing firstclusters to file
            if len(image_firstclusters):
                imgpath = SAVE_DIR + "/firstclusters_" + fname
                print(SAVE_DIR)
                print(imgpath)

                cv2.imwrite(imgpath, image_firstclusters)

            root_firstcluster = firstclusters_elements_chains_processing(root_firstcluster, fname)

            # Elements-based clusters printing
            for pre, fill, node in RenderTree(root_firstcluster):
                treestr = u"%s%s" % (pre, node.name)
                print(treestr.ljust(8), node.element_assigned,node.types, (node.x1, node.y1), (node.x2, node.y2))
                cv2.rectangle(image_firstclusters, (node.x1, node.y1), (node.x2, node.y2), (20, 50, 107), 1)

            # Calculate fclusters function calling
            root_firstcluster = calculate_fclusters(root_firstcluster, fname)

            # Elements-based clusters printing
            for pre, fill, node in RenderTree(root_firstcluster):
                treestr = u"%s%s" % (pre, node.name)
                print(treestr.ljust(8), node.element_assigned,node.types, (node.x1, node.y1), (node.x2, node.y2))
                cv2.rectangle(image_firstclusters, (node.x1, node.y1), (node.x2, node.y2), (20, 50, 107), 1)

            # Call the fclusters printing
            print_clusters_length(root_firstcluster)

            '''
            # Remove fclusters which are contradictive with firstclusters (overlap) start
            for cluster in clusters:
                if (len(cluster.elements) > 2):  # Fclusters should contain 2 and more elements
                    rectangle_fcluster = (cluster.x1, cluster.y1, cluster.x2, cluster.y2)
                    for pre, fill, node in RenderTree(root_firstcluster):
                        rectangle_firstcluster = (node.x1, node.y1, node.x2, node.y2)
                        if node != root_firstcluster:
                            if(isRectangleOverlap_nonnested(rectangle_fcluster, rectangle_firstcluster)):
                                clusters.remove(cluster)
                                break
            # Remove fclusters which are contradictive with firstclusters (overlap) end
            '''

            if region_dataset in ["headers", "footers", "webpages"]:
                # Calculate dbclusters function calling
                dbclusters = calculate_dbclusters(region_dataset, root_firstcluster, fname, image_dbclusters)

                '''
                # Remove dbclusters which are contradictive with firstclusters (overlap, contains probably)
                # Remove dbclusters which are contradictive with firstclusters (overlap) start
                for cluster in dbclusters:
                        rectangle_dbcluster = (cluster.x1, cluster.y1, cluster.x2, cluster.y2)
                        for pre, fill, node in RenderTree(root_firstcluster):
                            rectangle_firstcluster = (node.x1, node.y1, node.x2, node.y2)
                            if (node != root_firstcluster) and (not node.is_leaf):
                                if (isRectangleOverlap_nonnested(rectangle_dbcluster, rectangle_firstcluster)):
                                    # print(len(dbclusters), rectangle_dbcluster)
                                    dbclusters.remove(cluster)
                                    break
                # Remove dbclusters which are contradictive with firstclusters (overlap) end
                '''

                # DBclusters should be added to firstclusters in an appropriate order
                # First it is possible to remove dbclusters which were placed in firstclusters
                # In this case, dbclusters should be added to the root_firstcluster as a final firstclusters
                # After that, cclusters should be calculated on the top firstclusters, just after the root_firstcluster

            '''
            try:
                # Replace clusters for dbclusters if possible
                fclusters = copy.copy(clusters)
                clusters = dbclusters
            except Exception:
                pass
            finally:
                pass
            '''

            # print("before: ")
            # for pre, fill, node in RenderTree(root_firstcluster):
            #     if node.types:
            #         print(node.types)
            # Do the containerization based on firstclusters and dbclusters, they should be both merged to clusters
            root_block = ternary_assembling_run(min_x1, min_y1, max_x2, max_y2, root_firstcluster, image_opencv_input,
                                                window_name1)

            # Elements-based clusters printing
            for pre, fill, node in RenderTree(root_block):
                treestr = u"%s%s" % (pre, node.name)
                print(treestr.ljust(8), node.element_assigned,node.types, (node.x1, node.y1), (node.x2, node.y2))


            # Create a directory to save HTML for some image processed
            SAVE_DIR = os.path.join(MEDIA_ROOT, fname)
            find_or_create_dir(SAVE_DIR)

            os.chdir(SAVE_DIR)

            # HTML tree initialize function call
            root, outer_div, styles, parameters = htmltree_initialize(fname, bcolour_container_value, img_width)

            # Define the export node
            outer_div_node = ScenarioElement.objects.create(
                parent=serializer_node,
                struct_type="container",
                parameters=parameters,
                styles=styles,
                buoyancy=0,
            )
            # print("after: ")
            # for pre, fill, node in RenderTree(root_block):
            #     if node.types:
            #         print(node.types)

            # Printing clusters function calling
            clusters_printing(root_block, root_firstcluster, fname, input_image=image_opencv_input)

            # Obtaining the absolute path for the parameters directly. Should change this later.
            o = urlparse(self.context["request"].build_absolute_uri())
            # Detect elements for the root block
            elements_rootblock(root_block, styles_on, region_dataset, img_width, img_height, outer_div,
                               image_original, fname, o, serializing="assemble")
            # Serializer only
            elements_rootblock_create(root_block, outer_div_node, serializing="assemble")

        return serializer_node


class ScenarioElementFreecanvasSerializer(serializers.ModelSerializer):
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
        # Nested elements should be detected at the free canvas

        # Define styles variable switching on, this variable is plased at parameters with other serializers as a flag
        styles_on = 1
        # Pre-Root element assignment
        element_root_pre = ScenarioElement.objects.get(id=validated_data["parent_id"])

        # Extract an appropriate flag value to recognize block as header, footer, form or layout
        # Region dataset has some starting value
        region_dataset = "footers"

        # Create the root element mptt for the containers generated start
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
        '''
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
        '''

        #
        #
        # Here is the divergency point between images and footers

        # Read the region annotation from parameters
        fdict = {}

        fname = element_root_pre.name
        fsize = '0'
        fnamesize = fname + fsize

        fdict[fnamesize] = {
            "filename": fname,
            "size": fsize,
            "regions": [],
            "file_attributes": {},
        }

        # Define root canvas width and height, based on layout parameter
        # Mobile devices
        if element_root_pre.parameters["layouts"] == "mobile":
            img_height, img_width = 320, 736

        # Tablet devices
        elif element_root_pre.parameters["layouts"] == "tablet":
            img_height, img_width = 768, 1024

        # Desktop devices
        elif element_root_pre.parameters["layouts"] == "desktop":
            img_height, img_width = 800, 1280

        # Other devices
        else:
            img_height, img_width = 800, 1280

        # This initialises an RGB-image that is just black (with two instances)
        image_opencv_input = np.zeros((img_height, img_width, 3), np.uint8)
        image_original = np.zeros((img_height, img_width, 3), np.uint8)
        image_allclusters = np.zeros((img_height, img_width, 3), np.uint8)

        # Go through all the input elements
        # Construct fdict.
        # Top level children should be extracted first. Later this should be improved to process nested components.
        # print(element_root_pre)
        # print(element_root_pre.name)
        children = element_root_pre.get_children()
        for child in children:
            if (child.parameters):
                print(child, child.parameters)
                print(child, child.parameters["layouts"], child.parameters["freeCanvas"])
                # Fill the attributes dictionary
                attributes_dict = {
                    "shape_attributes": {
                        "name": "rect",
                        "x": child.parameters["freeCanvas"]["left"],
                        "y": child.parameters["freeCanvas"]["top"],
                        "width": child.parameters["freeCanvas"]["width"],
                        "height": child.parameters["freeCanvas"]["height"],
                    },
                    "region_attributes": {"HTML element": child.struct_type},
                }

                fdict[fnamesize]["regions"].append(attributes_dict)

        if fdict:
            # Assembling start
            # Show text contours on image start
            window_name1 = "image_opencv_text"
            # Supplementary parameters calculation and printing of the fdict function call
            min_x1, min_y1, max_x2, max_y2 = supplement_fdict_calc_printing(fdict, fname, fnamesize, img_width, img_height)
            '''
            # Supplementary parameters calculation and printing of the fdict start
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

                # cv2.rectangle(image_opencv_input, (x1, y1), (x2, y2), (255, 0, 0), 1)
            # Display raw regions input before clustering
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
            # Cropping the image is essential for further OCR applying.
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
            # # Displaying an outer border
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
            # Supplementary parameters calculation and printing of the fdict end
            '''

            # Calculate the excluded indices to remove overlapped elements function calling
            calculate_excluded_indices(fdict, fnamesize)

            # Calculate fclusters function calling
            clusters = calculate_fclusters(fdict, fnamesize, fname)

            if region_dataset in ["headers", "footers", "webpages"]:
                # Calculate dbclusters function calling
                dbclusters = calculate_dbclusters(region_dataset, clusters, fname)

            try:
                # Replace clusters for dbclusters if possible
                fclusters = copy.copy(clusters)
                clusters = dbclusters
            except Exception:
                pass
            finally:
                pass

            root_block = ternary_assembling_run(min_x1, min_y1, max_x2, max_y2, clusters, image_opencv_input,
                                                window_name1, fclusters)

            # Create a directory to save HTML for some image processed
            SAVE_DIR = os.path.join(MEDIA_ROOT, fname)
            find_or_create_dir(SAVE_DIR)

            os.chdir(SAVE_DIR)

            # Printing clusters function calling
            # clusters_printing(root_block, fname, image_allclusters=image_allclusters)

            # Define bcolour_container_value for the free canvas
            bcolour_container_value = "255,255,255,0"
            # HTML tree initialize function call
            root, outer_div, styles, parameters = htmltree_initialize(fname, bcolour_container_value, img_width)

            # Define the export node
            outer_div_node = ScenarioElement.objects.create(
                parent=serializer_node,
                struct_type="container",
                parameters=parameters,
                styles=styles,
                buoyancy=0,
            )

            # Obtaining the absolute path for the parameters directly. Should change this later.
            o = urlparse(self.context["request"].build_absolute_uri())
            # Detect elements for the root block
            elements_rootblock(root_block, styles_on, region_dataset, img_width, img_height, outer_div,
                               image_original, fname, o, serializing="freecanvas")
            # Serializer only
            elements_rootblock_create(root_block, outer_div_node, serializing="freecanvas", children=children)
        return serializer_node
