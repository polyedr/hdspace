from django.views.generic import TemplateView

from .seo import SEOViewMixin


class LandingView(TemplateView, SEOViewMixin):
    page_title = "Home"

    template_name = "core/landing.html"
