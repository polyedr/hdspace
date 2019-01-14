import datetime

from paypal.standard.ipn.signals import valid_ipn_received
from paypal.standard.models import ST_PP_COMPLETED

from apps.accounts.models import User
from .models import UserSubscription, Package
from .utils import add_months


def payment_process(sender, **kwargs):
    ipn_obj = sender
    plan_id, user_id = ipn_obj.custom.split("_")
    user = User.objects.get(pk=user_id)
    if ipn_obj.payment_status == ST_PP_COMPLETED:
        package = Package.objects.get(id=plan_id)
        now = datetime.datetime.now()
        end_date = add_months(now, 1)
        UserSubscription.objects.filter(user=user).update(active=False)
        UserSubscription.objects.create(
            user=user,
            package=package,
            end_date=end_date,
            active=True,
        )
    else:
        UserSubscription.objects.filter(user=user).update(active=False)


valid_ipn_received.connect(payment_process)
