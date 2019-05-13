from rest_framework import generics
from apps.projects.models import Project, ProjectMember, ScreenScenario

from apps.projects.serializers import ProjectSerializer, ProjectMemberSerializer
from apps.virtualize_emulation.serializers import ScreenScenarioSerializer


# Scenarios with elements api views
class ScreenScenarioList(generics.ListCreateAPIView):
    """
    List all screen scenarios, or create a new screen scenario.
    """

    queryset = ScreenScenario.objects.all()
    serializer_class = ScreenScenarioSerializer


class ScreenScenarioDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a screen scenario
    """

    queryset = ScreenScenario.objects.all()
    serializer_class = ScreenScenarioSerializer
