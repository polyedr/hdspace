from django import forms
from mongoengine import *

class FileUploadForm(forms.Form):
    file_ = forms.FileField(required=False)