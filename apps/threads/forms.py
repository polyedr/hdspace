from django import forms

from threads.models import Message


__all__ = (
    "FileUploadForm",
)


class FileUploadForm(forms.ModelForm):
    file = forms.FileField(
        label="Upload New Screen",
    )

    class Meta:
        model = Message
        fields = ('file',)
