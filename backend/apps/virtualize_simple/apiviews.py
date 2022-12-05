import os

from rest_framework.views import APIView
from rest_framework.response import Response
from keras.preprocessing.image import load_img
from keras_preprocessing.image import img_to_array

from apps.virtualize_simple.serializers import ProjectScreenSerializer, \
    ScenarioElementAssemblingSerializer, ScenarioElementFreecanvasSerializer
from apps.projects.models import ScenarioElement, ProjectScreen

from rest_framework import status, generics, permissions

if os.environ.get("ENV_NAME") == 'Staging':
    from project.settings import model_forms, model_headers, model_footers

'''
class ScenarioElementList(generics.CreateAPIView):
    """
    Create a new DOM of the neural network
    """

    queryset = ScenarioElement.objects.all()
    serializer_class = ScenarioElementSerializer

    def perform_create(self, serializer):
        serializer.save()
'''

class ScenarioElementAssemblingList(generics.CreateAPIView):
    """
    Create a new DOM of the neural network based on pre-defined annotation
    """

    queryset = ScenarioElement.objects.all()
    serializer_class = ScenarioElementAssemblingSerializer

    def perform_create(self, serializer):
        serializer.save()


class ScenarioElementFreecanvasList(generics.CreateAPIView):
    """
    Create a new DOM of the neural network based on free canvas
    """

    queryset = ScenarioElement.objects.all()
    serializer_class = ScenarioElementFreecanvasSerializer

    def perform_create(self, serializer):
        serializer.save()


class ProjectScreenList(generics.CreateAPIView):
    """
    Create a new project screen with an image annotation
    """

    queryset = ProjectScreen.objects.all()
    serializer_class = ProjectScreenSerializer


# Copying the element
class MaskRCNNView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        image = request.data["image"]
        imgpath = image
        block_type = request.data["block_type"]  # forms, headers, footers
        region_dataset = block_type
        # Loading the image and converting to the numpy array
        if imgpath:
            img = load_img(imgpath)
            img = img_to_array(img)

        # Detect elements for the case of "forms", "headers", "footers"
        r = []
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
            del r["masks"] # Remove masks
            print(r)

            # print(r_dumped)
            # Detect elements with Mask R CNN model end
        if r:
            return Response(r, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
