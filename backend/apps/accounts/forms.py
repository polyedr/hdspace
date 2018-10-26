from django import forms
from django.contrib.auth import password_validation
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from .models import Profile
from .utils import emails

__all__ = (
    "SignUpForm",
    "LoginForm",
    "ForgotPasswordForm",
    "ResetPasswordForm",
    "UpdateProfileForm",
    "ChangePasswordForm",
    "AvatarUploadForm",
    "CreateTeamForm",
    "SearchUserForm",
    "JoinTeamForm",
)


class SignUpForm(UserCreationForm):
    email = forms.EmailField()
    first_name = forms.CharField()
    last_name = forms.CharField()

    class Meta:
        model = User
        fields = (
            "username", "first_name", "last_name", "email",
            "password1", "password2",
        )

    def clean_email(self):
        email = self.cleaned_data.get("email")
        username = self.cleaned_data.get("username")
        if email and User.objects.filter(email=email).exclude(username=username).exists():
            raise forms.ValidationError("A user with that email already exists.")
        return email


class LoginForm(forms.Form):
    username = forms.CharField(
        label="Email or Username",
    )
    password = forms.CharField(
        label="Password",
        strip=False,
        widget=forms.PasswordInput,
    )


class ForgotPasswordForm(forms.Form):
    email = forms.EmailField(widget=forms.TextInput(attrs={"type": "email", "placeholder": "Email Address"}))

    def clean_email(self):
        email = self.cleaned_data.get("email")
        profile = Profile.objects.filter(user__email=email).select_related("user").first()
        if not profile:
            raise forms.ValidationError("Invalid email address.")

        if not profile.user.is_active:
            raise forms.ValidationError("Please activate your account.")

        profile.reset_password_token = Profile.generate_token()
        profile.save()

        emails.send_forgot_password_request(
            email=profile.user.email,
            reset_password_url_path=profile.get_reset_password_url()
        )

        return profile.user.email


class ResetPasswordForm(forms.Form):

    def __init__(self, *args, **kwargs):
        self.reset_token = kwargs.pop("reset_token", None)
        super(ResetPasswordForm, self).__init__(*args, **kwargs)

    password1 = forms.CharField(
        strip=False,
        widget=forms.PasswordInput(attrs={"placeholder": "Password"}),
        help_text=password_validation.password_validators_help_text_html(),
    )
    password2 = forms.CharField(
        widget=forms.PasswordInput(attrs={"placeholder": "Password confirmation"}),
        strip=False,
        help_text="Enter the same password as before, for verification.",
    )

    def clean(self):
        password1 = self.cleaned_data["password1"]
        password2 = self.cleaned_data["password2"]

        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords didn't match.")

        profile = Profile.objects.filter(reset_password_token=self.reset_token).select_related("user").first()
        if not profile:
            raise forms.ValidationError("Invalid or expired token.")

        profile.reset_password_token = None
        profile.user.set_password(self.cleaned_data["password1"])

        profile.user.save()
        profile.save()

        return self.cleaned_data


class UpdateProfileForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(UpdateProfileForm, self).__init__(*args, **kwargs)
        self.fields["role"] = forms.ChoiceField(
            choices=[("", "Select a Role")] + [(role[0], role[0])
                                               for role in Profile.USER_ROLE]
        )

    email = forms.EmailField()
    first_name = forms.CharField()
    last_name = forms.CharField()
    username = forms.CharField()
    hourly_rate = forms.CharField(label="Hourly Rate")
    role = forms.ChoiceField(widget=forms.Select(), required=True)

    class Meta:
        model = User
        fields = (
            "username", "first_name", "last_name", "email",
        )


class ChangePasswordForm(forms.Form):
    old_password = forms.CharField(
        label="Current Password",
        strip=False,
        widget=forms.PasswordInput,
    )

    password1 = forms.CharField(
        label="New Password",
        strip=False,
        widget=forms.PasswordInput,
        help_text=password_validation.password_validators_help_text_html(),
    )
    password2 = forms.CharField(
        label="Confirm New Password",
        strip=False,
        widget=forms.PasswordInput,
    )

    def clean(self):
        password1 = self.cleaned_data["password1"]
        password2 = self.cleaned_data["password2"]

        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords didn't match.")

        return self.cleaned_data


class AvatarUploadForm(forms.Form):
    avatar = forms.ImageField()


class SearchUserForm(forms.Form):

    def __init__(self, *args, **kwargs):
        super(SearchUserForm, self).__init__(*args, **kwargs)
        self.fields["position"] = forms.ChoiceField(
            choices=[("", "Select a Position")] + [(role[0], role[0])
                                                   for role in Profile.USER_ROLE]
        )

    position = forms.ChoiceField(widget=forms.Select(), required=True)


class JoinTeamForm(forms.Form):

    def __init__(self, *args, **kwargs):
        super(JoinTeamForm, self).__init__(*args, **kwargs)
        self.fields["connect_position"] = forms.ChoiceField(
            choices=[("", "Select a Position")] + [(role[0], role[0])
                                                   for role in Profile.USER_ROLE]
        )

    team_name = forms.CharField(label="Team Name", required=False)
    hourly_rate = forms.CharField(label="Hourly Charge")
    team_id = forms.CharField(widget=forms.HiddenInput())
    connect_position = forms.ChoiceField(widget=forms.Select(), required=True)


class CreateTeamForm(forms.Form):
    first_name = forms.CharField(label="First Name")
    last_name = forms.CharField(label="Last Name")
    email = forms.EmailField()
    password = forms.CharField(
        strip=False,
        widget=forms.PasswordInput,
        help_text=password_validation.password_validators_help_text_html(),
    )
    username = forms.CharField(label="User Name")
    team_name = forms.CharField(label="Team Name")
    position = forms.ChoiceField(widget=forms.Select(),
                                 choices=[("", "Select a Position")] + [(role[0], role[0])
                                 for role in Profile.USER_ROLE])
    charge = forms.CharField(label="Hourly Charge")
    time_log = forms.CharField(label="Time Log")
    description = forms.CharField(widget=forms.Textarea)
    available = forms.BooleanField(required=False)
    avatar = forms.ImageField(label="Profile Image")
    logo = forms.ImageField()
