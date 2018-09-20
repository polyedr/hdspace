from django.http import HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.views.generic import TemplateView
from django.contrib.auth import logout, login
from django.db.models import Q
from django.contrib import messages
from django.contrib.auth.models import User

from accounts.mixins import AnonymousRequiredMixin
from accounts.models import Profile
from accounts.forms import *  # noqa
from accounts.utils import emails
from core.views.seo import SEOViewMixin

__all__ = (
    "logout_view",
    "LoginView",
    "RegistrationView",
    "EmailConfirmationView",
    "ForgotPasswordView",
    "ResetPasswordView",
)


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("accounts:login"))


class LoginView(AnonymousRequiredMixin, SEOViewMixin, TemplateView):
    template_name = "accounts/login.html"
    page_title = "Login"

    # noinspection PyMethodMayBeStatic
    def post(self, request):
        form = LoginForm(data=request.POST)
        if form.is_valid():
            data = form.cleaned_data
            user = User.objects.select_related("profile") \
                .filter(Q(username=data["username"]) | Q(email=data["username"])).first()

            if user is None or not user.check_password(data["password"]):
                return JsonResponse(status=400, data={"msg": "Invalid username or password."})

            if not user.is_active:
                return JsonResponse(status=400, data={"msg": "Please activate your account."})

            login(request, user)
            return JsonResponse({"redirect_url": reverse("projects:dashboard")})
        else:
            return JsonResponse(status=400, data={"msg": "Invalid username or password."})


class RegistrationView(AnonymousRequiredMixin, SEOViewMixin, TemplateView):
    template_name = "accounts/registration.html"
    page_title = "Registration"
    form = SignUpForm

    def get_context_data(self, **kwargs):
        context = super(RegistrationView, self).get_context_data(**kwargs)
        if "form" not in kwargs:
            context["form"] = self.form
        return context

    def post(self, request):
        form = SignUpForm(data=request.POST)
        if form.is_valid():
            user = form.save()
            user.refresh_from_db()
            user.profile.email_confirmation_token = Profile.generate_token()
            user.is_active = False
            user.save()

            emails.send_email_address_confirmation(
                email=user.email,
                email_confirmation_path=user.profile.get_confirmation_url(),
            )
            messages.success(request, "You have successfully registered.")
            return HttpResponseRedirect(reverse("accounts:login"))
        else:
            return self.render_to_response(status=400, context=self.get_context_data(
                form=form,
            ))


class EmailConfirmationView(AnonymousRequiredMixin, SEOViewMixin, TemplateView):
    page_title = "Email Confirmation"

    # noinspection PyMethodMayBeStatic
    def get(self, request, **kwargs):
        confirmation_token = kwargs.pop("confirmation_token")
        profile = (
            Profile.objects.filter(email_confirmation_token=confirmation_token).select_related("user").first()
        )
        if not profile:
            messages.error(request, "Invalid confirmation url.")
            return HttpResponseRedirect(reverse("accounts:login"))
        else:
            profile.email_confirmation_token = None
            profile.user.is_active = True
            profile.user.save()
            messages.success(request, "Your email address confirmed successfully.")

        return HttpResponseRedirect(reverse("accounts:login"))


class ForgotPasswordView(AnonymousRequiredMixin, SEOViewMixin, TemplateView):
    template_name = "accounts/forgot_password.html"
    page_title = "Forgot Password"

    form = ForgotPasswordForm

    def get_context_data(self, **kwargs):
        context = super(ForgotPasswordView, self).get_context_data(**kwargs)
        if "form" not in kwargs:
            context["form"] = self.form

        return context

    def post(self, request):
        form = ForgotPasswordForm(data=request.POST)
        if form.is_valid():
            messages.success(request, "Please check your email to reset password.")
            return HttpResponseRedirect(reverse("accounts:login"))
        else:
            return self.render_to_response(status=400, context=self.get_context_data(
                form=form,
            ))


class ResetPasswordView(AnonymousRequiredMixin, SEOViewMixin, TemplateView):
    template_name = "accounts/reset_password.html"
    page_title = "Reset Password"

    form = ResetPasswordForm
    reset_token = None

    def get_context_data(self, **kwargs):
        context = super(ResetPasswordView, self).get_context_data(**kwargs)

        # TODO Reset password check token validity
        if "form" not in kwargs:
            context["form"] = self.form

        return context

    def post(self, request, reset_token):
        form = ResetPasswordForm(data=request.POST, reset_token=reset_token)
        if form.is_valid():
            messages.success(request, "Your password has been changed successfully.")
            return HttpResponseRedirect(reverse("accounts:login"))
        else:
            return self.render_to_response(self.get_context_data(
                form=form,
            ))
