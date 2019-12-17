import copy
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
            "name": "Root",
            "type": "login",
            "struct_type": "scenario",
            "parameters": {},
            "parent_id": -1,
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

            for idx, (roi, class_id, score) in enumerate(
                zip(r["rois"], r["class_ids"], r["scores"])
            ):
                if idx not in excluded_indices:
                    # Simple comparison with Colab results
                    # print(class_id, score)

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
                    """
                    # Apply dilation and erosion to remove some noise
                    kernel = np.ones((1, 1), np.uint8)
                    roi_our = cv2.dilate(roi_our, kernel, iterations=1)
                    roi_our = cv2.erode(roi_our, kernel, iterations=1)
                    """
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
                        letters_str = text

                        fclasses_predictions = []
                        for ts in tess_string:
                            ts.strip()
                            ts = re.sub("[^@a-z A-Z]+", "", ts)
                            # print("ts=", ts)
                            # print([key for key, value in f_dictionary.items() if ts in value])
                            fclass = [
                                key
                                for key, value in f_dictionary.items()
                                if ts in value
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
                                "parameters": {"placeholder": letters_str, "roi": roi},
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
                                "parameters": {"placeholder": letters_str, "roi": roi},
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
                                "parameters": {"placeholder": text, "roi": roi},
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
                                "parameters": {"placeholder": letters_str, "roi": roi},
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
                                "parameters": {"placeholder": letters_str, "roi": roi},
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
                                "parameters": {"placeholder": letters_str, "roi": roi},
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
                                "parameters": {"alt": letters_str, "roi": roi},
                                "styles": {
                                    "width": str(width_elem) + "px",
                                    "height": str(height_elem) + "px",
                                },
                            }
                        )

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
            horizontal_groups = {}
            # Inner scenarios elements list to remove them from recognized_elements
            # befpre the final assignment to the general scenario
            inner_scenarios_elements = set()
            for idx, recognized_element in enumerate(recognized_elements):
                for idx1, recognized_element1 in enumerate(recognized_elements):
                    # Vertical and horizontal groups detection
                    # Check the vertical grouping criteria
                    # Check the horizontal grouping criteria
                    # Assign the placeholder values after grouping with text
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
                    # if class_id in {1, 3, 4} and class_id1 in {1, 3, 4} and (idx != idx1):
                    if recognized_element["struct_type"] in {"textinput", "select", "ocrtext"} and recognized_element1[
                            "struct_type"] in {"textinput", "select", "ocrtext"} and (idx != idx1):
                        # Check if the elements were not assigned to the vertical groups before

                        # Flatten horizontal group keys
                        fhgk = set(i for sub in horizontal_groups.keys() for i in sub)
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

            scenario_vertical_data = {
                "name": "scenario_vertical",
                "type": "common_scenario",
                "struct_type": "container",
                "direction": "vertical",
                "parameters": {},
                "parent_id": scenario.id,
            }

            # Create scenarios for vertical groups
            # Keys are tuples of elements, and the value is a new vertical scenario assigned
            for v_group_key in vertical_groups:
                children = []
                scenario_vertical = ScreenScenario.objects.create(
                    screen=screen, **scenario_vertical_data
                )
                vertical_groups[v_group_key] = scenario_vertical.id
                # Create elements for vertical groups scenarios
                for element_data_vertical in v_group_key:
                    print(element_data_vertical)
                    element_vertical = recognized_elements[element_data_vertical]
                    inner_scenarios_elements.add(element_vertical)
                    scenario_vertical_element = ScenarioElement.objects.create(
                        scenario=scenario_vertical,
                        **element_vertical
                    )
                    # Fill the children list for parameters
                    children.append(str(scenario_vertical_element.id) + "e")
                print("vertical_groups=", vertical_groups)
                print(children)
                scenario_vertical.parameters["children"] = children
                scenario_vertical.save()

            scenario_horizontal_data = {
                "name": "scenario_horizontal",
                "type": "common_scenario",
                "struct_type": "container",
                "direction": "horizontal",
                "parameters": {},
                "parent_id": scenario.id,
            }

            """
            Create scenarios for horizontal groups
            Include scenarios for vertical groups
            Update scenarios for vertical groups with new parents
            """

            for h_group_key in horizontal_groups:
                children = []
                scenario_horizontal = ScreenScenario.objects.create(
                    screen=screen, **scenario_horizontal_data
                )
                horizontal_groups[h_group_key] = scenario_horizontal.id
                # Create elements for horizontal groups scenarios if they're not in vertical grouping already
                for element_data_horizontal in h_group_key:
                    # Compare if in vertical group.
                    # Each horizontal element is being placed not more than at one vertical group
                    # Assign the vertical group if exists
                    vertical_group = (-1, -1)
                    for v_group in vertical_groups:
                        if element_data_horizontal in v_group:
                            vertical_group = v_group

                    if vertical_group == (-1, -1):
                        # If the horizontal element does not exist in any vertical group

                        print("recognized_elements=", recognized_elements)
                        print("element_data_horizontal=", element_data_horizontal)
                        print("recognized_elements[element_data_horizontal]=",
                              recognized_elements[element_data_horizontal])
                        element_horizontal = recognized_elements[element_data_horizontal]
                        inner_scenarios_elements.add(element_horizontal)
                        scenario_horizontal_element = ScenarioElement.objects.create(
                            scenario=scenario_horizontal,
                            **element_horizontal
                        )
                        # Fill the children list for parameters
                        children.append(str(scenario_horizontal_element.id) + "e")
                    else:
                        # If the horizontal element exists in vertical group
                        # Find the related vertical group scenario from its id
                        vertical_group_scenario = ScreenScenario.objects.get(
                            id=vertical_groups[vertical_group]
                        )
                        children.append(str(vertical_group_scenario.id) + "s")
                        vertical_group_scenario.parent_id = scenario_horizontal.id
                        vertical_group_scenario.save()

                print("horizontal_groups=", horizontal_groups)
                print(children)
                scenario_horizontal.parameters["children"] = children
                scenario_horizontal.save()

        # Find all free vertical scenarios.
        # Free vertical scenario does not share any element
        # with horizontal scenario
        # Should check if vertical and horizontal groups exists before these calculations

        if vertical_groups:
            vertical_groups_free = copy.deepcopy(vertical_groups)
        else:
            vertical_groups_free = {}

        if vertical_groups and horizontal_groups:
            for v_group_key in list(vertical_groups_free.keys()):
                for h_group_key in horizontal_groups:
                    # Sets are disjoints if and only if their intersection is the empty set
                    if set(v_group_key).isdisjoint(set(h_group_key)):
                        # print("v_group_key, h_group_key =", v_group_key, h_group_key)
                        del vertical_groups_free[v_group_key]

        children = []
        # recognized_elements_general = recognized_elements - inner_scenarios_elements
        recognized_elements_general = [item for item in recognized_elements if item not in inner_scenarios_elements]
        for element_data in recognized_elements_general:
            print(element_data)
            # Get all the elements left. Mark them as children.
            scenario_general_element = ScenarioElement.objects.create(
                scenario=scenario, **element_data
            )
            # Fill the children information to the main scenario for the parameters
            children.append(str(scenario_general_element.id) + "e")

        # Get all the horizontal scenarios. Mark them as children.
        if horizontal_groups:
            for h_group_key in horizontal_groups:
                children.append(str(horizontal_groups[h_group_key]) + "s")

        # Get all the free vertical scenarios. Mark them as children.
        if vertical_groups_free:
            for v_group_key in vertical_groups_free:
                children.append(str(vertical_groups_free[v_group_key]) + "s")

        scenario.parameters["children"] = children

        return scenario
