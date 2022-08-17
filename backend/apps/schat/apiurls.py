from django.urls import path
from apps.schat.apiviews import (
    SchatView,
    SchatSyncingUserView,
    SchatSyncingChannelView,
    SchatSyncingUsersView,
    SchatCreateChannelView, SchatUpdatePartialUserView, SchatUpdatePartialUsersView,
)

app_name = "schat"

urlpatterns = [
    path("", SchatView.as_view()),
    path("sync-user/", SchatSyncingUserView.as_view()),  # Syncing one user
    path("sync-users/", SchatSyncingUsersView.as_view()),  # Syncing many users
    path("update-user-partial/", SchatUpdatePartialUserView.as_view()),  # Syncing one user
    path("update-users-partial/", SchatUpdatePartialUsersView.as_view()),  # Syncing many users
    path("create-channel/", SchatCreateChannelView.as_view()),  # Create channel
    path("sync-channel/", SchatSyncingChannelView.as_view()),  # Sync channel
    # path("nlp/", DescribedHTMLView.as_view()),
]
