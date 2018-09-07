from django.urls import path, include
from .views import auth, profile

auth_patterns = [
    path("login/", auth.LoginView.as_view(), name="login"),
    path("registration/", auth.RegistrationView.as_view(), name="registration"),
    path("confirmation/<uuid:confirmation_token>/", auth.EmailConfirmationView.as_view(), name="confirmation"),
    path("forgot-password/", auth.ForgotPasswordView.as_view(), name="forgot_password"),
    path("reset-password/<uuid:reset_token>/", auth.ResetPasswordView.as_view(), name="reset_password"),
    path("logout/", auth.logout_view, name="logout"),
]

profile_patterns = [
    path("dashboard/", profile.DashboardView.as_view(), name="dashboard"),
]

app_name = "accounts"
urlpatterns = [
    path("", include(auth_patterns)),
    path("", include(profile_patterns)),
]
