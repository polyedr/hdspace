from datetime import datetime
from celery import task

from payments.models import UserSubscription

__all__ = (
    "check_user_subscription",
)


@task.task()
def check_user_subscription():
    today = datetime.now().date()
    UserSubscription.objects.filter(end_date=today, active=True).update(active=False)
