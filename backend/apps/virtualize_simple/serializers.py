from rest_framework import serializers

from apps.projects.models import ScenarioElement, ScreenScenario

import os
import sys
import cv2
import pytesseract

# Root directory of the project
from project.settings import MEDIA_ROOT, BASE_DIR

# ROOT_DIR = os.path.abspath("/home/user/Desktop/Projects/adeviio/adeviio_restapi/12042019/master/apps/virtualize_simple/mask_rcnn")
ROOT_DIR = os.path.abspath(BASE_DIR + "/apps/virtualize_simple/mask_rcnn")
# Import Mask RCNN
sys.path.append(ROOT_DIR)  # To find local version of the library
from apps.virtualize_simple.mask_rcnn.mrcnn.config import Config
import apps.virtualize_simple.mask_rcnn.mrcnn.model as modellib

# Directory to save logs and trained model
MODEL_DIR = os.path.join(ROOT_DIR, "logs")

# Configurations
class LoginConfig(Config):
    """Configuration for training on the toy shapes dataset.
    Derives from the base Config class and overrides values specific
    to the toy shapes dataset.
    """

    # Train on 1 GPU and 8 images per GPU. We can put multiple images on each
    # GPU because the images are small. Batch size is 8 (GPUs * images/GPU).
    GPU_COUNT = 1
    IMAGES_PER_GPU = 8

    # Use small images for faster training. Set the limits of the small side
    # the large side, and that determines the image shape.
    IMAGE_MIN_DIM = 128
    IMAGE_MAX_DIM = 128

    # Use smaller anchors because our image and objects are small
    RPN_ANCHOR_SCALES = (8, 16, 32, 64, 128)  # anchor side in pixels

    # Reduce training ROIs per image because the images are small and have
    # few objects. Aim to allow ROI sampling to pick 33% positive ROIs.
    TRAIN_ROIS_PER_IMAGE = 32

    # Use a small epoch since the data is simple
    STEPS_PER_EPOCH = 100

    # use small validation steps since the epoch is small
    VALIDATION_STEPS = 5

    # Give the configuration a recognizable name
    NAME = "form_login"

    # Number of classes (including background)
    NUM_CLASSES = 1 + 7  # Background + form_login

    # Number of training steps per epoch
    STEPS_PER_EPOCH = 10

    # Skip detections with < 90% confidence
    DETECTION_MIN_CONFIDENCE = 0.9


config = LoginConfig()
# config.display()
config_tesseract = "-l eng --oem 1 --psm 3"


class InferenceConfig(LoginConfig):
    GPU_COUNT = 1
    IMAGES_PER_GPU = 1


inference_config = InferenceConfig()

# Recreate the model in inference mode
model = modellib.MaskRCNN(
    mode="inference", config=inference_config, model_dir=MODEL_DIR
)

# Get path to saved weights
# Either set a specific path or find last trained weights
# model_path = os.path.join(ROOT_DIR, ".h5 file name here")
model_path = model.find_last()

# Load trained weights
# print("Loading weights from ", model_path)
model.load_weights(model_path, by_name=True)
# only letters will be in string
def letters(input):
    return "".join(filter(str.isalpha, input))


keyword_dict = {"mail": "email", "email": "email", "mai1": "email", "emai1": "email"}


def count_elements(path_img):
    # path_img=dataset_val.image_reference(image_id)
    recognized_elements = []

    if path_img:

        img = cv2.imread(path_img)
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

    return recognized_elements


# Some initial image to count is required for the current solution
imgpath = MEDIA_ROOT + "/uploads/" + "2.png"
# imgpath = ""
counted_elements = count_elements(imgpath)
# print(counted_elements)


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

        # print(imgpath)
        if imgpath:
            counted_elements = count_elements(imgpath)
            print(counted_elements)
        else:
            counted_elements = []

        scenarioelements = counted_elements

        for scenarioelement_data in scenarioelements:
            ScenarioElement.objects.create(scenario=scenario, **scenarioelement_data)

        return scenario
