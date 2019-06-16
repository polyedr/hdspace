from rest_framework_bulk import BulkModelViewSet

from apps.virtualize.serializers import ScenarioElementSerializer
from apps.projects.models import ScenarioElement
from rest_framework import generics


# class ScenarioElementMultipleViewSet(BulkModelViewSet):
#     serializer_class = ScenarioElementMultipleSerializer
#     queryset = ScenarioElement.objects.all()
#


class ScenarioElementList(generics.ListCreateAPIView):
    """
    Get list of the segmentations or create a new segmentation
    """

    queryset = ScenarioElement.objects.all()
    serializer_class = ScenarioElementSerializer

    def perform_create(self, serializer):
        serializer.save()


class ScenarioElementDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a segmentation
    """

    queryset = ScenarioElement.objects.all()
    serializer_class = ScenarioElementSerializer
