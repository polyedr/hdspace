import factory

from django.contrib.auth import get_user_model


class UserFactory(factory.DjangoModelFactory):
    """
    Note: Profile is being created through signal.
    """
    username = factory.Sequence(lambda n: "user{}".format(n))
    email = factory.LazyAttribute(lambda o: "{}@example.com".format(o.username))
    is_active = True
    is_staff = False
    is_superuser = False

    class Meta:
        model = get_user_model()