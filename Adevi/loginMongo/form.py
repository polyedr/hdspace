
from mongoengine import *


class LoginForm(Document):
    """scr.login form to access writing and settings page_facebook"""

    username = StringField('Username')
    password = StringField('Password', max_length=128)
