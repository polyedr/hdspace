from apps.virtualize_simple.serializers import ScreenScenarioSerializer
from apps.projects.models import ScreenScenario
from rest_framework import generics


class ScreenScenarioList(generics.ListCreateAPIView):
    """
    Get list of the segmentations or create a new scenario of the neural network
    """

    queryset = ScreenScenario.objects.all()
    serializer_class = ScreenScenarioSerializer

    def perform_create(self, serializer):
        serializer.save()


class ScreenScenarioDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a segmentation of the neural network
    """

    queryset = ScreenScenario.objects.all()
    serializer_class = ScreenScenarioSerializer
