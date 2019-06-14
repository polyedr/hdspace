from rest_framework import serializers
from rest_framework_bulk import BulkSerializerMixin, BulkListSerializer

from apps.projects.models import ScenarioElement


class ScenarioElementMultipleSerializer(
    BulkSerializerMixin, serializers.ModelSerializer
):
    parameters = serializers.JSONField()
    styles = serializers.JSONField()

    class Meta:
        model = ScenarioElement
        fields = (
            "id",
            "scenario",
            "name",
            "struct_type",
            "func_type",
            "func_type_human",
            "buoyancy",
            "parameters",
            "styles",
        )
        list_serializer_class = BulkListSerializer

    def create(self, validated_data):
        # This commented line was for the flexible scenarios
        # scenarios = validated_data["scenarios"]
        # This commented line was for the flexible elements
        # scenarioelements = scenarios
        scenarioelements = [
            {
                "name": "string",
                "struct_type": "widget",
                "func_type": "widget",
                "func_type_human": "undefined",
                "buoyancy": 0,
                "parameters": {},
                "styles": {},
            },
            {
                "name": "string",
                "struct_type": "widget",
                "func_type": "widget",
                "func_type_human": "undefined",
                "buoyancy": 0,
                "parameters": {},
                "styles": {},
            },
        ]
        #
        # screen = validated_data["screen"]
        #
        # presegmentation = PreSegmentation.objects.create(
        #     screen=screen
        # )

        scenarioelementsinstancesarray = []
        for scenarioelement_data in scenarioelements:
            SE = ScenarioElement.objects.create(**scenarioelement_data)
            scenarioelementsinstancesarray.append(SE)

        return scenarioelementsinstancesarray

