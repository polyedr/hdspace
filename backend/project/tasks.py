from celery import Celery

# app = Celery('tasks', broker='pyamqp://guest@localhost//')
# amqp only backend. ok
# app = Celery('tasks', backend='rpc://', broker='pyamqp://')
# Redis with amqp backend. ok
# app = Celery('tasks', backend='redis://localhost', broker='pyamqp://')
# Redis only backend
app = Celery(
    "tasks", backend="redis://localhost:6379/0", broker="redis://localhost:6379/0"
)

__all__ = ("add",)


@app.task()
def add(x, y):
    return x + y
