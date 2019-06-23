from rest_framework_bulk import BulkModelViewSet
from apps.virtualize.serializers import ScreenScenarioSerializer
from apps.projects.models import ScreenScenario
from rest_framework import generics


# class ScenarioElementMultipleViewSet(BulkModelViewSet):
#     serializer_class = ScenarioElementMultipleSerializer
#     queryset = ScenarioElement.objects.all()
#


class ScreenScenarioList(generics.ListCreateAPIView):
    """
    Get list of the segmentations or create a new segmentation
    """

    queryset = ScreenScenario.objects.all()
    serializer_class = ScreenScenarioSerializer

    def perform_create(self, serializer):
        serializer.save()


class ScreenScenarioDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a segmentation
    """

    queryset = ScreenScenario.objects.all()
    serializer_class = ScreenScenarioSerializer
