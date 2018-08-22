from mongoengine import *

from django import forms


class FileUploadForm(forms.Form):
    file_ = forms.FileField(required=False)