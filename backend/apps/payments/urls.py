from django.urls import path

from .views import SubscriptionPlanView, PaymentSuccessView, PaymentCancelView

app_name = "payments"
urlpatterns = [
    path("plans/", SubscriptionPlanView.as_view(), name="list"),
    path("payment-success/", PaymentSuccessView.as_view(), name="success"),
    path("payment-cancel/", PaymentCancelView.as_view(), name="cancel"),
]
