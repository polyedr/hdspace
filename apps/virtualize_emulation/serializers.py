from rest_framework import serializers

from apps.projects.models import ScreenScenario, ScenarioElement
from .models import PreSegmentation


class ScreenScenarioSerializer(serializers.ModelSerializer):
    parameters = serializers.JSONField()
    styles = serializers.JSONField()

    class Meta:
        model = ScreenScenario
        fields = (
            "id",
            "screen",
            "name",
            "type",
            "buoyancy",
            "elements",
            "parameters",
            "styles",
            # "screenscenario"
        )
        extra_kwargs = {"elements": {"read_only": True}}


class PreSegmentationSerializer(serializers.ModelSerializer):
    scenarios = ScreenScenarioSerializer(many=True, required=False)

    class Meta:
        model = PreSegmentation
        fields = ("id", "screen", "image", "scenarios")
        extra_kwargs = {"scenarios": {"read_only": True}}

    def create(self, validated_data):
        # This commented line was for the flexible scenarios
        # scenarios = validated_data["scenarios"]
        scenarios = [
            {"name": "string1", "type": "login", "parameters": {}, "styles": {}},
            {"name": "string1", "type": "login", "parameters": {}, "styles": {}},
            {"name": "string2", "type": "login", "parameters": {}, "styles": {}},
        ]
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

        screen = validated_data["screen"]

        presegmentation = PreSegmentation.objects.create(
            screen=screen
        )

        for scenario_data in scenarios:
            scenario = ScreenScenario.objects.create(
                presegmentation=presegmentation, screen=screen, **scenario_data
            )

            for scenarioelement_data in scenarioelements:
                ScenarioElement.objects.create(
                    scenario=scenario, **scenarioelement_data
                )

        return presegmentation
