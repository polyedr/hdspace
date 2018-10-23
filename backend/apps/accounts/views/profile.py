from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponseRedirect
from django.contrib.auth import update_session_auth_hash
from django.contrib import messages
from django.urls import reverse
from django.views.generic import TemplateView
from django.views.generic.base import View

from accounts.forms import UpdateProfileForm, ChangePasswordForm, AvatarUploadForm
from core.views.seo import SEOViewMixin

__all__ = (
    "ProfileView",
    "ChangePasswordView",
)


class ProfileView(LoginRequiredMixin, SEOViewMixin, TemplateView):
    template_name = "accounts/profile.html"
    page_title = "Profile"

    def get_context_data(self, **kwargs):
        context = super(ProfileView, self).get_context_data(**kwargs)
        if "form" not in kwargs:
            user = self.request.user

            initial = dict(
                username=user.username,
                email=user.email,
                first_name=user.first_name,
                last_name=user.last_name,
                hourly_rate=user.profile.hourly_rate,
                role=user.profile.role,
            )

            context["form"] = UpdateProfileForm(initial=initial)
            context["profile_image"] = user.profile.get_image()
            context["password_form"] = ChangePasswordForm()

        return context

    def post(self, request):
        user = request.user
        form = UpdateProfileForm(data=request.POST, instance=user)
        if form.is_valid():
            data = form.cleaned_data
            user = form.save()
            user.profile.role = data["role"]
            user.profile.hourly_rate = data["hourly_rate"]
            user.save()
            update_session_auth_hash(request, user)
            messages.success(request, "Your profile has been updated successfully.")
            return HttpResponseRedirect(reverse("accounts:profile"))
        else:
            return self.render_to_response(self.get_context_data(
                form=form,
            ))


class ChangePasswordView(LoginRequiredMixin, View):
    # noinspection PyMethodMayBeStatic
    def post(self, request):
        form = ChangePasswordForm(data=request.POST)
        if form.is_valid():
            data = form.cleaned_data
            user = request.user
            if user.check_password(data["old_password"]):
                user.set_password(data["password1"])
                user.save()

                update_session_auth_hash(request, user)

                messages.success(request, "Password changed successfully.")
            else:
                messages.error(request, "Invalid password provided.")

        else:
            messages.error(request, "Passwords didn't match.")
        return HttpResponseRedirect(reverse("accounts:profile"))


class ChangeAvatarView(LoginRequiredMixin, View):
    # noinspection PyMethodMayBeStatic
    def post(self, request):
        form = AvatarUploadForm(request.POST, request.FILES)
        if form.is_valid():
            user = request.user
            user.profile.avatar = form.cleaned_data["avatar"]
            user.save()
        else:
            messages.error(request, "Invalid Image File.")
        return HttpResponseRedirect(reverse("accounts:profile"))
