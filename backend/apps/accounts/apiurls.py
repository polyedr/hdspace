"""Urls for the accounts api"""

from django.urls import path, include
from schema_graph.views import Schema

from .apiviews import (
    UserList,
    UserDetail,
    ProfileList,
    ProfileDetail,
    TeamList,
    TeamMemberDetail,
    TeamMember,
    TeamMemberList,
    TeamDetail,
)


api_user_patterns = [
    path("users/", UserList.as_view()),
    path("users/<int:pk>/", UserDetail.as_view()),
]

api_profile_patterns = [
    path("profiles/", ProfileList.as_view()),
    path("profiles/<int:pk>/", ProfileDetail.as_view()),
]

api_teammember_patterns = [
    path("teammembers/", TeamMemberList.as_view()),
    path("teammembers/<int:pk>/", TeamMemberDetail.as_view()),
]

api_team_patterns = [
    path("teams/", TeamList.as_view()),
    path("teams/<int:pk>/", TeamDetail.as_view()),
]

api_sharedlink_patterns = [
    path("sharedlink/", SharedlinkView.as_view()),
]

app_name = "api_accounts"
urlpatterns = [
    path("", include(api_user_patterns)),
    path("", include(api_profile_patterns)),
    path("", include(api_sharedlink_patterns)),
    # path("", include(api_teammember_patterns)),
    # path("", include(api_team_patterns)),
    path("graph/", Schema.as_view()),
]
