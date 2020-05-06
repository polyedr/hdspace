import copy
import re
import numpy as np
from copy import deepcopy

from project.settings import model, MEDIA_ROOT
from rest_framework import serializers
from apps.projects.models import ScenarioElement, ScreenScenario
from sklearn.cluster import KMeans
from collections import Counter
import cv2
import pytesseract
from pytesseract import Output

from keras.preprocessing.image import load_img
from keras_preprocessing.image import img_to_array

config_tesseract = "-l eng --oem 1 --psm 3"

f_dictionary = {
    "username": [
        "username",
        "user",
        "username",
        "alias",
        "nickname",
        "first-last",
        "full",
        "name",
    ],
    "phone": ["phone", "telephone", "mobile"],
    "email": ["email", "e-mail"],
    "password": ["password"],
    "firstname": ["firstname", "first"],
    "lastname": ["lastname", "last", "surname"],
    "day": ["day"],
    "month": ["month"],
    "year": ["year"],
}

# The constant to remove rectangle when overlaps more than 90% with larger rectangle
SQUARES_OVERLAP_THRESHOLD = 0.9
# The constant to remove text rectangle when overlaps more than 5% with larger rectangle
SQUARES_OVERLAP_THRESHOLD_TEXT = 0.05

# The constant to calculate horizontal overlap during the vertical groups detection
VERICAL_GROUPS_HORIZONTAL_OVERLAP_THRESHOLD = 0.75

# The constant to calculate vertical overlap during the horizontal groups detection
HORIZONTAL_GROUPS_VERICAL_OVERLAP_THRESHOLD = 0.25


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


def get_dominant_colour(image, k=4, image_processing_size=None):
    """
    takes an image as input
    returns the dominant color of the image as a list

    dominant color is found by running k means on the
    pixels & returning the centroid of the largest cluster

    processing time is sped up by working with a smaller image;
    this resizing can be done with the image_processing_size param
    which takes a tuple of image dims as input

    get_dominant_colour(my_image, k=4, image_processing_size = (25, 25))
    [56.2423442, 34.0834233, 70.1234123]
    """
    # resize image if new dims provided
    if image_processing_size is not None:
        image = cv2.resize(image, image_processing_size,
                           interpolation=cv2.INTER_AREA)

    # reshape the image to be a list of pixels
    image = image.reshape((image.shape[0] * image.shape[1], 3))

    # cluster and assign labels to the pixels
    clt = KMeans(n_clusters=k)
    labels = clt.fit_predict(image)

    # count labels to find most popular
    label_counts = Counter(labels)

    # subset out most popular centroid
    dominant_colour = clt.cluster_centers_[label_counts.most_common(1)[0][0]]

    return list(dominant_colour)

"""
# Find regions that might have text in them
def get_blocks(img):
    img_blur = cv2.medianBlur(img, 5).astype('uint8')
    try:
        gray = cv2.cvtColor(img_blur, cv2.COLOR_BGR2GRAY)
    except Exception as ex:
        print(ex)
        return
    # Performing OTSU threshold
    ret, thresh1 = cv2.threshold(gray, 0, 255, cv2.THRESH_OTSU | cv2.THRESH_BINARY_INV)
    # Specify structure shape and kernel size.
    # Kernel size increases or decreases the area
    # of the rectangle to be detected.
    # A smaller value like (10, 10) will detect
    # each word instead of a sentence.
    rect_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (10, 7))
    # Appplying dilation on the threshold image
    dilation = cv2.dilate(thresh1, rect_kernel, iterations = 2)
    image, contours, hierarchy = cv2.findContours(dilation, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    return contours

# Cut image into regions and detect text separately
def get_text_from_cropped(img, contours):
    # Creating a copy of image
    im2 = img.copy()
    im2_blur = cv2.medianBlur(im2, 5).astype('uint8')
    all_contours = []
    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        # Cropping the text block for giving input to OCR
        cropped = im2_blur[y:y + h, x:x + w]
        # cv2_imshow(cropped)
        text_contours = get_text_contours(cropped)
        # If no text is recognised, crop the region a bit and try detection again
        if len(text_contours) < 1:
            h, w, _ = cropped.shape
            h -= 10
            w -= 10
            new_cropped = cropped[5:5 + h, 5:5 + w]
            try:
                cropped_inv = cv2.bitwise_not(new_cropped)
                gray = cv2.cvtColor(cropped_inv, cv2.COLOR_BGR2GRAY)
                ret, thresh1 = cv2.threshold(gray, 0, 255, cv2.THRESH_OTSU | cv2.THRESH_BINARY_INV)
                cropped_inv_thresh = cv2.cvtColor(thresh1,cv2.COLOR_GRAY2RGB)
            except Exception as ex:
                print('troubles modifying cropped image... {}'.format(ex))
                continue
            text_contours = get_text_contours(cropped_inv_thresh, size=(3,3), iterations=5)
            # If cropping didn't help, come to terms and omit this region
            if len(text_contours) < 1:
                pass
                # print('text not recognised')
                # show(new_cropped)
            else:
                for c in text_contours:
                    x1, y1, w1, h1 = cv2.boundingRect(c)
                    x1 = x1 + x + 5
                    y1 = y1 + y + 5
                    rect = (x1, y1, w1, h1)
                    all_contours.append(rect)

        else:
            for c in text_contours:
                x1, y1, w1, h1 = cv2.boundingRect(c)
                x1 = x1 + x
                y1 = y1 + y
                rect = (x1, y1, w1, h1)
                all_contours.append(rect)
    return all_contours


# Find text in an image
def get_text_contours(img, size=(3,3), iterations=5):
    # img_blur = cv2.medianBlur(img, 5).astype('uint8')
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    lower = np.array([0, 0, 0])
    upper = np.array([230, 230, 230])
    mask = cv2.inRange(hsv, upper, upper)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    kernel = np.array([[-1,-1,-1], [-1,9,-1], [-1,-1,-1]])
    im = cv2.filter2D(gray, -1, kernel).astype(np.uint8)
    ret,thresh = cv2.threshold(im,127,255,cv2.THRESH_OTSU|cv2.THRESH_BINARY_INV)
    # show(thresh)

    im_height, im_width, _ = img.shape
    d = pytesseract.image_to_data(thresh, lang='eng', output_type=Output.DICT)
    n_boxes = len(d['level'])
    for i in range(n_boxes):
        if len(d['text'][i].strip(' —|*vy')) < 1: continue
        # else: print(d['text'][i])
        (x, y, w, h) = (d['left'][i], d['top'][i], d['width'][i], d['height'][i])
        if w==h: continue
        cv2.rectangle(mask, (x, y), (x + w, y + h), (255, 255, 255), 1)
    # print('test mask with text blocks')
    # show(mask)
    rect_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, size)
    dilation = cv2.dilate(mask, rect_kernel, iterations = iterations)
    # print('dilation')
    # show(dilation)

    image, contours, hierarchy = cv2.findContours(dilation, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    text_contours = []
    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        text_contours.append(cnt)
    # show(im2)
    return text_contours


# Text recognition itself
def run_detection(img):
    # show(img)
    contours = get_blocks(img)
    if not contours:
        print('troubles working with image')
    else:
        all_contours = get_text_from_cropped(img, contours)
        return all_contours
"""


class ScenarioElementSerializer(serializers.ModelSerializer):
    parameters = serializers.JSONField()
    styles = serializers.JSONField()

    class Meta:
        model = ScenarioElement
        fields = (
            "id",
            "scenario",
            "name",
            "struct_type",
            "func_type",
            "buoyancy",
            "parameters",
            "styles",
        )


class ScreenScenarioSerializer(serializers.ModelSerializer):
    parameters = serializers.JSONField()
    styles = serializers.JSONField()

    class Meta:
        model = ScreenScenario
        fields = (
            "id",
            "screen",
            "name",
            "parent_id",
            "type",
            "struct_type",
            "direction",
            "buoyancy",
            "elements",
            "parameters",
            "styles",
            "image",
        )
        extra_kwargs = {"elements": {"read_only": True}, "image": {"write_only": True}}

    def create(self, validated_data):
        global bcolour_scenario_value, bcolour_element_value
        scenario_data = {
            "name": "scenario_general",
            "type": "login",
            "struct_type": "container",
            "parameters": {},
            "styles": {},
            "parent_id": -1,
        }

        """
        Scenarioelements for the current scenario.
        These elements are obtained from CNN OCR.
        """
        screen = validated_data["screen"]

        # Root scenario assignment
        r_scenario = ScreenScenario.objects.filter(
            screen=screen, parent_id=-1
        ).first()

        if r_scenario:
            scenario_data["parent_id"] = r_scenario.pk
        else:
            scenario_data["name"] = "Root"
            scenario_data["struct_type"] = "scenario"

        imgpath = ""
        if validated_data.get("image"):
            scenario = ScreenScenario.objects.create(
                screen=screen, image=validated_data["image"], **scenario_data
            )
            imgpath = MEDIA_ROOT + "/uploads/" + str(validated_data["image"])
        else:
            scenario = ScreenScenario.objects.create(screen=screen, **scenario_data)

        recognized_elements = []
        if imgpath:
            img = load_img(imgpath)
            img = img_to_array(img)

            # Get the dominant colour for the parent scenario(take the whole image)
            bcolour_scenario_value = '255,255,255,0'
            domcolour_scenario = get_dominant_colour(img)
            domcolour_scenario.append(1)
            bcolour_scenario_value = ','.join(str(int(x)) for x in domcolour_scenario)

            results = model.detect([img], verbose=1)
            r = results[0]

            # For the overlapped text, should remove the largest regions related to the text first
            # Or detect the text for these blocks with opencv and re-calculate the borders
            # First fill the list excluded_indices for the text elements only
            excluded_indices = []
            for idx1, (rect1, class_id1) in enumerate(zip(r["rois"], r["class_ids"])):
                for idx2, (rect2, class_id2)  in enumerate(zip(r["rois"], r["class_ids"])):
                    if (idx1 < idx2) and (class_id1 == 3) and (class_id2 == 3): # 3 means the text class
                        x1 = rect1[1]
                        y1 = rect1[0]
                        x2 = rect1[3]
                        y2 = rect1[2]
                        x3 = rect2[1]
                        y3 = rect2[0]
                        x4 = rect2[3]
                        y4 = rect2[2]

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

                            if (square > square1 * SQUARES_OVERLAP_THRESHOLD_TEXT) or (
                                square > square2 * SQUARES_OVERLAP_THRESHOLD_TEXT
                            ):
                                # Remove the largest text block
                                if square1 < square2:
                                    excluded_indices.append(idx2)
                                else:
                                    excluded_indices.append(idx1)
                            elif square > square1 * SQUARES_OVERLAP_THRESHOLD_TEXT:
                                excluded_indices.append(idx2)
                            elif square > square2 * SQUARES_OVERLAP_THRESHOLD_TEXT:
                                excluded_indices.append(idx1)


            # Second, calculate the non-text blocks overlap
            # Calculation of the excluded indices to remove overlapped elements
            # excluded_indices = []
            for idx1, rect1 in enumerate(r["rois"]):
                for idx2, rect2 in enumerate(r["rois"]):
                    if (idx1 < idx2) and (idx1 not in excluded_indices) and (idx2 not in excluded_indices):
                        x1 = rect1[1]
                        y1 = rect1[0]
                        x2 = rect1[3]
                        y2 = rect1[2]
                        x3 = rect2[1]
                        y3 = rect2[0]
                        x4 = rect2[3]
                        y4 = rect2[2]

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

                            if (square > square1 * SQUARES_OVERLAP_THRESHOLD) or (
                                square > square2 * SQUARES_OVERLAP_THRESHOLD
                            ):
                                if square1 < square2:
                                    excluded_indices.append(idx1)
                                else:
                                    excluded_indices.append(idx2)
                            elif square > square1 * SQUARES_OVERLAP_THRESHOLD:
                                excluded_indices.append(idx1)
                            elif square > square2 * SQUARES_OVERLAP_THRESHOLD:
                                excluded_indices.append(idx2)

            for idx, (roi, class_id, score) in enumerate(
                zip(r["rois"], r["class_ids"], r["scores"])
            ):
                if idx not in excluded_indices:
                    '''
                    Image recognition on the endpoint of a neural network.
                    Origin, point (0, 0) upper left corner.
                    Choose some element annotated with rectangle.
                    The upper left corner of the rectangle (x1, y1).
                    The bottom right corner of the rectangle (x2, y2).
                    Next, the assignment of values.
                    y1, x1, y2, x2 = roi
                    width_elem = x2 - x1
                    height_elem = y2 - y1
                    '''
                    '''
                    test
                    # Show the recognized elements with classes and probabilities
                    print(idx, roi, class_id, score)
                    '''

                    y1, x1, y2, x2 = roi
                    roi_our = img[y1:y2, x1:x2]

                    roi_our = cv2.resize(
                        roi_our, None, fx=0.95, fy=0.95, interpolation=cv2.INTER_CUBIC
                    )

                    # Get the dominant colour for the HTML element
                    bcolour_element_value = '255,255,255,0'
                    domcolour_element = get_dominant_colour(roi_our)
                    domcolour_element.append(1)
                    bcolour_element_value = ','.join(str(int(x)) for x in domcolour_element)

                    # Convert to the grey colour
                    roi_our = cv2.cvtColor(roi_our, cv2.COLOR_BGR2GRAY)

                    # Remove artifacts connected to image border
                    # This can decrease the prediction quality for images
                    # roi_our = clear_border(roi_our)
                    """
                    # Apply dilation and erosion to remove some noise
                    kernel = np.ones((1, 1), np.uint8)
                    roi_our = cv2.dilate(roi_our, kernel, iterations=1)
                    roi_our = cv2.erode(roi_our, kernel, iterations=1)
                    """
                    # Apply threshold to get image with only black and white
                    # roi_our = apply_threshold(roi_our, 20)
                    # print(pytesseract.image_to_string(roi_our))
                    """
                    # contours = get_blocks(roi_our)
                    contours = run_detection(roi_our)
                    print("contours:", contours, "class id:", class_id)
                    """

                    text = pytesseract.image_to_string(roi_our, config=config_tesseract)

                    width_elem = x2 - x1
                    height_elem = y2 - y1

                    # Detect the height and the width of the image
                    img_height, img_width, channels = img.shape

                    # Detect the alignment of the element
                    # Text-align: left, if the left interval is smaller than the right interval
                    aligned_element = "left"
                    if (x1 < (img_width - x2)):
                        aligned_element = "right"

                    # Middle if the middle point placed at the 20% middle width for the whole image
                    if ((x2 - x1) / 2 - (img_width / 2)) < img_width * 0.2:
                        aligned_element = "center"

                    func_type = "undefined"
                    letters_str = ""
                    # Check if class id is: 1 input, 2 button, 3 text or 4 select
                    if class_id in [1, 2, 3, 4]:
                        # Functional class assignment
                        # Input: string from tesseract, output: functional class of the element
                        tess_string = text.lower().split()

                        # The whole string format to process further
                        letters_str = text

                        fclasses_predictions = []
                        for ts in tess_string:
                            ts.strip()
                            ts = re.sub("[^@a-z A-Z]+", "", ts)
                            fclass = [
                                key
                                for key, value in f_dictionary.items()
                                if ts in value
                            ]
                            fclasses_predictions = fclasses_predictions + fclass

                        # Should choose the func_type from multiple predictions later
                        if fclasses_predictions:
                            func_type = fclasses_predictions[0]

                    # Input
                    if class_id == 1:
                        recognized_elements.append(
                            {
                                "struct_type": "textinput",
                                "func_type": func_type,
                                "parameters": {"placeholder": letters_str, "roi": roi},
                                "styles": {
                                    "width": str(width_elem) + "px",
                                    "height": str(height_elem) + "px",
                                    "background-color": "rgba(" + bcolour_element_value + ")",
                                },
                            }
                        )
                    # Button
                    if class_id == 2:
                        recognized_elements.append(
                            {
                                "struct_type": "button",
                                "func_type": "end_simple_scenario",
                                "parameters": {"textContent": letters_str, "roi": roi},
                                "styles": {
                                    "text-align": "center",
                                    "width": str(width_elem) + "px",
                                    "height": str(height_elem) + "px",
                                    "background-color": "rgba(" + bcolour_element_value + ")",
                                },
                            }
                        )
                    # Text. Change this later.
                    # Functional classes are title, description, label. How to assign them?
                    if class_id == 3:
                        # Set the description class for the default value
                        func_type = "description"
                        recognized_elements.append(
                            {
                                "struct_type": "ocrtext",
                                "func_type": func_type,
                                "parameters": {"textContent": text, "roi": roi},
                                "styles": {"text-align": aligned_element, "width": str(img_width) + "px",},
                                #
                                # "styles": {
                                #     "width": str(width_elem) + "px",
                                #     "height": str(height_elem) + "px",
                                #     "background-color": "rgba(" + bcolour_element_value + ")",
                                # },
                            }
                        )
                    # Select
                    if class_id == 4:
                        recognized_elements.append(
                            {
                                "struct_type": "select",
                                "func_type": func_type,
                                "parameters": {"textContent": letters_str, "roi": roi},
                                "styles": {
                                    "width": str(width_elem) + "px",
                                    "height": str(height_elem) + "px",
                                    "background-color": "rgba(" + bcolour_element_value + ")",
                                },
                            }
                        )
                    # Checkbox
                    if class_id == 5:
                        recognized_elements.append(
                            {
                                "struct_type": "checkbox",
                                "func_type": "checkbox",
                                "parameters": {"name": letters_str, "roi": roi, "defaultChecked": False},
                                "styles": {
                                    "width": str((width_elem + height_elem) / 2) + "px",
                                    "height": str((width_elem + height_elem) / 2) + "px",
                                    "margin-right": str((width_elem + height_elem) / 4) + "px",
                                    "background-color": "#555", # Define the default colour of the checkbox borders
                                },
                            }
                        )
                    # Radiobutton
                    if class_id == 6:
                        recognized_elements.append(
                            {
                                "struct_type": "radiobutton",
                                "func_type": "radiobutton",
                                "parameters": {"textContent": letters_str, "roi": roi},
                                "styles": {
                                    "width": str((width_elem + height_elem) / 2) + "px",
                                    "height": str((width_elem + height_elem) / 2) + "px",
                                    "margin-right": str((width_elem + height_elem) / 4) + "px",
                                    "background-color": "rgba(" + bcolour_element_value + ")",
                                },
                            }
                        )
                    # Image
                    if class_id == 7:
                        recognized_elements.append(
                            {
                                "struct_type": "image",
                                "func_type": "undefined",
                                "parameters": {"alt": letters_str, "roi": roi},
                                "styles": {
                                    "width": str(width_elem) + "px",
                                    "max-height": str(height_elem) + "px",
                                    "background-color": "rgba(" + bcolour_element_value + ")",
                                },
                            }
                        )
            '''
            test
            # Display the recognized_elements to the command line
            for recognized_element in recognized_elements:
                print(recognized_element)
            '''
            # Sort the recognized_elements, extract the y1 parameter
            # The roi order is y1, x1, y2, x2
            # recognized_elements = sorted(recognized_elements, key=lambda i: i["parameters"]["roi"][0])

            # Pass through all the rois. Find all the vertical grouping signals.
            # Find all the horizontal grouping signals.
            # First assign scenarios for the vertical grouping, second assign scenarios for the horizontal grouping,
            # For each vertical grouping the scenario should be assigned. Vertical grouping contains two elements:
            # first, input or select, and second, the text.
            # Scenarios of vertical grouping should be included to the scenarios of horizontal grouping if they exist
            # and finally to the resulted whole image scenario.
            # 1. Create scenarios for vertical groups. 2. Create scenarios for horizontal groups
            # (when element is in vertical group, take the whole vertical group)
            # Data structures here are lists of tuples for the vertically or horizonntally aligned elements
            # Vertically aligned: [(text0, input0), (text1, input1), ...]
            # Horizontally aligned: [(text2, input2), (input3, input4), ...]
            # Maybe that's possible to create scenarios for vertically and horizontally aligned
            # scenarios only after the elements creation.
            # That's possible to save positioning of all the elements if requested
            # The serializer input is list of scenarios, one of them is the whole image scenario.
            # Elements are distributed among these scenarios.
            #

            vertical_groups = {}
            vertical_groups_subset = {}
            horizontal_groups = {}
            # Inner scenarios elements list to remove them from recognized_elements
            # befpre the final assignment to the general scenario
            inner_scenarios_elements = set()
            for idx, recognized_element in enumerate(recognized_elements):
                for idx1, recognized_element1 in enumerate(recognized_elements):
                    # Vertical and horizontal groups detection
                    # Check the vertical grouping criteria
                    # Check the horizontal grouping criteria
                    # Assign the textContent values after grouping with text
                    # Vertical group when input or select element has another text element
                    # at the distance 0.5 from its width
                    # Horizontal group when input or select or text are placed horizontally

                    # Loop through all the rois
                    # Find all the close-by elements if one of them input (1) or select (4),
                    # and second one is the text (3)
                    # Horizontal overlap 75% of the element with minimal width
                    # Vertical max +- 50% for input/select width,
                    # middle of the text element should be within this interval
                    y1, x1, y2, x2 = recognized_element["parameters"]["roi"]
                    # The first rectangle width
                    width_elem = x2 - x1
                    height_elem = y2 - y1

                    y11, x11, y21, x21 = recognized_element1["parameters"]["roi"]

                    # The second rectangle width
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

                    border_bottom = y1 - height_elem / 2
                    border_top = y2 + height_elem / 2

                    # Vertical groups detection
                    # Check if the roi is input or select
                    # Check if the roi1 is text
                    # The first position of the tuple is input or select, and the second position is text
                    if recognized_element["struct_type"] in {"textinput", "select"} \
                            and recognized_element1["struct_type"] in {"ocrtext"}:
                        # Check if the elements were not assigned to the vertical groups before
                        # Flatten vertical group keys
                        fvgk = set(i for sub in vertical_groups.keys() for i in sub)
                        if ((idx not in fvgk) and (idx1 not in fvgk)):
                            # Check if the text and input elements are close to each other by vertical direction
                            if (border_bottom < mid_text < mid_input) or (
                                mid_input < mid_text < border_top
                            ):
                                # Assign the results to the vertical_group
                                # Check if the horizontal overlap between roi and roi1 is sufficient
                                if (
                                    horizontal_overlap > VERICAL_GROUPS_HORIZONTAL_OVERLAP_THRESHOLD * width_elem
                                ) or (
                                    horizontal_overlap > VERICAL_GROUPS_HORIZONTAL_OVERLAP_THRESHOLD * width_elem1
                                ):
                                    # Fill the vertical_group dictionary
                                    vertical_group_tuple = (idx, idx1)
                                    # The stub for the future scenario assigned
                                    vertical_group_scenario = -1
                                    vertical_groups.update(
                                        {
                                            vertical_group_tuple: vertical_group_scenario
                                        }
                                    )

                    # Horizontal groups detection
                    # Check if the roi is text or input or select
                    # Check if the roi1 is text or input or select
                    if recognized_element["struct_type"] in {"textinput", "select", "checkbox", "ocrtext", "button"} and recognized_element1[
                            "struct_type"] in {"textinput", "select", "checkbox", "ocrtext", "button"} and (idx != idx1):
                        # Check if the elements were not assigned to the horizontal groups before
                        # Flatten horizontal group keys
                        fhgk = set(i for sub in horizontal_groups.keys() for i in sub)
                        # test print("Flatten horizontal group keys", fhgk)
                        if ((idx not in fhgk) and (idx1 not in fhgk)):
                            # Check if these elements are laying at one level horizontally
                            # They should overlap vertically and this level of the overlap
                            # should be at least 0.25
                            if (
                                    vertical_overlap > HORIZONTAL_GROUPS_VERICAL_OVERLAP_THRESHOLD * height_elem
                            ) or (
                                    vertical_overlap > HORIZONTAL_GROUPS_VERICAL_OVERLAP_THRESHOLD * height_elem1
                            ):
                                # Fill the horizontal_group dictionary
                                horizontal_group_tuple = (idx, idx1)
                                # The stub for the future scenario assigned
                                horizontal_group_scenario = -1
                                horizontal_groups.update(
                                    {
                                        horizontal_group_tuple: horizontal_group_scenario
                                    }
                                )
            # These recognized elements should be assigned for the vertical groups,
            # horizontal groups and to the general scenario
            # Elements, groups and scenarios assignment
            # {(element1, element2): scenario1, (element3, element4): scenario2}
            # vertical_groups = {(1, 2): -1}
            # horizontal_groups = {(2, 3): -1, (4, 5): -1}


            # test
            print("Horizontal groups are:")
            for key in horizontal_groups:
                print(key, horizontal_groups[key])
            '''
            print("Vertical groups are:")
            for key in vertical_groups:
                print(key, vertical_groups[key])
            '''

            scenario_vertical_data = {
                "name": "scenario_vertical",
                "type": "common_scenario",
                "struct_type": "container",
                "direction": "vertical",
                "parameters": {},
                "styles": {},
                "parent_id": scenario.id,
            }

            # Create scenarios for vertical groups
            # Keys are tuples of elements, and the value is a new vertical scenario assigned
            # Assign the functional class based on vertical gropuing if not assigned yet
            for v_group_key in vertical_groups:
                children = []
                scenario_vertical = ScreenScenario.objects.create(
                    screen=screen, **scenario_vertical_data
                )
                vertical_groups[v_group_key] = scenario_vertical.id

                # Recognized input or select, first position in tuple
                element_data_vertical_input = recognized_elements[v_group_key[0]]
                # Recognized input or select, second position in tuple
                element_data_vertical_text = recognized_elements[v_group_key[1]]

                # Extract rois data from the elements
                y1, x1, y2, x2 = element_data_vertical_input["parameters"]["roi"]
                y11, x11, y21, x21 = element_data_vertical_text["parameters"]["roi"]
                # Find min & max values for the bounding rectangle
                xmin = min(x1, x2, x11, x21)
                xmax = max(x1, x2, x11, x21)
                ymin = min(y1, y2, y11, y21)
                ymax = max(y1, y2, y11, y21)
                # Assign the rois to the vertical scenario, based on min & max values
                scenario_vertical.parameters.update({"roi": (ymin, xmin, ymax, xmax)})
                # Assignment of the functional class based on neighbourhood
                if (element_data_vertical_input["func_type"] == "undefined"):
                    element_data_vertical_input["func_type"] = element_data_vertical_text["func_type"]
                # Create elements for vertical groups scenarios
                for element_data_vertical in v_group_key:
                    children_dict_vgroups = {}
                    element_vertical = recognized_elements[element_data_vertical]
                    inner_scenarios_elements.add(element_data_vertical)
                    scenario_vertical_element = ScenarioElement.objects.create(
                        scenario=scenario_vertical,
                        **element_vertical
                    )
                    # Fill the children list for parameters
                    ids = str(scenario_vertical_element.id) + "e"

                    rois = scenario_vertical_element.parameters["roi"]
                    children_dict_vgroups.update({'ids': ids})
                    children_dict_vgroups.update({'roi': rois})
                    children.append(children_dict_vgroups)

                # Arrange the vertical scenario children based on their rois (coordinates)
                children = sorted(children, key=lambda i: i["roi"][0])
                children = [sub['ids'] for sub in children]
                scenario_vertical.parameters["children"] = children
                scenario_vertical.save()

            scenario_horizontal_data = {
                "name": "scenario_horizontal",
                "type": "common_scenario",
                "struct_type": "container",
                "direction": "horizontal",
                "parameters": {},
                "styles": {},
                "parent_id": scenario.id,
            }

            # Create scenarios for horizontal groups
            # Include scenarios for vertical groups
            # Update scenarios for vertical groups with new parents
            for h_group_key in horizontal_groups:
                children = []
                rois_list = []
                scenario_horizontal = ScreenScenario.objects.create(
                    screen=screen, **scenario_horizontal_data
                )
                horizontal_groups[h_group_key] = scenario_horizontal.id
                # print("id", scenario_horizontal.id)
                # print("styles", scenario_horizontal.styles, scenario_horizontal_data["styles"])
                # print("scenario", scenario_horizontal)

                # If here was placed at least one select/input without the functional class assigned
                # The second should be the text and it should exists with the functional class assigned
                # Recognized input or select, vs ocrtext
                # Assignment of the functional class based on neighbourhood
                if(recognized_elements[h_group_key[0]]["struct_type"] in {"textinput", "select"}):
                    if (recognized_elements[h_group_key[0]]["func_type"] == "undefined"):
                        if (recognized_elements[h_group_key[1]]["struct_type"] in {"ocrtext"}):
                            recognized_elements[h_group_key[0]]["func_type"] = \
                                recognized_elements[h_group_key[1]]["func_type"]

                if (recognized_elements[h_group_key[1]]["struct_type"] in {"textinput", "select"}):
                    if (recognized_elements[h_group_key[1]]["func_type"] == "undefined"):
                        if (recognized_elements[h_group_key[0]]["struct_type"] in {"ocrtext"}):
                            recognized_elements[h_group_key[1]]["func_type"] = \
                                recognized_elements[h_group_key[0]]["func_type"]

                # Define the default flex alignment for the horizontal group
                scenario_horizontal.styles["justify-content"] = "space-between"
                scenario_horizontal.styles["display"] = "flex"
                scenario_horizontal.styles["align-items"] = "center"
                # Assign the styles for the case of the horizontal scenario with checkbox
                if(recognized_elements[h_group_key[0]]["struct_type"] in {"checkbox"}) or (recognized_elements[h_group_key[1]]["struct_type"] in {"checkbox"}):
                    print("h_group_key", h_group_key, recognized_elements[h_group_key[0]]["struct_type"], recognized_elements[h_group_key[1]]["struct_type"])
                    scenario_horizontal.styles["justify-content"] = "flex-start"

                #
                # print("after id", scenario_horizontal.id)
                # print("after styles", scenario_horizontal.styles)
                # input()

                # Create elements for horizontal groups scenarios if they're not in vertical grouping already
                for element_data_horizontal in h_group_key:
                    # Compare if in vertical group.
                    # Each horizontal element is being placed not more than at one vertical group
                    # Assign the vertical group if exists
                    vertical_group = (-1, -1)
                    for v_group, value in vertical_groups.items():
                        if element_data_horizontal in v_group:
                            vertical_group = v_group
                            # Assign the vertical group subset if exists
                            vertical_groups_subset[v_group] = value

                    if vertical_group == (-1, -1):
                        children_dict_hgroups = {}
                        # If the horizontal element does not exist in any vertical group
                        element_horizontal = recognized_elements[element_data_horizontal]
                        inner_scenarios_elements.add(element_data_horizontal)
                        scenario_horizontal_element = ScenarioElement.objects.create(
                            scenario=scenario_horizontal,
                            **element_horizontal
                        )
                        # Save rois data from the element for the array
                        rois_list.append(element_horizontal["parameters"]["roi"])
                        # Fill the children list for parameters
                        ids = str(scenario_horizontal_element.id) + "e"
                        rois = scenario_horizontal_element.parameters["roi"]
                        children_dict_hgroups.update({'ids': ids})
                        children_dict_hgroups.update({'roi': rois})
                        children.append(children_dict_hgroups)

                    else:
                        children_dict_hgroups = {}
                        # If the horizontal element exists in vertical group
                        # Find the related vertical group scenario from its id
                        vertical_group_scenario = ScreenScenario.objects.get(
                            id=vertical_groups[vertical_group]
                        )
                        # Save rois data from the vertical scenario
                        rois_list.append(vertical_group_scenario.parameters["roi"])
                        ids = str(vertical_group_scenario.id) + "s"
                        rois = vertical_group_scenario.parameters["roi"]
                        children_dict_hgroups.update({'ids': ids})
                        children_dict_hgroups.update({'roi': rois})
                        # Prevent the appearance of duplications
                        if children_dict_hgroups not in children:
                            children.append(children_dict_hgroups)

                        vertical_group_scenario.parent_id = scenario_horizontal.id
                        vertical_group_scenario.save()
                '''
                test
                # Show the children array
                print("children", children)
                '''

                # Extract rois from the rois_list
                # Find min & max values for the bounding rectangle
                xmin = min(rois_list[0][1], rois_list[0][3], rois_list[1][1], rois_list[1][3])
                xmax = max(rois_list[0][1], rois_list[0][3], rois_list[1][1], rois_list[1][3])
                ymin = min(rois_list[0][0], rois_list[0][2], rois_list[1][0], rois_list[1][2])
                ymax = max(rois_list[0][0], rois_list[0][2], rois_list[1][0], rois_list[1][2])

                # Assign the rois to the horizontal scenario, based on min & max values
                scenario_horizontal.parameters.update({"roi": (ymin, xmin, ymax, xmax)})
                # Arrange the horizontal scenario children based on their rois (coordinates)
                children = sorted(children, key=lambda i: i["roi"][1])
                children = [sub['ids'] for sub in children]
                # Children array doesn't have parameters now
                scenario_horizontal.parameters["children"] = children
                scenario_horizontal.save()

        # Find all free vertical scenarios.
        # Free vertical scenario does not share any element
        # with horizontal scenario
        # and doesn't belong to any horizontal scenario as a child
        # Should check if vertical and horizontal groups exist before these calculations

        if vertical_groups:
            vertical_groups_free = copy.deepcopy(vertical_groups)
        else:
            vertical_groups_free = {}

        # print("vertical_groups_free", vertical_groups_free)
        # print("vertical_groups_subset", vertical_groups_subset)
        # print("horizontal_groups", horizontal_groups)
        if vertical_groups and horizontal_groups:
            for v_group_key in list(vertical_groups_free.keys()):
                # Check the horizontal groups
                for h_group_key in horizontal_groups:
                    # print(set(v_group_key), set(h_group_key))
                    # Sets are disjoints if and only if their intersection is the empty set
                    if not set(v_group_key).isdisjoint(set(h_group_key)):
                        try:
                            del vertical_groups_free[v_group_key]
                        except KeyError:
                            pass
                # Check the vertical groups,
                # which are children of the horizontal groups
                for vs_group_key in vertical_groups_subset:
                    # Sets are disjoints if and only if their intersection is the empty set
                    if not set(v_group_key).isdisjoint(set(vs_group_key)):
                        try:
                            del vertical_groups_free[v_group_key]
                        except KeyError:
                            pass

        children = []  # [{'ids': ids, 'rois': rois}, {}, {}, {}, {}]
        # Get all the elements fir the general scenario.
        # Mark them as children.
        # recognized_elements_general = recognized_elements - inner_scenarios_elements
        for idx, element_data in enumerate(recognized_elements):
            if idx not in inner_scenarios_elements:
                children_dict_elem = {}
                # Get all the elements left. Mark them as children.
                scenario_general_element = ScenarioElement.objects.create(
                    scenario=scenario, **element_data
                )
                # Fill the children information to the main scenario for the parameters
                ids = str(scenario_general_element.id) + "e"
                rois = scenario_general_element.parameters["roi"]
                children_dict_elem.update({'ids': ids})
                children_dict_elem.update({'roi': rois})
                children.append(children_dict_elem)

        # Get all the horizontal scenarios. Mark them as children.
        if horizontal_groups:
            for h_group_key in horizontal_groups:
                children_dict_hgroups = {}
                ids = str(horizontal_groups[h_group_key]) + "s"
                # How to extract rois if h_group_key is known?
                # Should update the horizontal_group data structure later
                # and not query the database for this case
                horizontal_group_scenario = ScreenScenario.objects.get(
                    id=horizontal_groups[h_group_key]
                )
                rois = horizontal_group_scenario.parameters["roi"]
                children_dict_hgroups.update({'ids': ids})
                children_dict_hgroups.update({'roi': rois})
                children.append(children_dict_hgroups)

        # Get all the free vertical scenarios. Mark them as children.
        if vertical_groups_free:
            for v_group_key in vertical_groups_free:
                children_dict_vgroups = {}
                ids = str(vertical_groups_free[v_group_key]) + "s"
                # How to extract rois if v_group_key is known?
                # Should update the vertical_group data structure later
                # and not query the database for this case
                vertical_group_scenario = ScreenScenario.objects.get(
                    id=vertical_groups_free[v_group_key]
                )
                rois = vertical_group_scenario.parameters["roi"]
                children_dict_vgroups.update({'ids': ids})
                children_dict_vgroups.update({'roi': rois})
                children.append(children_dict_vgroups)

        # Check if the single button exists.
        # If exists, create the wrapper with height width related to the mean values of the largest cluster
        # Mark this wrapper as a horizontal group of the main scenario
        # Calculate the alignment of this button in group based on its coordinates
        # Remove the button from the single elements of the main scenario
        for idx, child in enumerate(children):
            # Find the id of the potential button
            child_id = int(child['ids'][:-1])
            # Get the button and create scenario for this button
            if 'e' in child['ids']:
                element_child = ScenarioElement.objects.get(id=child_id)
                if(element_child.struct_type == "button"):
                    # Detect the button position
                    y1, x1, y2, x2 = element_child.parameters["roi"]
                    width_elem = x2 - x1
                    height_elem = y2 - y1
                    # Detect the alignment of the element
                    # Text-align: left, if the left interval is smaller than the right interval
                    aligned_element = "left"

                    # Some rules for that buttons which are not too large
                    if((x2 - x1) < img_width * 0.8):
                        # Middle if the middle point placed at the 20% middle width for the whole image
                        if ( abs((x2 - x1) / 2 - (img_width / 2)) < img_width * 0.2):
                            aligned_element = "center"

                        print(x1 + (width_elem / 2), (img_width / 2))
                        if (x1 + (width_elem / 2) > (img_width / 2)):
                            aligned_element = "right"

                    # print(y1, x1, y2, x2, img_width, img_height)
                    # print(aligned_element)
                    # Create the horizontal scenario for the button
                    # if the button has right or central positioning
                    if(aligned_element in {"center", "right"}):
                        scenario_horizontal = ScreenScenario.objects.create(
                            screen=screen, **scenario_horizontal_data
                        )
                        # Add the button for the scenario parameters
                        scenario_horizontal.parameters["children"] = []
                        scenario_horizontal.parameters["children"].append(child["ids"])

                        scenario_horizontal.styles["display"] = "flex"
                        scenario_horizontal.styles["width"] = "100%"

                        # Should switch the button's parent from general scenario
                        # to novel created horizontal scenario
                        element_child.scenario = scenario_horizontal

                        # Should calculate ROI for the novel horizontal scenario

                        # Attach the novel horizontal scenario to the general scenario
                        children_dict_hgroups_buttons = {}
                        ids = str(scenario_horizontal.id) + "s"
                        rois = element_child.parameters["roi"]
                        children_dict_hgroups_buttons.update({'ids': ids})
                        children_dict_hgroups_buttons.update({'roi': rois})

                        # Remove the button from the children array
                        children.remove(child)

                        # Calculate scenario horizontal roi
                        children.append(children_dict_hgroups_buttons)
                        # Define styles based on aligned_element value
                        if(aligned_element == "right"):
                            scenario_horizontal.styles["justify-content"] = "flex-end"

                        if(aligned_element == "center"):
                            scenario_horizontal.styles["justify-content"] = "center"

                        # Save the horizontal scenario created for the button
                        scenario_horizontal.save()
                        # Save the element after changing its parent
                        element_child.save()

                # element_child.save()

        # Sort the data structure based on rois[0] (the vertical coordinate)
        children = sorted(children, key=lambda i: i["roi"][0])
        print("children=", children, "len(children)=", len(children))

        # Detect the margin-bottom start
        #
        # Extract all the first level groups and elements
        # Calculate margin-bottom for these groups
        # Assign the margin-bottom value
        margin_bottom = 0  # initial value for the margin-bottom
        for idx, child in enumerate(children):
            try:
                # Calculate the distance between vertical blocks
                # print(children[(idx+1)]["roi"][0] - children[(idx)]["roi"][2])
                # Sum all the distances between the vertical blocks
                margin_bottom += (children[(idx + 1)]["roi"][0] - children[(idx)]["roi"][2])
            except Exception:
                pass

        # Calculate the margin-bottom
        if(margin_bottom > 0):
            margin_bottom = int(margin_bottom / (len(children) - 1))
        else:
            margin_bottom = 15  # 15px is the default value for the margin-bottom

        # print("margin_bottom =", margin_bottom)
        for child in children:
            # Assign margin-bottom for each child
            child_id = int(child['ids'][:-1])

            # Do the calculations over scenarios
            if 's' in child['ids']:
                scenario_child = ScreenScenario.objects.get(id=child_id)
                scenario_child.styles["margin-bottom"] = str(margin_bottom) + "px"
                # print("scenario_child.styles=", type(scenario_child.styles), scenario_child.styles)
                scenario_child.save()

            # Do the calculations over elements
            if 'e' in child['ids']:
                element_child = ScenarioElement.objects.get(id=child_id)
                element_child.styles["margin-bottom"] = str(margin_bottom) + "px"
                # print("element_child.styles=", type(element_child.styles), element_child.styles)
                element_child.save()
        # Detect the margin-bottom end

        # Calculate the mean value for inputs, selects, buttons start
        height = 0
        width = 0
        num_children_counter = 0
        struct_type_accepted = ["textinput", "select"]  # The type of the elements to calculate
        for child in children:
            # Assign margin-bottom for each child
            child_id = int(child['ids'][:-1])

            # Calculate for the main scenario elements
            if 'e' in child['ids']:
                element_child = ScenarioElement.objects.get(id=child_id)
                print(element_child.struct_type)

                if(element_child.struct_type in struct_type_accepted):
                    # print("height", element_child.styles["height"])
                    # print("width", element_child.styles["width"])
                    height += float(element_child.styles["height"][:-2])
                    width += float(element_child.styles["width"][:-2])
                    # Increase the number of children counter
                    num_children_counter += 1
                element_child.save()

                # print("element_child.styles=", type(element_child.styles), element_child.styles)
                # element_child.save()

            # Calculate for the vertical scenarios of the main scenario
            if 's' in child['ids']:
                scenario_child = ScreenScenario.objects.get(id=child_id)
                print("sci", scenario_child.id)
                # Extract all the 1lvl elements for the given scenario child
                print("esci", scenario_child.elements, scenario_child.parameters["children"])
                flvl_elements = ScenarioElement.objects.filter(
                    scenario=scenario_child.id
                )
                print(flvl_elements)
                # Detect that elements which are in the vertical scenarios of the main scenario
                # for the inputs, selects, buttons
                for flvl_element in flvl_elements:
                    if (flvl_element.struct_type in struct_type_accepted):
                        print("fest", flvl_element.struct_type)
                        height += float(flvl_element.styles["height"][:-2])
                        width += float(flvl_element.styles["width"][:-2])
                        # Increase the number of children counter
                        num_children_counter += 1

        # Calculate the average height and width for the elements
        if(num_children_counter > 0):
            height = int(height / num_children_counter)
            width = int(width / num_children_counter)

            print("h:", height, width)

        # Assign average height and width for the elements from the main scenario
        # Assign average height and width for the elements from the vertical scenarios of the main scenario
        for child in children:
            # Assign height, width for each element with acceptable structural type from the main scenario
            child_id = int(child['ids'][:-1])
            # Calculate for the main scenario elements
            if 'e' in child['ids']:
                element_child = ScenarioElement.objects.get(id=child_id)
                print(element_child.struct_type)

                if(element_child.struct_type in struct_type_accepted):
                    element_child.styles["height"] = str(height) + "px"
                    element_child.styles["width"] = str(width) + "px"

                # Check if the button is close to other elements.
                # Assign the mean value if close enough
                if (element_child.struct_type == "button"):
                    button_height = float(element_child.styles["height"][:-2])
                    button_width = float(element_child.styles["width"][:-2])
                    if (abs(button_height - height) < (height * 0.15)): # The height diff is less than 15%
                        element_child.styles["height"] = str(height) + "px"
                    if (abs(button_width - width) < (width * 0.15)): # The width diff is less than 15%
                        element_child.styles["width"] = str(width) + "px"

                element_child.save()

            # Assign height, width for each element for the vertical scenarios of the main scenario
            if 's' in child['ids']:
                scenario_child = ScreenScenario.objects.get(id=child_id)
                print("sci", scenario_child.id)
                # Extract all the 1lvl elements for the given scenario child
                print("esci", scenario_child.elements, scenario_child.parameters["children"])
                flvl_elements = ScenarioElement.objects.filter(
                    scenario=scenario_child.id
                )
                print(flvl_elements)
                # Detect that elements which are in the vertical scenarios of the main scenario
                # for the inputs, selects, buttons
                for flvl_element in flvl_elements:
                    if (flvl_element.struct_type in struct_type_accepted):
                        print("fest", flvl_element.struct_type)
                        flvl_element.styles["height"] = str(height) + "px"
                        flvl_element.styles["width"] = str(width) + "px"

                    # Check if the button is close to other elements.
                    # Assign the mean value if close enough
                    if (flvl_element.struct_type == "button"):
                        button_height = float(flvl_element.styles["height"][:-2])
                        button_width = float(flvl_element.styles["width"][:-2])
                        if abs(button_height - height) < (height * 0.15):  # The height diff is less than 15%
                            flvl_element.styles["height"] = str(height) + "px"
                        if abs(button_width - width) < (width * 0.15):  # The width diff is less than 15%
                            flvl_element.styles["width"] = str(width) + "px"

                    flvl_element.save()

        # Calculate height, width for each element for the horizontal scenarios of the main scenario
        # extract from elements
        # Todo: extract from vertical groups in
        height_h = 0
        width_h = 0
        num_children_counter_h = 0
        for child in children:
            # Assign margin-bottom for each child
            child_id = int(child['ids'][:-1])
            # Calculate for the horizontal scenarios of the main scenario
            if 's' in child['ids']:
                scenario_child = ScreenScenario.objects.get(id=child_id)
                if(scenario_child.direction == "horizontal"):
                    # Extract elements directly
                    # Todo: Extract elements from the vertical groups included
                    flvl_elements = ScenarioElement.objects.filter(
                        scenario=scenario_child.id
                    )
                    for flvl_element in flvl_elements:
                        if (flvl_element.struct_type in struct_type_accepted):
                            print("fest", flvl_element.struct_type)
                            height_h += float(flvl_element.styles["height"][:-2])
                            width_h += float(flvl_element.styles["width"][:-2])
                            # Increase the number of children counter
                            num_children_counter_h += 1

        # Calculate the average height and width for the elements
        if(num_children_counter_h > 0):
            height_h = int(height / num_children_counter)
            width_h = int(width / num_children_counter)
            print("h:", height_h, width_h)

        for child in children:
            # Assign margin-bottom for each child
            child_id = int(child['ids'][:-1])
            # Calculate for the horizontal scenarios of the main scenario
            if 's' in child['ids']:
                scenario_child = ScreenScenario.objects.get(id=child_id)
                if(scenario_child.direction == "horizontal"):
                    # Extract elements directly
                    # Todo: Extract elements from the vertical groups included
                    flvl_elements = ScenarioElement.objects.filter(
                        scenario=scenario_child.id
                    )
                    for flvl_element in flvl_elements:
                        if (flvl_element.struct_type in struct_type_accepted):
                            flvl_element.styles["height"] = str(height_h) + "px"
                            flvl_element.styles["width"] = str(width_h) + "px"

                        # Check if the button is close to other elements.
                        # Assign the mean value if close enough
                        if (flvl_element.struct_type == "button"):
                            button_height = float(flvl_element.styles["height"][:-2])
                            button_width = float(flvl_element.styles["width"][:-2])
                            if abs(button_height - height) < (height * 0.15):  # The height diff is less than 15%
                                flvl_element.styles["height"] = str(height) + "px"
                            if abs(button_width - width) < (width * 0.15):  # The width diff is less than 15%
                                flvl_element.styles["width"] = str(width) + "px"

                        flvl_element.save()

        # Calculate the mean value for inputs, selects, buttons end

        scenario.parameters["children"] = [sub['ids'] for sub in children]
        scenario.styles["background-color"] = "rgba(" + bcolour_scenario_value + ")"
        # Assign the max width for the general scenario
        scenario.styles["max-width"] = str(img_width) + "px"

        scenario.save()

        # Extract all the inputs, selects from the main scenario
        # Assign the mean values for these inputs and selects
        # Do the calculation for the main scenario button
        #
        # Extract all the horizontal groups (2 level)
        # Extract all the inputs, selects from these groups
        # Assign the mean values for these inputs and selects
        #
        return scenario
