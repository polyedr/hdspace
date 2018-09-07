from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView

__all__ = (
    "DashboardView",
)


class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = "accounts/dashboard.html"

    def get(self, request, *args, **kwargs):
        context = self.get_context_data()
        return self.render_to_response(context)
