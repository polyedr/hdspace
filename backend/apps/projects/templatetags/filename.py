from os.path import basename

from django import template

register = template.Library()


@register.filter
def filename(value):
    return basename(value)
