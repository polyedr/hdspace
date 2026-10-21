from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from project.settings import schat_client


# The custom stream token serializer
class TokenObtainSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)

        try:
            streamtoken = schat_client.create_token(str(self.user.id))
        except Exception:
            streamtoken = f"disabled-stream-token-{self.user.id}"

        data["streamchat"] = streamtoken
        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)

        return data


class SchatSyncingSerializer(serializers.Serializer):
    """
   Schat syncing users serializer.
   """

    id = serializers.CharField
    role = serializers.CharField
    parameters = serializers.JSONField


class SchatCreateChannelSerializer(serializers.Serializer):
    """
   Schat create channel serializer.
   """

    channel_type = serializers.CharField
    channel_id = serializers.CharField
    user_id = serializers.CharField
