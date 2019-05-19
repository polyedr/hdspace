from rest_framework import serializers

from apps.projects.models import ScreenScenario
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
        # fields = "__all__"
    """
    def create(self, validated_data):
        presegmentation = PreSegmentation(screen=validated_data["screen"])
        presegmentation.save()
        return presegmentation


    def create(self, validated_data):
        scenarios = validated_data["scenarios"]
        # screen = validated_data.pop("screen")
        instance = PreSegmentation.objects.create(
            **validated_data
        )
        for scenario_data in scenarios:
            ScreenScenario.objects.create(**scenario_data)
        return instance
    """

    def create(self, validated_data):
        scenarios = validated_data["scenarios"]

        presegmentation = PreSegmentation.objects.create(screen=validated_data["screen"])


        for scenario_data in scenarios:
            ScreenScenario.objects.create(presegmentation=presegmentation, **scenario_data)

        return presegmentation




"""
class ContactSerializer(serializers.HyperlinkedModelSerializer):
    phone_numbers = ContactPhoneNumberSerializer(source='contactphonenumber_set', many=True)

    user = serializers.CurrentUserDefault()

    class Meta:
        model = Contact
        fields = ('url', 'id', 'first_name', 'last_name', 'date_of_birth', 'phone_numbers')

    def create(self, validated_data):
        phone_numbers = validated_data.pop('contactphonenumber_set')
        user = validated_data.pop('user_id')
        instance = Contact.objects.create(
            user=user,
            **validated_data
        )
        for phone_data in phone_numbers:
            ContactPhoneNumber.objects.create(contact=instance, **phone_data)
        return instance
"""
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
