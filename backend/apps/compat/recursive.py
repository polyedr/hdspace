"""Minimal RecursiveField replacement for rest_framework_recursive."""
from rest_framework import serializers


class RecursiveField(serializers.Serializer):
    def __init__(self, **kwargs):
        self.many = kwargs.pop("many", False)
        super().__init__(**kwargs)

    def to_representation(self, value):
        parent = self.parent
        while parent is not None and not isinstance(parent, serializers.Serializer):
            parent = getattr(parent, "parent", None)
        serializer_class = parent.__class__ if parent is not None else serializers.Serializer
        if self.many:
            return serializer_class(value, many=True, context=self.context).data
        return serializer_class(value, context=self.context).data

    def to_internal_value(self, data):
        parent = self.parent
        while parent is not None and not isinstance(parent, serializers.Serializer):
            parent = getattr(parent, "parent", None)
        serializer_class = parent.__class__ if parent is not None else serializers.Serializer
        if self.many:
            return serializer_class(data=data, many=True, context=self.context).to_internal_value(data)
        return serializer_class(data=data, context=self.context).to_internal_value(data)
