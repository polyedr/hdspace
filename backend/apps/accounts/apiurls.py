"""Urls for the accounts api"""

from django.urls import path, include

from .apiviews import (
    UserList,
    UserDetail,
    ProfileList,
    ProfileDetail,
    TeamList,
    TeamMemberDetail,
    TeamMember,
    TeamMemberList,
    TeamDetail, SharedlinkView, SharedlinkprojectView, SharedlinknewuserView, SharedLinkList, SharedLinkDetail,
)


api_user_patterns = [
    path("users/", UserList.as_view()),
    path("users/<int:pk>/", UserDetail.as_view()),
]

api_profile_patterns = [
    path("profiles/", ProfileList.as_view()),
    path("profiles/<int:pk>/", ProfileDetail.as_view()),
]

api_sharedlink_patterns = [
    path("sharedlinks/", SharedLinkList.as_view()),
    path("sharedlinks/<int:pk>/", SharedLinkDetail.as_view()),
]

api_teammember_patterns = [
    path("teammembers/", TeamMemberList.as_view()),
    path("teammembers/<int:pk>/", TeamMemberDetail.as_view()),
]

api_team_patterns = [
    path("teams/", TeamList.as_view()),
    path("teams/<int:pk>/", TeamDetail.as_view()),
]

api_sharelink_patterns = [
    path("sharelinknewuser/", SharedlinknewuserView.as_view()),  # Share link for the new user
    path("sharelinkuser/", SharedlinkView.as_view()),  # Share link for the internal user
    path("sharelinkuv/", SharedlinkprojectView.as_view()),  # Share link for the projectviewer user
]

app_name = "api_accounts"
urlpatterns = [
    path("", include(api_user_patterns)),
    path("", include(api_profile_patterns)),
    path("", include(api_sharedlink_patterns)),
    path("", include(api_sharelink_patterns)),
    # path("", include(api_teammember_patterns)),
    # path("", include(api_team_patterns)),
]
