from rest_framework import serializers
from apps.phrases.models import DescribedHTML


class DescribedHTMLSerializer(serializers.ModelSerializer):
    styles = serializers.JSONField()
    parameters = serializers.JSONField()

    class Meta:
        model = DescribedHTML
        fields = ("sentence", "struct_type", "styles", "parameters", "owner")
        extra_kwargs = {"owner": {"read_only": True}}
        # extra_kwargs = {"wpurl": {"read_only": True}, "wpname": {"write_only": True}}

    def create(self, validated_data):
        # url = validated_data.pop("wpname", None)
        sentence = validated_data["sentence"]

        d_html = DescribedHTML(id=None, **validated_data)

        d_html.struct_type = sentence
        d_html.save()

        return d_html
