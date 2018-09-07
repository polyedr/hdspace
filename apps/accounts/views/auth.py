from django.http import HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.views.generic import TemplateView
from django.contrib.auth import logout, login
from django.db.models import Q
from django.contrib.auth.models import User

from accounts.mixins import AnonymousRequiredMixin
from accounts.models import Profile
from accounts.forms import *  # noqa
from accounts.utils import emails

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


class LoginView(AnonymousRequiredMixin, TemplateView):
    template_name = "accounts/login.html"

    # noinspection PyMethodMayBeStatic
    def post(self, request):
        form = LoginForm(data=request.POST)
        if form.is_valid():
            data = form.cleaned_data
            user = User.objects.select_related("profile") \
                .filter(Q(username=data['username']) | Q(email=data['username'])).first()

            if user is None or not user.check_password(data['password']):
                return JsonResponse(status=400, data={'msg': 'Invalid username or password.'})

            login(request, user)
            return JsonResponse({'redirect_url': reverse("accounts:dashboard")})
        else:
            return JsonResponse(status=400, data={'msg': 'Invalid username or password.'})


class RegistrationView(AnonymousRequiredMixin, TemplateView):
    template_name = "accounts/registration.html"

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
            return HttpResponseRedirect(reverse("accounts:login"))
        else:
            return self.render_to_response(status=400, context=self.get_context_data(
                form=form,
            ))


class EmailConfirmationView(AnonymousRequiredMixin, TemplateView):
    # noinspection PyMethodMayBeStatic
    def get(self, request, confirmation_token):
        profile = (
            Profile.objects.filter(email_confirmation_token=confirmation_token).select_related("user").first()
        )
        if not profile:
            # TODO  show message texts for failure
            return HttpResponseRedirect(reverse("accounts:login"))
        else:
            profile.email_confirmation_token = None
            profile.user.is_active = True
            profile.user.save()

        return HttpResponseRedirect(reverse("accounts:login"))


class ForgotPasswordView(AnonymousRequiredMixin, TemplateView):
    template_name = "accounts/forgot_password.html"

    form = ForgotPasswordForm

    def get_context_data(self, **kwargs):
        context = super(ForgotPasswordView, self).get_context_data(**kwargs)
        if "form" not in kwargs:
            context["form"] = self.form

        return context

    def post(self, request):
        form = ForgotPasswordForm(data=request.POST)
        if form.is_valid():
            # TODO success message text
            return HttpResponseRedirect(reverse("accounts:login"))
        else:
            return self.render_to_response(status=400, context=self.get_context_data(
                form=form,
            ))


class ResetPasswordView(AnonymousRequiredMixin, TemplateView):
    template_name = "accounts/reset_password.html"

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
            # TODO Reset password success message
            return HttpResponseRedirect(reverse("accounts:login"))
        else:
            return self.render_to_response(self.get_context_data(
                form=form,
            ))
