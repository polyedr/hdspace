import pymongo
from PIL import Image
from rest_framework import serializers

from apps.projects.models import ScenarioElement, ScreenScenario

from apps.virtualize.utils.metaCustomUtils import *

client = pymongo.MongoClient("localhost", 27017)  # maxPoolSize=50
db = client.MeduzaDb
db_main = client.mainDB


class ScenarioElementSerializer(serializers.ModelSerializer):
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


class ScreenScenarioSerializer(serializers.ModelSerializer):
    # elements = ScenarioElementSerializer(many=True, read_only=True)
    parameters = serializers.JSONField()
    styles = serializers.JSONField()
    image = serializers.ImageField()

    class Meta:
        model = ScreenScenario
        fields = (
            "id",
            "screen",
            "name",
            "parent_id",
            "type",
            "direction",
            "buoyancy",
            "elements",
            "parameters",
            "styles",
            "image",
            # "screenscenario"
        )
        extra_kwargs = {"elements": {"read_only": True}, "image": {"write_only": True}}

    def create(self, validated_data):
        scenario_data = {
            "name": "string1",
            "type": "login",
            "struct_type": "scenario",
            "parameters": {},
        }

        """
        Scenarioelements for the current scenario.
        These elements relate to the MeduzaDb collections
        Pictures, textboxes and paragraphs are the first array to check.
        """
        scenarioelements = []
        scenarioelements.append("element_textbox")

        screen = validated_data["screen"]

        scenario = ScreenScenario.objects.create(screen=screen, **scenario_data)

        for scenarioelement_data in scenarioelements:
            ScenarioElement.objects.create(scenario=scenario, **scenarioelement_data)

        return scenario
