import copy
import numpy as np
import math
from statistics import median

from pytesseract import Output
from rest_framework_recursive.fields import RecursiveField

from project.settings import model, MEDIA_ROOT
from rest_framework import serializers
from apps.projects.models import ScenarioElement
from sklearn.cluster import KMeans
from collections import Counter
import cv2
import pytesseract

from keras.preprocessing.image import load_img
from keras_preprocessing.image import img_to_array

from apps.utils.object_detection import run_text_detection, get_rect_contours, show_rects, show_rois

from matplotlib import pyplot as plt

config_tesseract = "-l eng --oem 1 --psm 3"

# The constant to remove rectangle when overlaps more than 90% with larger rectangle
SQUARES_OVERLAP_THRESHOLD = 0.9
# The constant to remove text rectangle when overlaps more than 5% with larger rectangle
SQUARES_OVERLAP_THRESHOLD_TEXT = 0.05

# The constant to calculate horizontal overlap during the vertical groups detection
VERICAL_GROUPS_HORIZONTAL_OVERLAP_THRESHOLD = 0.75

# The constant to calculate vertical overlap during the horizontal groups detection
HORIZONTAL_GROUPS_VERTICAL_OVERLAP_THRESHOLD = 0.25


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


# Calculate distance between two points
def calculateDistance(x1, y1, x2, y2):
    dist = math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
    return dist


def contains_rectangle(r1, r2):
    # Calculation for the case of rois
    return r1[1] < r2[1] < r2[3] < r1[3] and r1[0] < r2[0] < r2[2] < r1[2]


def detect_aligned_element(x1, width_elem, img_width):
    # Detect the alignment of the element
    # Text-align: left, if the left interval is smaller than the right interval
    aligned_element = "left"
    if (x1 + (width_elem / 2) > (img_width / 2)):
        aligned_element = "right"

    # Middle if the middle point placed at the 20% middle width for the whole image
    if (abs(x1 + (width_elem / 2) - (img_width / 2)) < img_width * 0.2):
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
    unique_list = (list(list_set))
    return unique_list


list1 = [10, 20, 10, 30, 40, 40]
print("the unique values from 1st list is")
unique(list1)

list2 = [1, 2, 1, 1, 3, 4, 3, 3, 5]
print("\nthe unique values from 2nd list is")
unique(list2)


class ScenarioElementSerializer(serializers.ModelSerializer):
    parameters = serializers.JSONField()
    styles = serializers.JSONField()
    children = RecursiveField(required=False, allow_null=True, many=True)
    container = serializers.PrimaryKeyRelatedField(source='node.id', read_only=True)
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

        extra_kwargs = {"struct_type": {"read_only": True}, "func_type": {"read_only": True}}

    def create(self, validated_data):
        root_element_data = {
            "struct_type": "container",
            "func_type": "undefined",
            "parameters": {},
            "styles": {},
        }

        # Pre-Root element assignment
        element_root_pre = ScenarioElement.objects.get(id=validated_data["parent_id"])

        # Create the root element mptt start
        print(validated_data)
        print(root_element_data)
        imgpath = ""
        if validated_data.get("image"):
            node = ScenarioElement.objects.create(
                parent=element_root_pre, image=validated_data["image"], **root_element_data
            )
            imgpath = MEDIA_ROOT + "/uploads/" + str(validated_data["image"])
        else:
            node = ScenarioElement.objects.create(parent=element_root_pre, **root_element_data)
        # Create the root element mptt end

        # Create the opencv recognition start
        image_dict = {}
        result_regions = {}
        image_opencv_input = cv2.imread(imgpath)
        text = False
        watch = True
        # Get list of random images in IMAGE_DIR
        # if not filename:
        #     image_dict = get_rand_images(IMAGE_DIR, image_count)
        # else:
        #     image_dict[filename] = cv2.imread(os.path.join(IMAGE_DIR, filename))
        if True:
            text_contours = []
            rect_contours = []
            # Detect text regions
            text_contours = run_text_detection(image_opencv_input, text=text)
            # Detect rect regions
            rect_contours = get_rect_contours(image_opencv_input)
            # Save all detected regions into dictionary
            result = {"text": text_contours, "rect": rect_contours}

        print(result)
        # Create the opencv recognition end

        # Create the recognized_elements array start
        recognized_elements = []
        if imgpath:
            img = load_img(imgpath)
            img = img_to_array(img)

            # Detect the font-size with tesseract for the whole image start
            whole_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            result = pytesseract.image_to_boxes(whole_img)
            # print(result)

            # Detect the height and the width of the image
            img_height, img_width, channels = img.shape

            lines = result.strip().split('\n')
            font_size = []

            for line in lines:
                chars = line.split(' ')
                try:
                    font_size.append(float(chars[4]) - float(chars[2]))
                except Exception:
                    font_size.append(12.0)  # Default font-size value is 12px
            font_size_img = int(median(font_size) * 1.7)  # Font-size value of the image
            # Detect the font-size with tesseract for the whole image end

            # Get the dominant colour for the parent container(take the whole image)
            bcolour_container_value = '255,255,255,0'
            domcolour_container = get_dominant_colour(img)
            domcolour_container.append(1)
            bcolour_container_value = ','.join(str(int(x)) for x in domcolour_container)

            results = model.detect([img], verbose=1)
            r = results[0]

            # For the overlapped text, should remove the largest regions related to the text first
            # Or detect the text for these blocks with opencv and re-calculate the borders
            # First fill the list excluded_indices for the text elements only
            excluded_indices = []
            for idx1, (rect1, class_id1) in enumerate(zip(r["rois"], r["class_ids"])):
                for idx2, (rect2, class_id2) in enumerate(zip(r["rois"], r["class_ids"])):
                    if (idx1 < idx2) and (class_id1 == 3) and (class_id2 == 3):  # 3 means the text class
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

            for text_contour in text_contours:
                # Remove untypically wide text blocks
                width2 = text_contour[3]
                if (width2 > (font_size_img * 3)):
                    text_contours.remove(text_contour)

            for rect_contour in rect_contours:
                # Remove untypically large rect blocks
                width2 = rect_contour[2]
                height2 = rect_contour[3]
                if ((width2 * height2) > (img_height * img_width) * 0.75):
                    rect_contours.remove(rect_contour)

            # Calculate the coordinates precisely with OpenCV text blocks start
            for idx1, (rect1, class_id1) in enumerate(zip(r["rois"], r["class_ids"])):
                for text_contour in text_contours:
                    if (class_id1 == 3) and (idx1 not in excluded_indices):  # 3 means the text class
                        # print("rect1", rect1)
                        # print("text_contour", text_contour)
                        x1 = rect1[1]
                        y1 = rect1[0]
                        x2 = rect1[3]
                        y2 = rect1[2]
                        x3 = text_contour[0]
                        y3 = text_contour[1]
                        x4 = text_contour[2] + text_contour[0]
                        y4 = text_contour[3] + text_contour[1]

                        # Borders of the rectangles overlapped area
                        left = max(x1, x3)
                        bottom = max(y1, y3)
                        right = min(x2, x4)
                        top = min(y2, y4)
                        # Sizes of the rectangles overlapped area
                        width = right - left
                        height = top - bottom
                        print("width, height", width, height)

                        # The first rectangle square
                        width1, height1 = x2 - x1, y2 - y1
                        # print("width1, height1", width1, height1)

                        # The second rectangle square
                        width2, height2 = text_contour[2], text_contour[3]
                        # print("width2, height2", width2, height2)

                        # Check if width, height of the overlapped area less or equal 0
                        if not (width <= 0 or height <= 0):
                            # If the square > 0, calculate the squares of the 3 rectangles
                            square = width * height
                            square1 = width1 * height1
                            square2 = width2 * height2

                            if (square > square1 * SQUARES_OVERLAP_THRESHOLD_TEXT) or (
                                square > square2 * SQUARES_OVERLAP_THRESHOLD_TEXT
                            ):  # Change coordinates from Mask R CNN to the OpenCV values
                                rect1[1] = text_contour[0]
                                rect1[0] = text_contour[1]
                                rect1[3] = text_contour[2] + text_contour[0]
                                rect1[2] = text_contour[3] + text_contour[1]
            # Calculate the coordinates precisely with OpenCV text blocks end

            # Calculation of the excluded indices to remove overlapped elements start
            # Second, calculate the non-text blocks overlap
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
            # Calculation of the excluded indices to remove overlapped elements end

            '''
            # Plots generating start

            #
            #  # Show text contours on image start
            # window_name1 = 'image_opencv_text'
            # result_image = show_rects(image_opencv_input, text_contours, color=(255, 0, 0))
            # cv2.imshow(window_name1, result_image)
            # # waits for user to press any key
            # # (this is necessary to avoid Python kernel form crashing)
            # cv2.waitKey(0)
            # # Show text contours on image end
            #
            # # Show non-text contours on image start
            # # Window name in which image is displayed
            # window_name2 = 'image_opencv_rect'
            # result_image2 = show_rects(image_opencv_input, rect_contours, color=(255, 0, 0))
            # cv2.imshow(window_name2, result_image2)
            # # waits for user to press any key
            # # (this is necessary to avoid Python kernel form crashing)
            # cv2.waitKey(0)

            # Show text contours on image start
            window_name1 = 'image_opencv_text'
            for text_contour in text_contours:
                x1, y1, w1, h1 = text_contour
                x2 = w1 + x1
                y2 = h1 + y1
                cv2.rectangle(image_opencv_input, (x1, y1), (x2, y2), (255, 0, 0), 1)

            cv2.imshow(window_name1, image_opencv_input)
            # waits for user to press any key
            # (this is necessary to avoid Python kernel form crashing)
            # cv2.waitKey(0)
            # Show text contours on image end

            # Show non-text contours on image start
            # Window name in which image is displayed
            window_name2 = 'image_opencv_rect'
            for rect_contour in rect_contours:
                x1, y1, w1, h1 = rect_contour
                x2 = w1 + x1
                y2 = h1 + y1
                cv2.rectangle(image_opencv_input, (x1, y1), (x2, y2), (255, 155, 0), 1)
            cv2.imshow(window_name2, image_opencv_input)
            # waits for user to press any key
            # (this is necessary to avoid Python kernel form crashing)
            # cv2.waitKey(0)

            window_name5 = 'image_maskrcnn'
            for rroi in r['rois']:
                y1, x1, y2, x2 = rroi

                cv2.rectangle(image_opencv_input, (x1, y1), (x2, y2), (50,90,255), 2)

            cv2.imshow(window_name5, image_opencv_input)
            # waits for user to press any key
            # (this is necessary to avoid Python kernel form crashing)
            cv2.waitKey(0)

            # Show non-text contours on image end

            # Show rois adapted contours on image start
            # window_name3 = 'image_opencv_rois'
            # rois_contours = []
            # for idx1, (rroi, class_id1) in enumerate(zip(r["rois"], r["class_ids"])):
            #     # (class_id1 == 3) and
            #     if (class_id1 == 3) and (idx1 not in excluded_indices):
            #         tcontour = []
            #         tcontour.append(rroi[1])
            #         tcontour.append(rroi[0])
            #         tcontour.append(rroi[3])
            #         tcontour.append(rroi[0] - rroi[2])
            #         rois_contours.append(tcontour)
            #
            # result_image3 = show_rects(image_opencv_input, rois_contours, color=(255, 0, 0))
            # cv2.imshow(window_name3, result_image3)
            # (this is necessary to avoid Python kernel form crashing)
            # cv2.waitKey(0)
            # Show rois adapted contours on image end

            # Show rois contours on image start
            # Window name in which image is displayed
            window_name4 = 'image_opencv_rect'
            result_image4 = show_rois(image_opencv_input, r['rois'], color=(0, 255, 0))
            cv2.imshow(window_name4, result_image4)
            # waits for user to press any key
            # (this is necessary to avoid Python kernel form crashing)
            cv2.waitKey(0)

            # closing all open windows
            cv2.destroyAllWindows()
            # Plots generating end
            '''

            # Calculate the coordinates precisely with OpenCV non-text blocks start
            # Pass through the OpenCV contours predictions
            # Select the closest Mask R CNN predicted non-textual block
            # Final array where OpenCV non-text blocks are linked to Mask R CNN 1:1
            # Add that Mask R CNN blocks which are not assigned to the excluded indices

            # Mask R CNN predictions without OpenCV confirmation should be added to the excluded_indices
            idx1_selected_array = []
            for rect_contour in rect_contours:
                centers_distance_min = 10000
                idx1_selected = -1
                for idx1, (rect1, class_id1) in enumerate(zip(r["rois"], r["class_ids"])):
                    # 1,2,4,5,7 means elements except the text class and the radiobutton
                    if (class_id1 in {1, 2, 4, 5, 7}) and (idx1 not in excluded_indices):
                        x1 = rect_contour[0]
                        y1 = rect_contour[1]
                        x2 = rect_contour[2] + rect_contour[0]
                        y2 = rect_contour[3] + rect_contour[1]
                        x3 = rect1[1]
                        y3 = rect1[0]
                        x4 = rect1[3]
                        y4 = rect1[2]

                        '''
                        window_name5 = 'image_maskrcnn'
                        cv2.rectangle(image_opencv_input, (x3, y3), (x4, y4), (50, 90, 255), 2)
                        cv2.imshow(window_name5, image_opencv_input)
                        print("idx1, class_id1 =", idx1, class_id1)
                        # waits for user to press any key
                        # (this is necessary to avoid Python kernel form crashing)
                        cv2.waitKey(0)
                        '''

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
                        centers_distance = calculateDistance(center_x12, center_y12, center_x34, center_y34)

                        # Check if width, height of the overlapped area less or equal 0
                        if not (width <= 0 or height <= 0):
                            # If the square > 0, calculate the squares of the 3 rectangles
                            square = width * height
                            square1 = width1 * height1
                            square2 = width2 * height2

                            if (square > square1 * SQUARES_OVERLAP_THRESHOLD_TEXT) or (
                                square > square2 * SQUARES_OVERLAP_THRESHOLD_TEXT
                            ):
                                if (centers_distance < centers_distance_min):
                                    centers_distance_min = centers_distance
                                    idx1_selected = idx1
                                    # print("idx1_select", idx1)
                                    rect1[1] = rect_contour[0]
                                    rect1[0] = rect_contour[1]
                                    rect1[3] = rect_contour[2] + rect_contour[0]
                                    rect1[2] = rect_contour[3] + rect_contour[1]

                # Save the idx1_selected to the array
                # Update the r['roi'] with rect1_selected values
                if(idx1_selected != -1):
                    # print("idx1_select_array", idx1)
                    idx1_selected_array.append(idx1_selected)

            # Find the excluded indices
            for idx1, (rect1, class_id1) in enumerate(zip(r["rois"], r["class_ids"])):
                # 1,2,4,5,7 means elements except the text class and the radiobutton
                if (class_id1 in {1, 2, 4, 5, 7}) and (idx1 not in excluded_indices) and (idx1 not in idx1_selected_array):
                    # print("idx1", idx1)
                    # input()
                    excluded_indices.append(idx1)
            # Calculate the coordinates precisely with OpenCV non-text blocks end

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
                    width_elem = x2 - x1roi_our
                    height_elem = y2 - y1
                    '''
                    '''
                    test
                    # Show the recognized elements with classes and probabilities
                    print(idx, roi, class_id, score)
                    '''

                    y1, x1, y2, x2 = roi
                    roi_our = img[y1:y2, x1:x2]
                    # roi_our = image_opencv_input[y1:y2, x1:x2]
                    # print(idx, roi_our)

                    # roi_our = cv2.resize(
                    #     roi_our, None, fx=0.95, fy=0.95, interpolation=cv2.INTER_CUBIC
                    # )
                    '''
                    # Show text contours on image start
                    window_name1 = 'image_opencv_text'
                    for text_contour in text_contours:
                        x1, y1, w1, h1 = text_contour
                        x2 = w1 + x1
                        y2 = h1 + y1
                        cv2.rectangle(image_opencv_input, (x1, y1), (x2, y2), (255, 0, 0), 1)

                    cv2.imshow(window_name1, image_opencv_input)
                    # waits for user to press any key
                    # (this is necessary to avoid Python kernel form crashing)
                    # cv2.waitKey(0)
                    # Show text contours on image end

                    window_name5 = 'image_maskrcnn'
                    for rroi in r['rois']:
                        y1, x1, y2, x2 = rroi

                        cv2.rectangle(image_opencv_input, (x1, y1), (x2, y2), (50, 90, 255), 2)

                    cv2.imshow(window_name5, image_opencv_input)
                    # waits for user to press any key
                    # (this is necessary to avoid Python kernel form crashing)
                    cv2.waitKey(0)
                    '''

                    # Get the dominant colour for the HTML element
                    bcolour_element_value = '255,255,255,0'
                    domcolour_element = get_dominant_colour(roi_our)
                    domcolour_element.append(1)
                    bcolour_element_value = ','.join(str(int(x)) for x in domcolour_element)

                    # Convert to the grey colour
                    roi_our = cv2.cvtColor(roi_our, cv2.COLOR_BGR2GRAY)

                    # Detect the font-size with tesseract for some element
                    result = pytesseract.image_to_boxes(roi_our)
                    # print(result)

                    lines = result.strip().split('\n')
                    font_size = []

                    for line in lines:
                        chars = line.split(' ')
                        try:
                            font_size.append(float(chars[4]) - float(chars[2]))
                        except Exception:
                            font_size.append(12.0)  # Default font-size value is 12px
                    font_size_value = int(median(font_size) * 1.7)

                    # Read the string with tesseract
                    text = pytesseract.image_to_string(roi_our, config=config_tesseract)

                    width_elem = x2 - x1
                    height_elem = y2 - y1

                    # Detect the text element alignment
                    # Improve this try except finally constructiom for better one later
                    # do this later
                    '''
                    try:
                        d = pytesseract.image_to_data(roi_our, output_type=Output.DICT)

                        dlefts = unique(d['left'].copy())
                        dlefts.sort()
                        dwidths = unique(d['width'].copy())
                        dwidths.sort()

                        dlefts_1min = dlefts[1]
                        dwidths_lmax = dwidths[-1]


                        print(dlefts, dwidths)
                        print("d", d, dlefts_1min, dwidths_lmax)
                        print("width_elem", width_elem)
                        input()


                        aligned_element = detect_aligned_element(dlefts_1min, dwidths_lmax, img_width)
                    except Exception:
                        pass
                    finally:
                        pass
                    '''
                    aligned_element = detect_aligned_element(x1, width_elem, img_width)
                    func_type = "undefined"
                    letters_str = ""
                    # Check if class id is: 1 input, 2 button, 3 text or 4 select
                    if class_id in [1, 2, 3, 4]:
                        # Functional class assignment
                        # Input: string from tesseract, output: functional class of the element
                        tess_string = text.lower().split()
                        # The whole string format to process further
                        letters_str = text
                        # Detect the text element alignment

                    # Check if class id is: 1 input, 2 button 4 select
                    # Calculate if the internal text_contours from the OpenCV were placed in that blocks
                    # Recognize text with tesseract based on text_contours
                    # Assign this new value
                    if class_id in [1, 2, 3, 4]:
                        for text_contour in text_contours:
                            x1 = text_contour[0]
                            y1 = text_contour[1]
                            x2 = text_contour[2] + text_contour[0]
                            y2 = text_contour[3] + text_contour[1]
                            width_text_elem = text_contour[2]
                            roi_text_contour = (y1, x1, y2, x2)

                            if contains_rectangle(roi, roi_text_contour):
                                roi_our = img[y1:y2, x1:x2]
                                # Convert to the grey colour
                                roi_our = cv2.cvtColor(roi_our, cv2.COLOR_BGR2GRAY)
                                # Read the string with tesseract
                                text = pytesseract.image_to_string(roi_our, config=config_tesseract)

                                '''
                                # Show text contours on image start
                                window_name1 = 'image_opencv_text'
                                if True:
                                    b, a, d, c = roi_text_contour
                                    cv2.rectangle(image_opencv_input, (a, b), (c, d), (255, 0, 0), 1)

                                cv2.imshow(window_name1, image_opencv_input)
                                cv2.waitKey(0)

                                window_name5 = 'image_maskrcnn'
                                if True:
                                    y1, x1, y2, x2 = roi

                                    cv2.rectangle(image_opencv_input, (x1, y1), (x2, y2), (50, 90, 255), 2)

                                cv2.imshow(window_name5, image_opencv_input)
                                # waits for user to press any key
                                # (this is necessary to avoid Python kernel form crashing)
                                cv2.waitKey(0)
                                # Show non-text contours on image end
                                '''

                                # Input: string from tesseract, output: functional class of the element
                                tess_string = text.lower().split()
                                # The whole string format to process further
                                letters_str = text
                                # Detect the text element alignment
                                # aligned_element = detect_aligned_element(x1, width_text_elem, width_elem)

                    # Input
                    if class_id == 1:
                        recognized_elements.append(
                            {
                                "struct_type": "textinput",
                                "func_type": func_type,
                                "buoyancy": roi[0],
                                "parameters": {"placeholder": letters_str, "roi": roi},
                                "styles": {
                                    "width": str(width_elem) + "px",
                                    "height": str(height_elem) + "px",
                                    "background-color": "rgba(" + bcolour_element_value + ")",
                                    "font-size": str(font_size_img) + "px",
                                },
                            }
                        )
                    # Button
                    if class_id == 2:
                        recognized_elements.append(
                            {
                                "struct_type": "button",
                                "func_type": "end_simple_container",
                                "buoyancy": roi[0],
                                "parameters": {"textContent": letters_str, "roi": roi},
                                "styles": {
                                    "text-align": "center",
                                    "width": str(width_elem) + "px",
                                    "height": str(height_elem) + "px",
                                    "background-color": "rgba(" + bcolour_element_value + ")",
                                    "font-size": str(font_size_value) + "px",
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
                                "buoyancy": roi[0],
                                "parameters": {"textContent": text, "roi": roi},
                                "styles": {"text-align": aligned_element, "font-size": str(font_size_img) + "px", },
                            }
                        )
                    # Select
                    if class_id == 4:
                        recognized_elements.append(
                            {
                                "struct_type": "select",
                                "func_type": func_type,
                                "buoyancy": roi[0],
                                "parameters": {"textContent": letters_str, "roi": roi},
                                "styles": {
                                    "width": str(width_elem) + "px",
                                    "height": str(height_elem) + "px",
                                    "background-color": "rgba(" + bcolour_element_value + ")",
                                    "font-size": str(font_size_img) + "px",
                                },
                            }
                        )
                    # Checkbox
                    if class_id == 5:
                        recognized_elements.append(
                            {
                                "struct_type": "checkbox",
                                "func_type": "checkbox",
                                "buoyancy": roi[0],
                                "parameters": {"name": letters_str, "roi": roi, "defaultChecked": False},
                                "styles": {
                                    "width": str((width_elem + height_elem) / 2) + "px",
                                    "height": str((width_elem + height_elem) / 2) + "px",
                                    "margin-right": str((width_elem + height_elem) / 4) + "px",
                                    "background-color": "#555",  # Define the default colour of the checkbox borders
                                },
                            }
                        )
                    # Radiobutton
                    if class_id == 6:
                        recognized_elements.append(
                            {
                                "struct_type": "radiobutton",
                                "func_type": "radiobutton",
                                "buoyancy": roi[0],
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
                                "buoyancy": roi[0],
                                "parameters": {"alt": letters_str, "roi": roi},
                                "styles": {
                                    "width": str(width_elem) + "px",
                                    "max-height": str(height_elem) + "px",
                                    "background-color": "rgba(" + bcolour_element_value + ")",
                                },
                            }
                        )

            # test
            # Display the recognized_elements to the command line
            # for recognized_element in recognized_elements:
            #     print(recognized_element)

            # Create the recognized_elements array start

            # Sort the recognized_elements, extract the y1 parameter
            # The roi order is y1, x1, y2, x2
            # recognized_elements = sorted(recognized_elements, key=lambda i: i["parameters"]["roi"][0])

            # Pass through all the rois. Find all the vertical grouping signals.
            # Find all the horizontal grouping signals.
            # First assign containers for the vertical grouping, second assign containers for the horizontal grouping,
            # For each vertical grouping the container should be assigned. Vertical grouping contains two elements:
            # first, input or select, and second, the text.
            # containers of vertical grouping should be included to the containers of horizontal grouping if they exist
            # and finally to the resulted whole image node.
            # 1. Create containers for vertical groups. 2. Create containers for horizontal groups
            # (when element is in vertical group, take the whole vertical group)
            # Data structures here are lists of tuples for the vertically or horizonntally aligned elements
            # Vertically aligned: [(text0, input0), (text1, input1), ...]
            # Horizontally aligned: [(text2, input2), (input3, input4), ...]
            # Maybe that's possible to create containers for vertically and horizontally aligned
            # containers only after the elements creation.
            # That's possible to save positioning of all the elements if requested
            # The serializer input is list of containers, one of them is the whole image node.
            # Elements are distributed among these containers.
            #

            vertical_groups = {}
            vertical_groups_subset = {}
            horizontal_groups = {}
            # Inner containers elements list to remove them from recognized_elements
            # befpre the final assignment to the general container
            inner_containers_elements = set()
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
                                    # The stub for the future container assigned
                                    vertical_group_container = -1
                                    vertical_groups.update(
                                        {
                                            vertical_group_tuple: vertical_group_container
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
                                    vertical_overlap > HORIZONTAL_GROUPS_VERTICAL_OVERLAP_THRESHOLD * height_elem
                            ) or (
                                    vertical_overlap > HORIZONTAL_GROUPS_VERTICAL_OVERLAP_THRESHOLD * height_elem1
                            ):
                                # Fill the horizontal_group dictionary
                                horizontal_group_tuple = (idx, idx1)
                                # The stub for the future container assigned
                                horizontal_group_container = -1
                                horizontal_groups.update(
                                    {
                                        horizontal_group_tuple: horizontal_group_container
                                    }
                                )
            # These recognized elements should be assigned for the vertical groups,
            # horizontal groups and to the general container
            # Elements, groups and containers assignment
            # {(element1, element2): container1, (element3, element4): container2}
            # vertical_groups = {(1, 2): -1}
            # horizontal_groups = {(2, 3): -1, (4, 5): -1}
            '''
            # test
            print("Horizontal groups are:")
            for key in horizontal_groups:
                print(key, horizontal_groups[key])

            print("Vertical groups are:")
            for key in vertical_groups:
                print(key, vertical_groups[key])
            '''

            # container vertical data start

            container_vertical_data = {
                "name": "container_vertical",
                "struct_type": "container",
                "func_type": "undefined",
                "direction": "vertical",
                "parameters": {},
                "styles": {},
                "parent": node,
            }

            # Create containers for vertical groups
            # Keys are tuples of elements, and the value is a new vertical container assigned
            # Assign the functional class based on vertical gropuing if not assigned yet
            for v_group_key in vertical_groups:
                children = []
                container_vertical = ScenarioElement.objects.create(
                    **container_vertical_data
                )
                vertical_groups[v_group_key] = container_vertical.id

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
                # Assign the rois to the vertical container, based on min & max values
                container_vertical.parameters.update({"roi": (ymin, xmin, ymax, xmax)})
                # Assign the buoyancy to the vertical container, based on ymin or roi[0]
                container_vertical.buoyancy = ymin
                # Create elements for vertical groups containers
                for element_data_vertical in v_group_key:
                    children_dict_vgroups = {}
                    element_vertical = recognized_elements[element_data_vertical]
                    inner_containers_elements.add(element_data_vertical)
                    container_vertical_element = ScenarioElement.objects.create(
                        parent=container_vertical,
                        **element_vertical
                    )
                    # Fill the children list for parameters
                    ids = str(container_vertical_element.id) + "e"

                    rois = container_vertical_element.parameters["roi"]
                    children_dict_vgroups.update({'ids': ids})
                    children_dict_vgroups.update({'roi': rois})
                    children.append(children_dict_vgroups)

                # Arrange the vertical container children based on their rois (coordinates)
                children = sorted(children, key=lambda i: i["roi"][0])
                children = [sub['ids'] for sub in children]
                container_vertical.parameters["children"] = children

                # Should add buoyancy for the children

                # Select all the children for the container_vertical
                # Detect rois from them
                # Assign buoyancy for them based on i["roi"][0] value with step 100 (0 is the lowest, +100 is the next level)
                # Or maybe buoyancy is their i["roi"][0] value
                # I did that at the coordinates and classes detection step
                # Intergal buyoancy for the vertical container was assigned above, too

                container_vertical.save()
            # container vertical data end

            # container horizontal start
            container_horizontal_data = {
                "name": "container_horizontal",
                "struct_type": "container",
                "func_type": "undefined",
                "direction": "horizontal",
                "parameters": {},
                "styles": {},
                "parent": node,
            }

            # Create containers for horizontal groups
            # Include containers for vertical groups
            # Update containers for vertical groups with new parents
            for h_group_key in horizontal_groups:
                children = []
                rois_list = []
                container_horizontal = ScenarioElement.objects.create(
                    **container_horizontal_data
                )
                horizontal_groups[h_group_key] = container_horizontal.id
                # print("id", container_horizontal.id)
                # print("styles", container_horizontal.styles, container_horizontal_data["styles"])
                # print("container", container_horizontal)

                # Define the default flex alignment for the horizontal group
                container_horizontal.styles["justify-content"] = "space-between"
                container_horizontal.styles["display"] = "flex"
                container_horizontal.styles["align-items"] = "center"
                # Assign the styles for the case of the horizontal container with checkbox
                if(recognized_elements[h_group_key[0]]["struct_type"] in {"checkbox"}) or (recognized_elements[h_group_key[1]]["struct_type"] in {"checkbox"}):
                    print("h_group_key", h_group_key, recognized_elements[h_group_key[0]]["struct_type"], recognized_elements[h_group_key[1]]["struct_type"])
                    container_horizontal.styles["justify-content"] = "flex-start"

                #
                # print("after id", container_horizontal.id)
                # print("after styles", container_horizontal.styles)
                # input()

                # Create elements for horizontal groups containers if they're not in vertical grouping already
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
                        inner_containers_elements.add(element_data_horizontal)
                        container_horizontal_element = ScenarioElement.objects.create(
                            parent=container_horizontal,
                            **element_horizontal
                        )
                        # Save rois data from the element for the array
                        rois_list.append(element_horizontal["parameters"]["roi"])
                        # Fill the children list for parameters
                        ids = str(container_horizontal_element.id) + "e"
                        rois = container_horizontal_element.parameters["roi"]
                        children_dict_hgroups.update({'ids': ids})
                        children_dict_hgroups.update({'roi': rois})
                        children.append(children_dict_hgroups)

                    else:
                        children_dict_hgroups = {}
                        # If the horizontal element exists in vertical group
                        # Find the related vertical group container from its id
                        vertical_group_container = ScenarioElement.objects.get(
                            id=vertical_groups[vertical_group]
                        )
                        # Save rois data from the vertical container
                        rois_list.append(vertical_group_container.parameters["roi"])
                        ids = str(vertical_group_container.id) + "s"
                        rois = vertical_group_container.parameters["roi"]
                        children_dict_hgroups.update({'ids': ids})
                        children_dict_hgroups.update({'roi': rois})
                        # Prevent the appearance of duplications
                        if children_dict_hgroups not in children:
                            children.append(children_dict_hgroups)

                        vertical_group_container.parent_id = container_horizontal.id
                        vertical_group_container.save()
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

                # Assign the rois to the horizontal container, based on min & max values
                container_horizontal.parameters.update({"roi": (ymin, xmin, ymax, xmax)})
                # Assign buoyancy for the horizontal container, based on roi[0]
                container_horizontal.buoyancy = ymin
                # Arrange the horizontal container children based on their rois (coordinates)
                children = sorted(children, key=lambda i: i["roi"][1])
                children = [sub['ids'] for sub in children]
                # Children array doesn't have parameters now
                container_horizontal.parameters["children"] = children
                container_horizontal.save()
            # container horizontal end
        # Find all free vertical containers.
        # Free vertical container does not share any element
        # with horizontal container
        # and doesn't belong to any horizontal container as a child
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
        # Get all the elements for the general node.
        # Mark them as children.
        # recognized_elements_general = recognized_elements - inner_containers_elements
        for idx, element_data in enumerate(recognized_elements):
            if idx not in inner_containers_elements:
                children_dict_elem = {}
                # Get all the elements left. Mark them as children.
                container_general_element = ScenarioElement.objects.create(
                    parent=node, **element_data
                )
                # Fill the children information to the main container for the parameters
                ids = str(container_general_element.id) + "e"
                rois = container_general_element.parameters["roi"]
                children_dict_elem.update({'ids': ids})
                children_dict_elem.update({'roi': rois})
                children.append(children_dict_elem)

        # Get all the horizontal containers. Mark them as children.
        if horizontal_groups:
            for h_group_key in horizontal_groups:
                children_dict_hgroups = {}
                ids = str(horizontal_groups[h_group_key]) + "s"
                # How to extract rois if h_group_key is known?
                # Should update the horizontal_group data structure later
                # and not query the database for this case
                horizontal_group_container = ScenarioElement.objects.get(
                    id=horizontal_groups[h_group_key]
                )
                rois = horizontal_group_container.parameters["roi"]
                children_dict_hgroups.update({'ids': ids})
                children_dict_hgroups.update({'roi': rois})
                children.append(children_dict_hgroups)

        # Get all the free vertical containers. Mark them as children.
        if vertical_groups_free:
            for v_group_key in vertical_groups_free:
                children_dict_vgroups = {}
                ids = str(vertical_groups_free[v_group_key]) + "s"
                # How to extract rois if v_group_key is known?
                # Should update the vertical_group data structure later
                # and not query the database for this case
                vertical_group_container = ScenarioElement.objects.get(
                    id=vertical_groups_free[v_group_key]
                )
                rois = vertical_group_container.parameters["roi"]
                children_dict_vgroups.update({'ids': ids})
                children_dict_vgroups.update({'roi': rois})
                children.append(children_dict_vgroups)

        # Check if the single button exists.
        # If exists, create the wrapper with height width related to the mean values of the largest cluster
        # Mark this wrapper as a horizontal group of the main container
        # Calculate the alignment of this button in group based on its coordinates
        # Remove the button from the single elements of the main container
        for idx, child in enumerate(children):
            # Find the id of the potential button
            child_id = int(child['ids'][:-1])
            # Get the button and create container for this button
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
                        if (abs((x2 - x1) / 2 - (img_width / 2)) < img_width * 0.2):
                            aligned_element = "center"

                        print(x1 + (width_elem / 2), (img_width / 2))
                        if (x1 + (width_elem / 2) > (img_width / 2)):
                            aligned_element = "right"

                    # Create the horizontal container for the button
                    # if the button has right or central positioning
                    if(aligned_element in {"center", "right"}):
                        container_horizontal = ScenarioElement.objects.create(
                            **container_horizontal_data
                        )
                        # Add the button for the container parameters
                        container_horizontal.parameters["children"] = []
                        container_horizontal.parameters["children"].append(child["ids"])

                        container_horizontal.styles["display"] = "flex"
                        container_horizontal.styles["width"] = "100%"

                        # Should switch the button's parent from general container
                        # to novel created horizontal container
                        element_child.container = container_horizontal

                        # Should calculate ROI for the novel horizontal container

                        # Attach the novel horizontal container to the general container
                        children_dict_hgroups_buttons = {}
                        ids = str(container_horizontal.id) + "s"
                        rois = element_child.parameters["roi"]
                        children_dict_hgroups_buttons.update({'ids': ids})
                        children_dict_hgroups_buttons.update({'roi': rois})

                        # Remove the button from the children array
                        children.remove(child)

                        # Calculate container horizontal roi
                        children.append(children_dict_hgroups_buttons)
                        # Define styles based on aligned_element value
                        if(aligned_element == "right"):
                            container_horizontal.styles["justify-content"] = "flex-end"

                        if(aligned_element == "center"):
                            container_horizontal.styles["justify-content"] = "center"

                        # Save the horizontal container created for the button
                        container_horizontal.save()
                        # Save the element after changing its parent
                        element_child.save()

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

            # Do the calculations over containers
            if 's' in child['ids']:
                container_child = ScenarioElement.objects.get(id=child_id)
                container_child.styles["margin-bottom"] = str(margin_bottom) + "px"
                # print("container_child.styles=", type(container_child.styles), container_child.styles)
                container_child.save()

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

            # Calculate for the main container elements
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

            # Calculate for the vertical containers of the main container
            if 's' in child['ids']:
                container_child = ScenarioElement.objects.get(id=child_id)
                print("sci", container_child.id)
                # Extract all the 1lvl elements for the given container child
                print("esci", container_child.children, container_child.parameters["children"])
                flvl_elements = ScenarioElement.objects.filter(
                    parent=container_child.id
                )
                print(flvl_elements)
                # Detect that elements which are in the vertical containers of the main container
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

        # Assign average height and width for the elements from the main container
        # Assign average height and width for the elements from the vertical containers of the main container
        for child in children:
            # Assign height, width for each element with acceptable structural type from the main container
            child_id = int(child['ids'][:-1])
            # Calculate for the main container elements
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
                    if (abs(button_height - height) < (height * 0.15)):  # The height diff is less than 15%
                        element_child.styles["height"] = str(height) + "px"
                    if (abs(button_width - width) < (width * 0.15)):  # The width diff is less than 15%
                        element_child.styles["width"] = str(width) + "px"

                element_child.save()

            # Assign height, width for each element for the vertical containers of the main container
            if 's' in child['ids']:
                container_child = ScenarioElement.objects.get(id=child_id)
                print("sci", container_child.id)
                # Extract all the 1lvl elements for the given container child
                print("esci", container_child.children, container_child.parameters["children"])
                flvl_elements = ScenarioElement.objects.filter(
                    parent=container_child.id
                )
                print(flvl_elements)
                # Detect that elements which are in the vertical containers of the main container
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

        # Calculate height, width for each element for the horizontal containers of the main container
        # extract from elements
        # Todo: extract from vertical groups in
        height_h = 0
        width_h = 0
        num_children_counter_h = 0
        for child in children:
            # Assign margin-bottom for each child
            child_id = int(child['ids'][:-1])
            # Calculate for the horizontal containers of the main container
            if 's' in child['ids']:
                container_child = ScenarioElement.objects.get(id=child_id)
                if(container_child.direction == "horizontal"):
                    # Extract elements directly
                    # Todo: Extract elements from the vertical groups included
                    flvl_elements = ScenarioElement.objects.filter(
                        parent=container_child.id
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
            # Calculate for the horizontal containers of the main container
            if 's' in child['ids']:
                container_child = ScenarioElement.objects.get(id=child_id)
                if(container_child.direction == "horizontal"):
                    # Extract elements directly
                    # Todo: Extract elements from the vertical groups included
                    flvl_elements = ScenarioElement.objects.filter(
                        parent=container_child.id
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
        node.styles["background-color"] = "rgba(" + bcolour_container_value + ")"
        # Assign the max width for the general container
        node.styles["max-width"] = str(img_width) + "px"
        node.save()

        # Extract all the inputs, selects from the main container
        # Assign the mean values for these inputs and selects
        # Do the calculation for the main container button
        #
        # Extract all the horizontal groups (2 level)
        # Extract all the inputs, selects from these groups
        # Assign the mean values for these inputs and selects
        #

        return node
