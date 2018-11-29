from django import forms


__all__ = (
    "AddDeleteForm",
)


class AddDeleteForm(forms.Form):
    project = forms.IntegerField()
    checked = forms.BooleanField(initial=True, required=False)
