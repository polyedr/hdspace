# Create your tasks here
from __future__ import absolute_import, unicode_literals
from celery import shared_task, Celery

# celery = Celery('shared_tasks', broker='amqp://guest@localhost//') #!
from project.settings import BROKER_URL, CELERY_RESULT_BACKEND, REDIS_URL

# celery = Celery('shared_tasks', REDIS_URL) #!
# app = Celery(
#     "tasks", backend="redis://localhost:6379/0", broker="redis://localhost:6379/0"
# )
app = Celery(
    "tasks", backend=CELERY_RESULT_BACKEND, broker=BROKER_URL
)


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