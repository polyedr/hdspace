from apps.virtualize_simple.serializers import ProjectScreenSerializer, ScenarioElementSerializer
from apps.projects.models import ScenarioElement, ProjectScreen
from rest_framework import generics


class ScenarioElementList(generics.CreateAPIView):
    """
    Create a new DOM of the neural network
    """

    queryset = ScenarioElement.objects.all()
    serializer_class = ScenarioElementSerializer

    def perform_create(self, serializer):
        serializer.save()


class ProjectScreenList(generics.ListCreateAPIView):
    """
    Create a new project screen with an image annotation
    """

    queryset = ProjectScreen.objects.all()
    serializer_class = ProjectScreenSerializer
