import factory

from .models import Thread, UserThread

__all__ = (
    "ThreadFactory",
    "UserThreadFactory",
)


class ThreadFactory(factory.DjangoModelFactory):

    subject = factory.Sequence(lambda n: "subject{}".format(n))

    class Meta:
        model = Thread


class UserThreadFactory(factory.DjangoModelFactory):

    class Meta:
        model = UserThread
