from rest_framework import serializers
from rest_framework_bulk import BulkSerializerMixin, BulkListSerializer
from rest_framework_recursive.fields import RecursiveField

from .models import ScenarioElement

class ScenarioElementSerializer(serializers.ModelSerializer):
    parameters = serializers.JSONField()
    styles = serializers.JSONField()
    children = RecursiveField(required=False, allow_null=True, many=True)
    scenario = serializers.PrimaryKeyRelatedField(source="scenario.id", read_only=True)
    # image = serializers.ImageField()

    class Meta:
        model = ScenarioElement
        fields = (
            "id",
            "scenario",
            "name",
            "children",
            "struct_type",
            "func_type",
            "direction",
            "buoyancy",
            "image",
            "parameters",
            "styles",
            "shared",
        )
        ref_name = "ScenarioElements"  # Added to avoid SwaggerGeneration Conflicts

    def create(self, validated_data):
        # Remove nested objects to handle separately
        children = validated_data.pop("children", [])
        node = ScenarioElement.objects.create(
            # parent is null only on the root node
            parent=self.context.get("parent"),
            **validated_data
        )
        # Multiple level of the recursion
        for child_data in children:
            s = ScenarioElementSerializer(data=child_data, context={"parent": node})
            s.is_valid(raise_exception=True)
            s.save()
        return node

    def update(self, instance, validated_data):
        # Remove nested objects to handle separately
        children = validated_data.pop("children", [])
        node = super().update(instance, validated_data)
        for child_data in children:
            # child_data['scenario'] = child_data['scenario'].pk
            s = ScenarioElementSerializer(data=child_data, context={"parent": node})
            s.is_valid(raise_exception=True)
            s.save()
        return node


# The serializer to change the children array only
class ScenarioElementSerializerRecursive(serializers.ModelSerializer):
    children = serializers.PrimaryKeyRelatedField(
        queryset=ScenarioElement.objects.all(), many=True, required=False
    )

    class Meta:
        model = ScenarioElement
        fields = ("id", "name", "children")


class ScenarioElementMultipleSerializer(
    BulkSerializerMixin, serializers.ModelSerializer
):
    parameters = serializers.JSONField()
    styles = serializers.JSONField()
    children = RecursiveField(required=False, allow_null=True, many=True)
    scenario = serializers.PrimaryKeyRelatedField(source="scenario.id", read_only=True)

    class Meta:
        model = ScenarioElement
        fields = (
            "id",
            "scenario",
            "name",
            "children",
            "struct_type",
            "func_type",
            "direction",
            "buoyancy",
            "image",
            "parameters",
            "styles",
            "shared",
        )
        list_serializer_class = BulkListSerializer

    def create(self, validated_data):
        # Remove nested objects to handle separately
        children = validated_data.pop("children", [])
        node = ScenarioElement.objects.create(
            # parent is null only on the root node
            parent=self.context.get("parent"),
            **validated_data
        )
        for child_data in children:
            # child_data['scenario'] = child_data['scenario'].pk
            s = ScenarioElementSerializer(data=child_data, context={"parent": node})
            s.is_valid(raise_exception=True)
            s.save()
        return node

    def update(self, instance, validated_data):
        # Remove nested objects to handle separately
        children = validated_data.pop("children", [])
        node = super().update(instance, validated_data)
        for child_data in children:
            # child_data['scenario'] = child_data['scenario'].pk
            s = ScenarioElementSerializer(data=child_data, context={"parent": node})
            s.is_valid(raise_exception=True)
            s.save()
        return node


class ScenarioElementMultipleRecursiveSerializer(
    BulkSerializerMixin, serializers.ModelSerializer
):
    children = serializers.PrimaryKeyRelatedField(
        queryset=ScenarioElement.objects.all(), many=True, required=False
    )

    class Meta:
        model = ScenarioElement
        fields = ("id", "name", "children")
        list_serializer_class = BulkListSerializer

    def create(self, validated_data):
        # Remove nested objects to handle separately
        children = validated_data.pop("children", [])
        node = ScenarioElement.objects.create(
            # parent is null only on the root node
            parent=self.context.get("parent"),
            **validated_data
        )
        for child_data in children:
            # child_data['scenario'] = child_data['scenario'].pk
            s = ScenarioElementSerializerRecursive(data=child_data, context={"parent": node})
            s.is_valid(raise_exception=True)
            s.save()
        return node
