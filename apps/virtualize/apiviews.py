from rest_framework_bulk import BulkModelViewSet

from apps.virtualize.serializers import ScenarioElementMultipleSerializer
from apps.projects.models import ScenarioElement


class ScenarioElementMultipleViewSet(BulkModelViewSet):
    serializer_class = ScenarioElementMultipleSerializer
    queryset = ScenarioElement.objects.all()
