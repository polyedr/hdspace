import math


from typing import List, Tuple, Union

from django.template import loader
from django.conf import settings
from django.core.mail import EmailMessage

__all__ = (
    "send_email",
    "build_absolute_url",
    "render_body",
    "date_difference",
)


Recipient_s = Union[List[str], Tuple[str], str]


def render_body(template_name: str, context: dict = None, base_template: str = settings.EMAIL_BASE_TEMPLATE) -> str:
    """
    Load template by given name, pass it context
    and render as a string.
    """
    if context is None:
        context = dict()

    context["base_template"] = context.get("base_template", base_template)
    template = loader.get_template(template_name)
    return template.render(context)


def send_email(
        subject: str,
        template_name: str,
        context: dict,
        to: Recipient_s,
        bcc: Recipient_s = None,
        cc: Recipient_s = None,
        reply_to: Recipient_s = None,
):
    if not to:
        return

    body = render_body(template_name, context)

    email = EmailMessage(
        subject=subject,
        body=body,
        to=to,
        bcc=bcc,
        cc=cc,
        reply_to=reply_to,
    )

    # Setting the main content
    email.content_subtype = "html"

    email.send()


def build_absolute_url(path: str) -> str:
    return "{base_url}{path}".format(
        base_url=settings.BASE_URL,
        path=path,
    )


def date_difference(new, old):
    return math.floor((new - old).seconds / 60)
