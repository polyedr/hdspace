from paypal.standard.ipn.signals import valid_ipn_received
from paypal.standard.models import ST_PP_COMPLETED

from django.contrib.auth.models import User
from .models import UserSubscription, Package


def payment_process(sender, **kwargs):
    ipn_obj = sender
    plan_id, user_id = ipn_obj.custom.split("_")
    user = User.objects.get(id=user_id)
    if ipn_obj.payment_status == ST_PP_COMPLETED:
        package = Package.objects.get(id=plan_id)
        UserSubscription.objects.create(
            user=user,
            package=package,
            active=True,
        )
    else:
        UserSubscription.objects.filter(user=user).update(active=False)


valid_ipn_received.connect(payment_process)
