from django.urls import path

from .views import *  # noqa

app_name = "payments"
urlpatterns = [
    path("plans/", SubscriptionPlanView.as_view(), name="plans"),
    path("cart/", PaymentCartView.as_view(), name="cart"),
    path("add-delete/", CartAddDeleteView.as_view(), name="add_delete"),
    path("pay-project/", ProjectPaymentView.as_view(), name="project_pay"),
    path("paypal/<int:pk>/", PaypalPackageView.as_view(), name="paypal"),
    path("payment-success/", PaymentSuccessView.as_view(), name="success"),
    path("payment-cancel/", PaymentCancelView.as_view(), name="cancel"),
]
