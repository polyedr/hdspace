from django.conf import settings

from core.utils import send_email, build_absolute_url

__all__ = (
    "send_email_address_confirmation",
)


def send_email_address_confirmation(email: str, email_confirmation_path: str):
    subject = "Confirm your registration at {site_name}".format(
        site_name=settings.SITE_NAME
    )

    send_email(
        subject=subject,
        template_name="emails/email_address_confirmation.html",
        context={
            "email_confirmation_url": build_absolute_url(email_confirmation_path),
        },
        to=[email],
    )


def send_forgot_password_request(email: str, reset_password_url_path: str):
    subject = "Reset your {site_name} password".format(
        site_name=settings.SITE_NAME
    )

    send_email(
        subject=subject,
        template_name="emails/forgot_password.html",
        context={
            "reset_password_url": build_absolute_url(reset_password_url_path),
        },
        to=[email],
    )
