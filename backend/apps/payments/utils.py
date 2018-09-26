from core.utils import build_absolute_url
from django.urls import reverse


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
