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
    scenarios = ScreenScenarioSerializer(many=True)

    class Meta:
        model = PreSegmentation
        fields = ("id", "screen", "image", "scenarios")

    def create(self, validated_data):
        scenarios = validated_data["scenarios"]
        scenarioelements = scenarios
        presegmentation = PreSegmentation.objects.create(
            screen=validated_data["screen"]
        )

        for scenario_data in scenarios:
            scenario = ScreenScenario.objects.create(
                presegmentation=presegmentation, **scenario_data
            )

            for scenarioelement_data in scenarioelements:
                ScenarioElement.objects.create(
                    scenario=scenario, **scenarioelement_data
                )

        return presegmentation


"""
class ScreenScenarioSerializer(serializers.ModelSerializer):
    # parameters = serializers.JSONField()
    # styles = serializers.JSONField()
    image = serializers.ImageField(max_length=None, allow_empty_file=True, use_url=True)
    class Meta:
        model = ScreenScenario
        fields = (
            "id",
            "name",
            "type",
            "buoyancy",
            "elements",
            "parameters",
            "styles",
            "screen",
            "image"
        )
        extra_kwargs = {
            "elements": {"read_only": True},
            "parameters": {"read_only": True},
            "styles": {"read_only": True},
            "name": {"read_only": True},
            "type": {"read_only": True},
            "buoyancy": {"read_only": True}
        }
        # fields = "__all__"


class ScenarioElementSerializer(serializers.ModelSerializer):
    parameters = serializers.JSONField()
    styles = serializers.JSONField()

    class Meta:
        model = ScenarioElement
        fields = ("id", "name", "type", "buoyancy", "parameters", "styles")
"""
