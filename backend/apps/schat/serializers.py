import stream_chat
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# The custom stream token serializer
class TokenObtainSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)

        try:
            server_client = stream_chat.StreamChat(api_key="STREAM_KEY", api_secret="STREAM_SECRET")
            streamtoken = server_client.create_token('self.request.user')
            data["streamchat"] = streamtoken
        except Exception:
            pass

        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)

        return data
