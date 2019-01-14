from paypal.standard.forms import PayPalPaymentsForm

from django.http import JsonResponse, HttpResponseRedirect
from django.contrib import messages
from django.urls import reverse
from django.views.generic.base import View
from django.db.models import F
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin

from apps.core.views.seo import SEOViewMixin
from .utils import *  # noqa
from .models import *  # noqa
from .cart import Cart
from .forms import AddDeleteForm


__all__ = (
    "SubscriptionPlanView",
    "PaymentSuccessView",
    "PaymentCancelView",
    "PaypalPackageView",
    "PaymentCartView",
    "CartAddDeleteView",
    "ProjectPaymentView",
)


class SubscriptionPlanView(LoginRequiredMixin, SEOViewMixin, TemplateView):
    template_name = "payments/plans.html"
    page_title = "Subscription plans"

    def get(self, request, *args, **kwargs):
        context = self.get_context_data()
        context["packages"] = Package.objects.all()
        context["current_package"] = UserSubscription.objects.filter(user=request.user, active=True)
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


class PaymentCartView(LoginRequiredMixin, TemplateView):
    template_name = "payments/cart.html"

    def get(self, request, *args, **kwargs):
        context = self.get_context_data()
        cart = Cart(request)
        context["projects"] = cart.get_projects()
        try:
            context["subscription"] = UserSubscription.objects.get(active=True, user=request.user)
        except UserSubscription.DoesNotExist:
            context["subscription"] = None

        return self.render_to_response(context)


class CartAddDeleteView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request, *args, **kwargs):
        form = AddDeleteForm(data=request.POST)
        if form.is_valid():
            cart = Cart(request)
            if form.cleaned_data["checked"]:
                cart.add(form.cleaned_data["project"])
            else:
                cart.remove(form.cleaned_data["project"])
            msg = "Project have been added successfully."
        else:
            msg = "Invalid data."
        return JsonResponse({"msg": msg})


class ProjectPaymentView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def get(self, request, *args, **kwargs):
        try:
            subscription = UserSubscription.objects.get(user=request.user, active=True)
            cart = Cart(request)
            carts = cart.get_carts()
            package = package_validation(request, subscription, carts)
            if package is True:
                carts.pay()
                subscription.paid_projects = F('paid_projects') + carts
                subscription.save()
        except UserSubscription.DoesNotExist:
            messages.error(request, "You have no any subscription package.")

        return HttpResponseRedirect(reverse("projects:dashboard"))
