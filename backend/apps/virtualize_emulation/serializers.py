from rest_framework import serializers
from apps.projects.models import (
    Project,
    ProjectScreen,
    ScreenScenario,
    ScenarioElement,
)


class ScreenScenarioSerializer(serializers.ModelSerializer):
    parameters = serializers.JSONField()
    styles = serializers.JSONField()
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
            "screen"
        )
        # extra_kwargs = {"elements": {"read_only": True}}
        # fields = "__all__"


class ScenarioElementSerializer(serializers.ModelSerializer):
    parameters = serializers.JSONField()
    styles = serializers.JSONField()
    class Meta:
        model = ScenarioElement
        fields = (
            "id",
            "name",
            "type",
            "buoyancy",
            "parameters",
            "styles",
        )

