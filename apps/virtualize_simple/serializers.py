import re
from project.settings import model, MEDIA_ROOT
from rest_framework import serializers
from apps.projects.models import ScenarioElement, ScreenScenario
import cv2
import pytesseract
# import numpy as np
from keras.preprocessing.image import load_img
from keras_preprocessing.image import img_to_array

config_tesseract = "-l eng --oem 1 --psm 3"

f_dictionary = {
    "username": ["username", "user", "username", "alias", "nickname", "first-last", "full", "name"],
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
            "func_type_human",
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
        scenario_data = {
            "name": "string1",
            "type": "login",
            "struct_type": "scenario",
            "parameters": {},
        }

        """
        Scenarioelements for the current scenario.
        These elements are obtained from CNN OCR.
        """
        screen = validated_data["screen"]

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

            results = model.detect([img], verbose=1)
            r = results[0]

            # Calculation of the excluded indices to remove overlapped elements
            excluded_indices = []
            for idx1, rect1 in enumerate(r["rois"]):
                for idx2, rect2 in enumerate(r["rois"]):
                    if idx1 < idx2:
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

                        # The first rectangle square
                        width2, height2 = x4 - x3, y4 - y3

                        # Check if width, height of the overlapped area less or equal 0
                        if not (width <= 0 or height <= 0):
                            # If the square > 0, calculate the squares of the 3 rectangles
                            square = width * height
                            square1 = width1 * height1
                            square2 = width2 * height2

                            if (square > square1 * SQUARES_OVERLAP_THRESHOLD) and (
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

            for idx, (roi, class_id, score) in enumerate(zip(r["rois"], r["class_ids"], r['scores'])):
                if idx not in excluded_indices:
                    # Simple comparison with Colab results
                    print(class_id, score)

                    y1, x1, y2, x2 = roi
                    roi_our = img[y1:y2, x1:x2]

                    roi_our = cv2.resize(
                        roi_our, None, fx=0.95, fy=0.95, interpolation=cv2.INTER_CUBIC
                    )
                    # Convert to the grey colour
                    roi_our = cv2.cvtColor(roi_our, cv2.COLOR_BGR2GRAY)

                    # Remove artifacts connected to image border
                    # This can decrease the prediction quality for images
                    # roi_our = clear_border(roi_our)
                    '''
                    # Apply dilation and erosion to remove some noise
                    kernel = np.ones((1, 1), np.uint8)
                    roi_our = cv2.dilate(roi_our, kernel, iterations=1)
                    roi_our = cv2.erode(roi_our, kernel, iterations=1)
                    '''
                    # Apply threshold to get image with only black and white
                    # roi_our = apply_threshold(roi_our, 20)
                    # print(pytesseract.image_to_string(roi_our))

                    text = pytesseract.image_to_string(roi_our, config=config_tesseract)

                    width_elem = x2 - x1
                    height_elem = y2 - y1

                    func_type = "undefined"
                    # Check if class id is: 1 input, 2 button, 3 text or 4 select
                    if class_id in [1, 2, 3, 4]:
                        # Functional class assignment
                        # Input: string from tesseract, output: functional class of the element
                        tess_string = text.lower().split()

                        # The whole string format to process further
                        letters_str = " ".join(filter(str.isalpha, text))

                        fclasses_predictions = []
                        for ts in tess_string:
                            ts.strip()
                            ts = re.sub("[^@a-z A-Z]+", "", ts)
                            print("ts=", ts)
                            # print([key for key, value in f_dictionary.items() if ts in value])
                            fclass = [
                                key for key, value in f_dictionary.items() if ts in value
                            ]
                            fclasses_predictions = fclasses_predictions + fclass

                        # func_type = "".join(fclasses_predictions)
                        # Should choose the func_type from multiple predictions later
                        if fclasses_predictions:
                            func_type = fclasses_predictions[0]

                    # Input
                    if class_id == 1:
                        recognized_elements.append(
                            {
                                "struct_type": "textinput",
                                "func_type": func_type,
                                "parameters": {"placeholder": letters_str},
                                "styles": {
                                    "width": str(width_elem) + "px",
                                    "height": str(height_elem) + "px",
                                },
                            }
                        )
                    # Button
                    if class_id == 2:
                        recognized_elements.append(
                            {
                                "struct_type": "button",
                                "func_type": "end_simple_scenario",
                                "parameters": {"text": letters_str},
                                "styles": {
                                    "width": str(width_elem) + "px",
                                    "height": str(height_elem) + "px",
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
                                "parameters": {"placeholder": text},
                                "styles": {
                                    "width": str(width_elem) + "px",
                                    "height": str(height_elem) + "px",
                                },
                            }
                        )
                    # Select
                    if class_id == 4:
                        recognized_elements.append(
                            {
                                "struct_type": "select",
                                "func_type": func_type,
                                "parameters": {"text": letters_str},
                                "styles": {
                                    "width": str(width_elem) + "px",
                                    "height": str(height_elem) + "px",
                                },
                            }
                        )
                    # Checkbox
                    if class_id == 5:
                        recognized_elements.append(
                            {
                                "struct_type": "checkbox",
                                "func_type": "checkbox",
                                "parameters": {"text": letters_str},
                                "styles": {
                                    "width": str(width_elem) + "px",
                                    "height": str(height_elem) + "px",
                                },
                            }
                        )
                    # Radiobutton
                    if class_id == 6:
                        recognized_elements.append(
                            {
                                "struct_type": "radiobutton",
                                "func_type": "radiobutton",
                                "parameters": {"text": letters_str},
                                "styles": {
                                    "width": str(width_elem) + "px",
                                    "height": str(height_elem) + "px",
                                },
                            }
                        )
                    # Image
                    if class_id == 7:
                        recognized_elements.append(
                            {
                                "struct_type": "image",
                                "func_type": "undefined",
                                "parameters": {"alt": letters_str},
                                "styles": {
                                    "width": str(width_elem) + "px",
                                    "height": str(height_elem) + "px",
                                },
                            }
                        )

        for element_data in recognized_elements:
            ScenarioElement.objects.create(scenario=scenario, **element_data)

        return scenario
