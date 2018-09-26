from paypal.standard.forms import PayPalPaymentsForm

from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin

from core.views.seo import SEOViewMixin
from .utils import get_payment_package
from .models import Package


__all__ = (
    "SubscriptionPlanView",
    "PaymentSuccessView",
    "PaymentCancelView",
    "PaypalPackageView",
)


class SubscriptionPlanView(LoginRequiredMixin, SEOViewMixin, TemplateView):
    template_name = "payments/plans.html"
    page_title = "Subscription plans"

    def get(self, request, *args, **kwargs):
        context = self.get_context_data()
        context["packages"] = Package.objects.all()
        return self.render_to_response(context)


class PaypalPackageView(LoginRequiredMixin, TemplateView):
    template_name = "payments/paypal.html"

    def get(self, request, *args, **kwargs):
        context = self.get_context_data()
        package_id = kwargs.pop("pk")
        package = Package.objects.get(pk=package_id)
        paypal_standard = get_payment_package(request.user.id, package.id, package.full_price)

        context["form"] = PayPalPaymentsForm(initial=paypal_standard, button_type="subscribe")
        return self.render_to_response(context)


class PaymentSuccessView(LoginRequiredMixin, TemplateView):
    template_name = "payments/success.html"

    def get(self, request, *args, **kwargs):
        return self.render_to_response({})


class PaymentCancelView(LoginRequiredMixin, TemplateView):
    template_name = "payments/cancel.html"

    def get(self, request, *args, **kwargs):
        return self.render_to_response({})
