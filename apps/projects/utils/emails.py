from django.conf import settings

from apps.core.utils import send_email, build_absolute_url

__all__ = (
    "invitation_email",
    "invitation_decline_email",
    "share_link_email",
)


def invitation_email(email: str, project, accept_path: str, descline_path: str):
    subject = "Invitation to project at {site_name}".format(
        site_name=settings.SITE_NAME
    )

    send_email(
        subject=subject,
        template_name="emails/invitation_email.html",
        context={
            "name": project.name,
            "invite_accept_url": build_absolute_url(accept_path),
            "invite_decline_url": build_absolute_url(descline_path),
        },
        to=[email],
    )


def invitation_decline_email(email: str, name: str):
    subject = "Invitation to project at {site_name} declined".format(
        site_name=settings.SITE_NAME
    )

    send_email(
        subject=subject,
        template_name="emails/invitation_decline_email.html",
        context={
            "name": name,
            "email": email,
        },
        to=[email],
    )


def share_link_email(email: str, project: str, share_link: str, username: str):
    subject = "Share Link at {site_name}".format(
        site_name=settings.SITE_NAME
    )

    send_email(
        subject=subject,
        template_name="emails/share_link_email.html",
        context={
            "name": project,
            "share_link_url": build_absolute_url(share_link),
            "username": username,
        },
        to=[email],
    )
