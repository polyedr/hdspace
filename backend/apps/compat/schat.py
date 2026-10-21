"""No-op Stream Chat client used while chat is disabled."""


class DisabledStreamChat:
    def create_token(self, user_id):
        return f"disabled-stream-token-{user_id}"

    def query_users(self, *args, **kwargs):
        return {"users": []}

    def update_user(self, *args, **kwargs):
        return {}

    def update_users(self, *args, **kwargs):
        return {}

    def update_user_partial(self, *args, **kwargs):
        return {}

    def update_users_partial(self, *args, **kwargs):
        return {}

    def update_app_settings(self, *args, **kwargs):
        return {}

    def channel(self, *args, **kwargs):
        return self

    def update(self, *args, **kwargs):
        return {}


schat_client = DisabledStreamChat()
