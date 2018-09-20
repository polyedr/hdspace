from paypal.standard.forms import PayPalPaymentsForm

from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse

from core.utils import build_absolute_url


__all__ = (
    "SubscriptionPlanView",
    "PaymentSuccessView",
    "PaymentCancelView",
)


class SubscriptionPlanView(LoginRequiredMixin, TemplateView):
    template_name = "payments/plans.html"

    def get(self, request, *args, **kwargs):
        context = self.get_context_data()
        paypal_standard = {
            "cmd": "_xclick-subscriptions",
            "a3": "1",
            "p3": 1,
            "t3": "M",
            "src": "1",
            "sra": "1",
            "no_note": "1",
            "item_name": "Standard Subscription",
            "notify_url": build_absolute_url(reverse("paypal-ipn")),
            "return": build_absolute_url(reverse("payments:success")),
            "cancel_return": build_absolute_url(reverse("payments:cancel")),
            "custom": "standard_{}".format(request.user.id),
        }

        context["standard_form"] = PayPalPaymentsForm(initial=paypal_standard, button_type="subscribe")

        return self.render_to_response(context)


class PaymentSuccessView(LoginRequiredMixin, TemplateView):
    template_name = "payments/success.html"

    def get(self, request, *args, **kwargs):
        return self.render_to_response({})


class PaymentCancelView(LoginRequiredMixin, TemplateView):
    template_name = "payments/cancel.html"

    def get(self, request, *args, **kwargs):
        return self.render_to_response({})
