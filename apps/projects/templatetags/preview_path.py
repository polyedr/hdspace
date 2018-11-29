from django import template

from core.utils import build_absolute_url

register = template.Library()


@register.filter
def preview_path(path):
    return build_absolute_url(path)
