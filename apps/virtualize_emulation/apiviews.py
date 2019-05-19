from rest_framework import generics
# from apps.projects.models import Project, ProjectMember, ScreenScenario

# from apps.projects.serializers import ProjectSerializer, ProjectMemberSerializer
from apps.virtualize_emulation.serializers import PreSegmentationSerializer
from apps.virtualize_emulation.models import PreSegmentation

'''
# Scenarios with elements api views
class ScreenScenarioList(generics.CreateAPIView):
    """
    Сreate a new screen scenario.
    """

    queryset = ScreenScenario.objects.all()
    serializer_class = ScreenScenarioSerializer


class ScreenScenarioDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a screen scenario
    """

    queryset = ScreenScenario.objects.all()
    serializer_class = ScreenScenarioSerializer

'''


class PreSegmentationList(generics.ListCreateAPIView):
    """
    Сreate a new pre-segmentation stub.
    """

    queryset = PreSegmentation.objects.all()
    serializer_class = PreSegmentationSerializer


class PreSegmentationDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a pre-segmentation
    """

    queryset = PreSegmentation.objects.all()
    serializer_class = PreSegmentationSerializer
