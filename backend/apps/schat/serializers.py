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
                api_key="jfcd9hhxbwq8", api_secret="umgv5enpu6bd644ft7g4em5h3e9zcf5fmf635xm3awzugfatz6tajkft94zv6yma"
            )
            streamtoken = server_client.create_token(str(self.user.id))
            data["streamchat"] = streamtoken
        except Exception:
            pass

        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)

        return data
