from project.settings import model, MEDIA_ROOT
from rest_framework import serializers

from apps.projects.models import ScenarioElement, ScreenScenario
import cv2
import pytesseract

config_tesseract = "-l eng --oem 1 --psm 3"

# only letters will be in string
def letters(input):
    return "".join(filter(str.isalpha, input))


keyword_dict = {"mail": "email", "email": "email", "mai1": "email", "emai1": "email"}




'''
# Some initial image to count is required for the current solution
imgpath = MEDIA_ROOT + "/uploads/" + "2.png"
# imgpath = ""
counted_elements = count_elements(imgpath)
# print(counted_elements)
'''

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
    # elements = ScenarioElementSerializer(many=True, read_only=True)
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
            # "screenscenario"
        )
        extra_kwargs = {"elements": {"read_only": True}, "image": {"write_only": True}}
        # extra_kwargs = {"elements": {"read_only": True}}

    def create(self, validated_data):
        scenario_data = {
            "name": "string1",
            "type": "login",
            "struct_type": "scenario",
            "parameters": {},
            # "image": validated_data["image"],
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
            img = cv2.imread(imgpath)

            results = model.detect([img], verbose=1)
            r = results[0]
            # r["rois"]
            # r["class_ids"]
            # print(img.shape)
            [h, w, d] = img.shape
            for (roi, class_id) in zip(r["rois"], r["class_ids"]):
                y1, x1, y2, x2 = roi
                roi_our = img[y1:y2, x1:x2]
                text = pytesseract.image_to_string(roi_our, config=config_tesseract)
                # print(text)
                width_elem = x2 - x1
                height_elem = y2 - y1
                if class_id == 1:
                    letters_str = letters(text)
                    is_found = 0
                    for key, value in keyword_dict.items():
                        if letters_str.lower().find(key) != -1:
                            recognized_elements.append(
                                {
                                    "struct_type": class_id,
                                    "func_type": value,
                                    "parameters": {"placeholder": text},
                                    "styles": {
                                        "width": str(width_elem) + "px",
                                        "height": str(height_elem) + "px",
                                    },
                                }
                            )
                            is_found = 1
                            break
                    if not is_found:
                        recognized_elements.append(
                            {
                                "struct_type": 6,
                                "func_type": "undefined",
                                "parameters": {
                                    "xmin": x1,
                                    "xmax": x2,
                                    "ymin": y1,
                                    "ymax": y2,
                                },
                                "styles": {
                                    "width": str(width_elem) + "px",
                                    "height": str(height_elem) + "px",
                                },
                            }
                        )
                else:
                    recognized_elements.append(
                        {
                            "struct_type": 6,
                            "func_type": "undefined",
                            "parameters": {"xmin": x1, "xmax": x2, "ymin": y1, "ymax": y2},
                            "styles": {
                                "width": str(width_elem) + "px",
                                "height": str(height_elem) + "px",
                            },
                        }
                    )

            # Define structural class as a string
            for recognized_element in recognized_elements:
                if recognized_element["struct_type"] == 1:
                    recognized_element.update({"struct_type": "email"})
                else:
                    recognized_element.update({"struct_type": "image"})

            print(recognized_elements)


        scenarioelements = recognized_elements

        for scenarioelement_data in scenarioelements:
            ScenarioElement.objects.create(scenario=scenario, **scenarioelement_data)

        return scenario
