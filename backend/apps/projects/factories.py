import factory

from .models import * # noqa


class ProjectFactory(factory.DjangoModelFactory):

    name = factory.Sequence(lambda n: "project{}".format(n))

    class Meta:
        model = Project


class ProjectMemberFactory(factory.DjangoModelFactory):

    role = "owner"

    class Meta:
        model = ProjectMember


class ProjectScreenFactory(factory.DjangoModelFactory):
    image = "screen.jpg"

    class Meta:
        model = ProjectScreen


class ScreenEventFactory(factory.DjangoModelFactory):
    height = 100
    width = 100
    x = 100
    y = 100
    new_window = True
    href = "http://localhost:8000/admin/"
    link_to = "external"
    event = "click"

    class Meta:
        model = ScreenEvent
