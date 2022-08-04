import stream_chat
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# The custom stream token serializer
from project import settings


class TokenObtainSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)

        try:
            server_client = stream_chat.StreamChat(
                api_key=settings.local.STREAM_API_KEY, api_secret=settings.local.STREAM_API_SECRET
            )
            streamtoken = server_client.create_token(self.user.id)
            data["streamchat"] = streamtoken
        except Exception:
            pass

        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)

        return data
