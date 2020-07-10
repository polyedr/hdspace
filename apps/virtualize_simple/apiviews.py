from apps.virtualize_simple.serializers import ScenarioElementSerializer
from apps.projects.models import ScenarioElement
from rest_framework import generics


class ScenarioElementList(generics.ListCreateAPIView):
    """
    Get list of the segmentations or create a new scenario of the neural network
    """

    queryset = ScenarioElement.objects.all()
    serializer_class = ScenarioElementSerializer

    def perform_create(self, serializer):
        serializer.save()


class ScenarioElementDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a segmentation of the neural network
    """

    queryset = ScenarioElement.objects.all()
    serializer_class = ScenarioElementSerializer
