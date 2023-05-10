import os
import sys
from .base import BASE_DIR, white_list

SITE_NAME = "app-staging.adevi.io"
DOMAIN = ('app-staging.adevi.io')
# Djoser settings
DJOSER = {
    'USERNAME_CHANGED_EMAIL_CONFIRMATION': True,
    'PASSWORD_CHANGED_EMAIL_CONFIRMATION': True,
    "PASSWORD_RESET_CONFIRM_URL": "password/reset/confirm/{uid}/{token}",
    "USERNAME_RESET_CONFIRM_URL": "username/reset/confirm/{uid}/{token}",
    "DOMAIN": "app-staging.adevi.io",
    "ACTIVATION_URL": "activate/{uid}/{token}",
    "SEND_ACTIVATION_EMAIL": True,
    "SERIALIZERS": {'activation': 'apps.accounts.serializers.MyActivationSerializer',
                    'token': 'apps.schat.serializers.StreamTokenSerializer',
                    },
    "SOCIAL_AUTH_ALLOWED_REDIRECT_URIS": white_list,  # Redirected URL we listen on google console
}

# Mask R-CNN model initial load
#ROOT_DIR = os.path.abspath(BASE_DIR + "/apps/virtualize_simple/mask_rcnn")
PARENT_BASE_DIR = os.path.dirname(BASE_DIR)
ROOT_DIR = os.path.abspath(PARENT_BASE_DIR + "/mask_rcnn")

# Import Mask RCNN
sys.path.append(ROOT_DIR)  # To find local version of the library
from apps.virtualize_simple.mask_rcnn.mrcnn.config import Config
import apps.virtualize_simple.mask_rcnn.mrcnn.model as modellib
# # Mask R-CNN model initial load
# ROOT_DIR = os.path.abspath(BASE_DIR + "/apps/virtualize_simple/mask_rcnn")
# # Import Mask RCNN
# sys.path.append(ROOT_DIR)  # To find local version of the library
# from apps.virtualize_simple.mask_rcnn.mrcnn.config import Config
# import apps.virtualize_simple.mask_rcnn.mrcnn.model as modellib
# Directory to save logs and trained model
MODEL_DIR = os.path.join(ROOT_DIR, "trained_models")


# Configurations:
class LoginConfig(Config):
    """Configuration for training on the toy shapes dataset.
    Derives from the base Config class and overrides values specific
    to the toy shapes dataset.
    """

    # Give the configuration a recognizable name
    NAME = "form_login"

    # We use a GPU with 12GB memory, which can fit two images.
    # Adjust down if you use a smaller GPU.
    IMAGES_PER_GPU = 2

    # Number of classes (including background).
    # Different models have different number of classes.
    # Here is the case of the login forms config
    NUM_CLASSES = 1 + 7  # Background + form_login

    # Number of training steps per epoch
    STEPS_PER_EPOCH = 200

    # Skip detections with < 90% confidence
    DETECTION_MIN_CONFIDENCE = 0.75


class HeadersConfig(Config):
    """Configuration for training on the toy shapes dataset.
    Derives from the base Config class and overrides values specific
    to the toy shapes dataset.
    """

    # Give the configuration a recognizable name
    NAME = "headers"

    # We use a GPU with 12GB memory, which can fit two images.
    # Adjust down if you use a smaller GPU.
    IMAGES_PER_GPU = 2

    # Number of classes (including background)
    # Different models have different number of classes.
    # Here is the case of the login forms config
    NUM_CLASSES = 1 + 8  # Background + headers

    # Number of training steps per epoch
    STEPS_PER_EPOCH = 200

    # Skip detections with < 90% confidence
    DETECTION_MIN_CONFIDENCE = 0.75


class FootersConfig(Config):
    """Configuration for training on the toy shapes dataset.
    Derives from the base Config class and overrides values specific
    to the toy shapes dataset.
    """

    # Give the configuration a recognizable name
    NAME = "footers"

    # We use a GPU with 12GB memory, which can fit two images.
    # Adjust down if you use a smaller GPU.
    IMAGES_PER_GPU = 2

    # Number of classes (including background)
    # Different models have different number of classes.
    # Here is the case of the login forms config
    NUM_CLASSES = 1 + 5  # Background + footers

    # Number of training steps per epoch
    STEPS_PER_EPOCH = 200

    # Skip detections with < 90% confidence
    DETECTION_MIN_CONFIDENCE = 0.75


config = LoginConfig()
# config.display()


class InferenceConfigForms(LoginConfig):
    GPU_COUNT = 1
    IMAGES_PER_GPU = 1


class InferenceConfigHeaders(HeadersConfig):
    GPU_COUNT = 1
    IMAGES_PER_GPU = 1


class InferenceConfigFooters(FootersConfig):
    GPU_COUNT = 1
    IMAGES_PER_GPU = 1


inference_config_forms = InferenceConfigForms()
inference_config_headers = InferenceConfigHeaders()
inference_config_footers = InferenceConfigFooters()

# Recreate the model in inference mode
model_forms = modellib.MaskRCNN(
    mode="inference", config=inference_config_forms, model_dir=MODEL_DIR
)
model_headers = modellib.MaskRCNN(
    mode="inference", config=inference_config_headers, model_dir=MODEL_DIR
)
model_footers = modellib.MaskRCNN(
    mode="inference", config=inference_config_footers, model_dir=MODEL_DIR
)

# Get path to saved weights
model_forms_path = os.path.join(MODEL_DIR, "mask_rcnn_form_login_0024.h5")
model_headers_path = os.path.join(MODEL_DIR, "mask_rcnn_header_0020.h5")
model_footers_path = os.path.join(MODEL_DIR, "mask_rcnn_footers_0019.h5")
# Model 28 is the best for the 05.05.2020
# model_path = os.path.join(MODEL_DIR, "mask_rcnn_form_login_0028.h5")
# model_path = os.path.join(MODEL_DIR, "mask_rcnn_form_login_0018.h5")

# Load trained weights
model_forms.load_weights(model_forms_path, by_name=True)
model_forms.keras_model._make_predict_function()

model_headers.load_weights(model_headers_path, by_name=True)
model_headers.keras_model._make_predict_function()

model_footers.load_weights(model_footers_path, by_name=True)
model_footers.keras_model._make_predict_function()
