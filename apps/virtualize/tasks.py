# Create your tasks here
from __future__ import absolute_import, unicode_literals
from celery import shared_task, Celery

# celery = Celery('shared_tasks', broker='amqp://guest@localhost//') #!
from project.settings import REDIS_URL

celery = Celery('shared_tasks', REDIS_URL) #!

import os

os.environ[ 'DJANGO_SETTINGS_MODULE' ] = "project.settings"

@shared_task
def add(x, y):
    return x + y


@shared_task
def mul(x, y):
    return x * y


@shared_task
def xsum(numbers):
    return sum(numbers)
