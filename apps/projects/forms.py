from django import forms

from apps.projects.models import ScreenEvent, ProjectMember, ProjectScreen
from apps.accounts.models import Profile

__all__ = (
    "CreateProjectForm",
    "ScreenUploadForm",
    "ScreenEventForm",
    "PositionUpdateForm",
    "ProjectInvitationForm",
    "AddTaskForm",
)


class CreateProjectForm(forms.Form):
    name = forms.CharField(
        label="",
        widget=forms.TextInput(attrs={"placeholder": "Project Name"}),
    )


class ScreenUploadForm(forms.ModelForm):
    # image = forms.ImageField(
    #     label="Upload New Screen",
    # )

    class Meta:
        model = ProjectScreen
        fields = ()


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
    link_screen = forms.IntegerField(label="", widget=forms.HiddenInput(), required=False)


class PositionUpdateForm(forms.Form):
    x = forms.IntegerField()
    y = forms.IntegerField()


class ProjectInvitationForm(forms.Form):

    def __init__(self, *args, **kwargs):
        super(ProjectInvitationForm, self).__init__(*args, **kwargs)
        self.fields["role"] = forms.ChoiceField(
            choices=[("", "Select a Position")] + [(role[0], role[0])
                                                   for role in Profile.USER_ROLE]
        )

    name = forms.CharField(
        label="",
        widget=forms.TextInput(attrs={"placeholder": "Name"}))
    role = forms.CharField(
        label="",
        widget=forms.TextInput(attrs={"placeholder": "Role"}))
    email = forms.EmailField(
        label="",
        widget=forms.TextInput(attrs={"placeholder": "Email address"}),
    )


class AddTaskForm(forms.Form):

    def __init__(self, project, *args, **kwargs):
        super(AddTaskForm, self).__init__(*args, **kwargs)
        self.fields['owner'] = forms.ChoiceField(
            choices=[("", "Select task owner")] + [(member.id, str(member.user.username))
                                                   for member in ProjectMember.objects.filter(project=project)]
        )

    title = forms.CharField(widget=forms.TextInput(attrs={"placeholder": "Title"}))

    description = forms.CharField(widget=forms.Textarea(attrs={"placeholder": "Description"}))

    owner = forms.ChoiceField(widget=forms.Select(), required=True)
