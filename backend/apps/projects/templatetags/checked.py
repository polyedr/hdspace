from django import template

register = template.Library()


@register.filter
def checked(value, cart):
    return True if value in cart else False
