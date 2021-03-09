from factory.django import DjangoModelFactory
import factory
from factory.fuzzy import FuzzyText

from apps.accounts.tests.accounts_factory import UserFactory
from apps.projects.models import Roles, ProjectIllustrationSet, ProjectImage, ScreenScenario, ScenarioElement, \
    ElementComment, Project, ProjectScreen, ScreenEvent, ScreenComment, Comment, ProjectInvitation, ProjectMember, \
    TaskTime, ScreenAssignee, ProjectActivity, ProjectColumn, ColumnTask


class ProjectFactory(DjangoModelFactory):
    class Meta:
        model = Project

    name = factory.sequence(lambda n: "test project {}".format(n))
    status = Project.STATUS_PENDING


class ProjectScreenFactory(DjangoModelFactory):
    class Meta:
        model = ProjectScreen

    name = factory.sequence(lambda n: "test project screen {}".format(n))
    status = ProjectScreen.SCREEN_IN_PROGRESS


class ScreenEventFactory(DjangoModelFactory):
    class Meta:
        model = ScreenEvent

    event = ScreenEvent.EVENT_CLICK
    link_to = ScreenEvent.LINK_TO_URL
    href = "www.google.com.au"
    height = 0
    width = 0
    x = 0
    y = 0


class ScreenCommentFactory(DjangoModelFactory):
    class Meta:
        model = ScreenComment

    x = 0
    y = 0


class CommentFactory(DjangoModelFactory):
    class Meta:
        model = Comment

    text = "Test comment"


class ProjectInvitationFactory(DjangoModelFactory):
    class Meta:
        model = ProjectInvitation

    is_active = False
    email = "ylii0204@student.monash.edu"


class ProjectMemberFactory(DjangoModelFactory):
    class Meta:
        model = ProjectMember

    role = Roles.EXTERNAL_ROLE_PROJECT_OWNER
    status = ProjectMember.STATUS_CREATOR


class TaskTimeFactory(DjangoModelFactory):
    class Meta:
        model = TaskTime

    track_time = 0
    stoped = True


class ProjectIllustrationSetFactory(DjangoModelFactory):
    class Meta:
        model = ProjectIllustrationSet

    name = "test illustration set"
    illustrationList = "8.jpg"


class ProjectImageFactory(DjangoModelFactory):
    class Meta:
        model = ProjectImage

    image = "8.jpg"


class ScreenAssigneeFactory(DjangoModelFactory):
    class Meta:
        model = ScreenAssignee


class ProjectActivityFactory(DjangoModelFactory):
    class Meta:
        model = ProjectActivity

    type = ProjectActivity.TASK_CREATED


class ScreenScenarioFactory(DjangoModelFactory):
    class Meta:
        model = ScreenScenario

    name = "test screen scenario"
    type = ScreenScenario.LOGIN
    struct_type = ScreenScenario.SCENARIO
    image = "8.jpg"
    direction = ScreenScenario.VERTICAL


class ScenarioElementFactory(DjangoModelFactory):
    class Meta:
        model = ScenarioElement

    name = "test scenario element"
    struct_type = ScenarioElement.FRAME
    func_type = "unknown"
    direction = ScenarioElement.VERTICAL
    image = "8.jpg"
    shared = False


class ElementCommentFactory(DjangoModelFactory):
    class Meta:
        model = ElementComment

    text = factory.sequence(lambda n: "test element comment {}".format(n))


class ProjectColumnFactory(DjangoModelFactory):
    class Meta:
        model = ProjectColumn

    title = factory.sequence(lambda n: "test project column {}".format(n))
    description = FuzzyText(length=30)


class ColumnTaskFactory(DjangoModelFactory):
    class Meta:
        model = ColumnTask

    title = factory.sequence(lambda n: "test column task {}".format(n))
    description = FuzzyText(length=30)
    status = ColumnTask.TASK_CREATED
