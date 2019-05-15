from rest_framework import serializers
from apps.virtualize_emulation.models import PreSegmentation


class PreSegmentationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreSegmentation
        fields = ("id", "screen", "image")


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
