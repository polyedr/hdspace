from apps.virtualize_simple.serializers import ProjectScreenSerializer, \
    ScenarioElementAssemblingSerializer, ScenarioElementFreecanvasSerializer
from apps.projects.models import ScenarioElement, ProjectScreen

from rest_framework import generics

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
