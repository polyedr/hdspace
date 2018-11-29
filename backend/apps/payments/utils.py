import datetime
import calendar

from django.contrib import messages
from django.urls import reverse

from core.utils import build_absolute_url

__all__ = (
    "get_payment_package",
    "add_months",
    "package_validation",
)


def get_payment_package(user, package_id, amount):
    return {
        "cmd": "_xclick-subscriptions",
        "a3": amount,
        "p3": 1,
        "t3": "M",
        "src": "1",
        "sra": "1",
        "no_note": "1",
        "item_name": "Subscription",
        # TODO WILL BE REMOVED
        "notify_url": " http://afe8ed66.ngrok.io" + reverse("paypal-ipn"),
        # build_absolute_url(reverse("paypal-ipn")),
        "return": build_absolute_url(reverse("payments:success")),
        "cancel_return": build_absolute_url(reverse("payments:cancel")),
        "custom": "{}_{}".format(package_id, user),
    }


def add_months(sourcedate, months):
    month = sourcedate.month - 1 + months
    year = sourcedate.year + month // 12
    month = month % 12 + 1
    day = min(sourcedate.day, calendar.monthrange(year, month)[1])
    return datetime.date(year, month, day)


def package_validation(request, subscription, carts):

    if subscription.paid_projects >= subscription.package.project:
        return messages.error(request, "Your subscription plan limit was ended.")

    rest = subscription.package.project - subscription.paid_projects
    if rest < carts:
        return messages.error(request, f'Please select less projects. Your limit is {rest}')
    return True
