"""Minimal taggit serializer helpers."""
from rest_framework import serializers


class TagListSerializerField(serializers.ListField):
    child = serializers.CharField()

    def to_representation(self, value):
        if hasattr(value, "all"):
            return [tag.name for tag in value.all()]
        if hasattr(value, "names"):
            return list(value.names())
        return list(value or [])


class TaggitSerializer(serializers.Serializer):
    def create(self, validated_data):
        tags = validated_data.pop("tags", None)
        instance = super().create(validated_data)
        if tags is not None and hasattr(instance, "tags"):
            instance.tags.set(tags)
        return instance

    def update(self, instance, validated_data):
        tags = validated_data.pop("tags", None)
        instance = super().update(instance, validated_data)
        if tags is not None and hasattr(instance, "tags"):
            instance.tags.set(tags)
        return instance
