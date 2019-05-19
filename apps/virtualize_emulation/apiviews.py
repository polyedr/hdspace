from rest_framework import generics

from apps.virtualize_emulation.serializers import PreSegmentationSerializer
from apps.virtualize_emulation.models import PreSegmentation


class PreSegmentationList(generics.ListCreateAPIView):
    """
    Get list of the pre-segmnetations or create a new pre-segmentation stub.
    """

    queryset = PreSegmentation.objects.all()
    serializer_class = PreSegmentationSerializer

    def perform_create(self, serializer):
        serializer.save()


class PreSegmentationDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a pre-segmentation
    """

    queryset = PreSegmentation.objects.all()
    serializer_class = PreSegmentationSerializer
