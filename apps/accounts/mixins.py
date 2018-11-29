from django.contrib.auth.mixins import AccessMixin
from django.shortcuts import redirect
from django.urls import reverse


class AnonymousRequiredMixin(AccessMixin):
    """Verify that the current user is NOT authenticated."""
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect(reverse("projects:dashboard"))
        return super().dispatch(request, *args, **kwargs)
