import json
from contextlib import redirect_stdout

import cv2
import pytesseract
import requests

import os

from keras.preprocessing.image import load_img
from keras_preprocessing.image import img_to_array

from statistics import median

import numpy as np

from apps.utils.object_detection import (
    run_text_detection,
    get_rect_contours,
)

from apps.utils.fset1 import (
    calculateDistance,
    SQUARES_OVERLAP_THRESHOLD_CONTOUR,
)

# This should be changed for the command line interface
from project.settings import (
    model_forms,
    model_headers,
    model_footers,
)


# Writing the element text value based on its id
def write_elem_value(region_dataset, class_id_recognized):
    element = "image"
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

    return element


def detect_font_size(image_opencv_input):
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

    return font_size_img


def detect_contours_filter_after(image_opencv_input, img_height, img_width):
    # Detect text contours and rectangles on image start
    text_contours = run_text_detection(image_opencv_input, text=False)
    rect_contours = get_rect_contours(image_opencv_input)

    # Filter the text_contours
    # Todo: improve this
    # At least this text blocks filtering is not reasonable for the webpages
    for text_contour in text_contours:
        # Remove untypically high text blocks
        width2 = text_contour[2]
        height2 = text_contour[3]
        # if height2 > (font_size_img * 3):
        #     text_contours.remove(text_contour)
        if height2 > width2:
            text_contours.remove(text_contour)

    # Filter the rect_contours
    for rect_contour in rect_contours:
        # Remove untypically large rect blocks
        width2 = rect_contour[2]
        height2 = rect_contour[3]
        if (width2 * height2) > (img_height * img_width) * 0.75:
            rect_contours.remove(rect_contour)
    # Detect text contours and rectangles on image end

    return text_contours, rect_contours


'''
# Detecting checkboxes
# https://www.fuzzylabs.ai/blog-post/checkbox-detection-with-opencv
# https://github.com/fuzzylabs/jupyter-delicacies/blob/master/vision/object-detection.ipynb
def is_contour_square(contour, contour_tolerance=0.0015, square_side=25, area_tolerance=200):
    expected_area = square_side * square_side
    area = cv2.contourArea(contour)
    template = np.array([[[0, 0]], [[0, 1]], [[1, 1]], [[1, 0]]], dtype=np.int32)
    return cv2.matchShapes(template, contour, 3, 0.0) <= contour_tolerance and abs(area - expected_area) <= area_tolerance
'''


# Detecting checkboxes
def is_checkbox(contour, square_side=18, area_tolerance=200):
    expected_area = square_side * square_side
    area = contour[2] * contour[3]

    return abs(area - expected_area) <= area_tolerance


def print_contours(text_contours, rect_contours, region_dataset, choice = "OpenCV", r=[]):
    regions_list = []
    # Print all the contours to the list
    # Format the list Via-like
    # result = {"text": text_contours, "rect": rect_contours}
    if (choice == "OpenCV"):
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
                "region_attributes": {"HTML element": element, "Element source": "opencv"},
            }
            # fdict[fnamesize]["regions"].append(attributes_dict)
            regions_list.append(attributes_dict)
        # Printing text contours preparations end

        # Printing rect contours preparations start
        for rect_contour in rect_contours:
            x, y, w, h = rect_contour
            # location = i.location  # y, x
            # size = i.size  # width, height
            element = "container"
            # element = "image"
            # Detect checkboxes
            if (is_checkbox(rect_contour)):
                element = "checkbox"

            # Fill the attributes dictionary
            attributes_dict = {
                "shape_attributes": {
                    "name": "rect",
                    "x": int(x),
                    "y": int(y),
                    "width": int(w),
                    "height": int(h),
                },
                "region_attributes": {"HTML element": element, "Element source": "opencv"},
            }
            # fdict[fnamesize]["regions"].append(attributes_dict)
            regions_list.append(attributes_dict)
            # Printing rect contours preparations end

    if (choice == "MaskRCNN"):
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
                "region_attributes": {"HTML element": element, "Element source": "maskrcnn"},
            }
            regions_list.append(attributes_dict)
        # Printing contours with mask r cnn only end

    if (choice == "AND"):
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
                "region_attributes": {"HTML element": element, "Element source": "opencv"},
            }
            # fdict[fnamesize]["regions"].append(attributes_dict)
            regions_list.append(attributes_dict)
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
                "region_attributes": {"HTML element": element, "Element source": "opencv, maskrcnn"},
            }
            regions_list.append(attributes_dict)
        # Printing rect contours with concatenation preparations end

    if choice == "OR":
        # Here was applied a simplification
        # OR comparison should be improved
        # 1. save all the rect_contours from the AND
        # 2. find all the unique Mask R CNN contours (both non-text and text) and save them
        # 3. find all the unique OpenCV contours (both non-text and text) and save them
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
                "region_attributes": {"HTML element": element, "Element source": "opencv"},
            }
            # fdict[fnamesize]["regions"].append(attributes_dict)
            regions_list.append(attributes_dict)
        # Printing text contours preparations end

        # Printing rect contours preparations start
        for rect_contour in rect_contours:
            x, y, w, h = rect_contour
            # location = i.location  # y, x
            # size = i.size  # width, height
            element = "container"
            # element = "image"

            # Fill the attributes dictionary
            attributes_dict = {
                "shape_attributes": {
                    "name": "rect",
                    "x": int(x),
                    "y": int(y),
                    "width": int(w),
                    "height": int(h),
                },
                "region_attributes": {"HTML element": element, "Element source": "opencv"},
            }
            # fdict[fnamesize]["regions"].append(attributes_dict)
            regions_list.append(attributes_dict)
        # Printing rect contours preparations end

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
                "region_attributes": {"HTML element": element, "Element source": "maskrcnn"},
            }
            regions_list.append(attributes_dict)
        # Printing contours with mask r cnn only end

    return regions_list


def create_recognized_elements(imgpath, rect_contours, text_contours, region_dataset, fname):
    # Create the recognized_elements array start

    fdict = {}  # Output dictionary to write annotation
    fordict = {}  # Output dictionary to write annotation
    cnndict = {}  # Output dictionary to write annotation
    opencvdict = {}  # Output dictionary to write annotation

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

    # Prepare a dictionary (OpenCV) to store recognized shapes
    opencvdict[fnamesize] = {
        "filename": fname,
        "size": fsize,
        "regions": [],
        "file_attributes": {},
    }

    # Window name for printing
    window_name1 = "image_opencv_text"

    # Detect elements for the case of "forms", "headers", "footers"
    if region_dataset in {"forms", "headers", "footers"}:
        # results = model_forms.detect([img], verbose=1)
        # Request the external MaskRCNN API
        # call another api for POST
        url = 'https://api-staging.adevi.info/api/v1/virtualize_simple/maskrcnn/' # The staging
        data = {"image":imgpath,"block_type":region_dataset}  # post data
        api_call = requests.post(url, headers={}, data=data)
        # print(api_call.content)
        # print(api_call.json())
        results = json.loads(api_call.content)

        # Results of the Mask R CNN recognition
        # r = results[0]
        r = results
        # Detect elements with Mask R CNN model end

        # Printing 4 dictionaries start
        regions_list = print_contours(text_contours, rect_contours, region_dataset, choice = "AND", r=r)
        fdict[fnamesize]["regions"] = regions_list

        regions_list = print_contours(text_contours, rect_contours, region_dataset, choice = "OR", r=r)
        fordict[fnamesize]["regions"] = regions_list

        regions_list = print_contours(text_contours, rect_contours, region_dataset, choice = "OpenCV", r=r)
        opencvdict[fnamesize]["regions"] = regions_list

        regions_list = print_contours(text_contours, rect_contours, region_dataset, choice = "MaskRCNN", r=r)
        cnndict[fnamesize]["regions"] = regions_list
        # Printing 4 dictionaries end

    # Detect elements for the case of "webpages"
    if region_dataset in {"webpages"}:
        regions_list = print_contours(text_contours, rect_contours, region_dataset, choice = "OpenCV", r=[])
        fdict[fnamesize]["regions"] = regions_list

        # At this case, fdict is equal to fordict and opencvdict. cnndict is empty
        fordict = opencvdict = fdict

    # Create the recognized_elements array end
    return fdict, fordict, opencvdict, cnndict


def pipeline_merge(imgpath, region_dataset, fname):
    # Read an image with OpenCV start
    image_opencv_input = cv2.imread(imgpath)

    # print(fname, imgpath, image_opencv_input)
    # image_original = copy.deepcopy(image_opencv_input)

    # detect height and width of the image
    img_height, img_width, img_channels = image_opencv_input.shape
    # Read an image with OpenCV end

    # Detect the font-size with tesseract for the whole image
    # Maybe apply the whole OCR here
    # font_size_img = detect_font_size(image_opencv_input)

    # Get(take the whole image) the dominant colour for the parent container
    '''
    bcolour_container_value = "255,255,255,0"
    domcolour_container = get_dominant_colour(image_opencv_input)[0]
    domcolour_container.append(1)
    bcolour_container_value = ",".join(str(int(x)) for x in domcolour_container)
    '''

    # Detect text contours and rectangles on image and filtering them
    text_contours, rect_contours = detect_contours_filter_after(image_opencv_input, img_height, img_width)
    # Create the opencv recognition end

    # Create the recognized_elements array. The main part of the recognition
    fdict, fordict, opencvdict, cnndict = create_recognized_elements(imgpath, rect_contours, text_contours, region_dataset, fname)
    # Save the annotation dictionary with saved shapes to the json
    sdj = {"fdict": fdict, "fordict": fordict, "opencvdict": opencvdict, "cnndict": cnndict}

    return sdj
