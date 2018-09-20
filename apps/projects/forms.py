from django import forms

from .models import ScreenEvent

__all__ = (
    "CreateProjectForm",
    "ScreenUploadForm",
    "ScreenEventForm",
    "PositionUpdateForm",
)


class CreateProjectForm(forms.Form):
    name = forms.CharField(
        label="",
        widget=forms.TextInput(attrs={"placeholder": "Project Name"}),
    )


class ScreenUploadForm(forms.Form):
    image = forms.ImageField(
        label="Upload New Screen",
    )


class ScreenEventForm(forms.Form):
    link_to = forms.ChoiceField(label="", choices=ScreenEvent.LINK_TO_CHOICES)
    event = forms.ChoiceField(label="", choices=ScreenEvent.EVENT_CHOICES, required=False)
    new_window = forms.BooleanField(label="Open in a new window", initial=True, required=False)
    href = forms.CharField(label="",
                           widget=forms.TextInput(attrs={"placeholder": "http:// or https://"}),
                           required=False)
    x = forms.IntegerField(label="", widget=forms.HiddenInput())
    y = forms.IntegerField(label="", widget=forms.HiddenInput())
    width = forms.IntegerField(label="", widget=forms.HiddenInput())
    height = forms.IntegerField(label="", widget=forms.HiddenInput())


class PositionUpdateForm(forms.Form):
    x = forms.IntegerField()
    y = forms.IntegerField()
