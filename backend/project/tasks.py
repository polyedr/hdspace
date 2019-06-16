
from celery import Celery

# app = Celery('tasks', broker='pyamqp://guest@localhost//')
app = Celery('tasks', backend='rpc://', broker='pyamqp://')
# app = Celery('tasks', backend='redis://localhost', broker='pyamqp://')
'''
@app.task
def add(x, y):
    return x + y

'''
from celery import task

__all__ = (
    "add",
)


@app.task()
def add(x, y):
    return x + y
