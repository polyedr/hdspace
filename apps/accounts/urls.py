from django.urls import path, include
from .views import auth, profile, team, user

auth_patterns = [
    path("login/", auth.LoginView.as_view(), name="login"),
    path("registration/", auth.RegistrationView.as_view(), name="registration"),
    path("confirmation/<uuid:confirmation_token>/", auth.EmailConfirmationView.as_view(), name="confirmation"),
    path("forgot-password/", auth.ForgotPasswordView.as_view(), name="forgot_password"),
    path("reset-password/<uuid:reset_token>/", auth.ResetPasswordView.as_view(), name="reset_password"),
    path("logout/", auth.logout_view, name="logout"),
]

profile_patterns = [
    path("profile/", profile.ProfileView.as_view(), name="profile"),
    path("change-password/", profile.ChangePasswordView.as_view(), name="change_password"),
    path("change-avatar/", profile.ChangeAvatarView.as_view(), name="change_avatar"),
]

team_patterns = [
    path("teams/", team.TeamView.as_view(), name="teams"),
    path("new-team/", team.CreateTeamView.as_view(), name="new_team"),
    path("delete-team/<int:pk>/", team.DeleteTeamView.as_view(), name="delete_team"),
    path("delete-team-member/", team.DeleteTeamMemberView.as_view(), name="delete_team_member"),
    path("activate-team-member/", team.ActivateTeamMemberView.as_view(), name="activate_team_member"),
    path("search-team/", team.SearchTeamView.as_view(), name="search_team"),
    path("join-team/", team.JoinTeamView.as_view(), name="join_team"),
    path("team-management/", team.TeamManagement.as_view(), name="team_management"),
]

user_patterns = [
    path("search-user/", user.SearchUserView.as_view(), name="search_user"),
    path("user-status/", user.UserStatusView.as_view(), name="user_status"),
]

app_name = "accounts"
urlpatterns = [
    path("", include(auth_patterns)),
    path("", include(profile_patterns)),
    path("", include(team_patterns)),
    path("", include(user_patterns)),
]
