import stream_chat
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class TokenObtainSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)

        server_client = stream_chat.StreamChat(api_key="STREAM_KEY", api_secret="STREAM_SECRET")
        streamtoken = server_client.create_token('self.request.user')

        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)
        data["streamchat"] = streamtoken

        return data
