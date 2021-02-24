from django.test import TestCase
from apps.accounts.tests.accounts_factory import UserFactory
from projects.tests.projects_factory import ProjectFactory, ProjectScreenFactory, ScreenEventFactory, \
    ScreenCommentFactory, CommentFactory, ProjectMemberFactory, ProjectTaskFactory, TaskTimeFactory, \
    ProjectIllustrationSetFactory, ProjectImageFactory, ScreenAssigneeFactory, ProjectActivityFactory, \
    ScreenScenarioFactory, ScenarioElementFactory, ElementCommentFactory
from ..models import ScreenScenario, ScenarioElement, Project, ProjectScreen, ScreenEvent, ProjectMember, ProjectTask,\
    ProjectActivity
import datetime
from guardian.shortcuts import assign_perm


class UserPermissionTest(TestCase):
    """ Test if user has permission to a project """

    def setUp(self):
        self.User = UserFactory.create()

        self.project = ProjectFactory.create(user=self.User)

    def test_user_has_permission(self):
        assign_perm("assign_project", self.User, self.project)
        self.assertEqual(True, self.User.has_perm("assign_project", self.project))


# Create more test cases showing object level permission
#
class ProjectTest(TestCase):
    """ Test module for Project model """

    def setUp(self):
        self.User = UserFactory.create()
        self.project = ProjectFactory.create(user=self.User, name="testproject")

    def test_project_str(self):
        project_test1 = Project.objects.get(name="testproject")
        self.assertEqual(project_test1.__str__(), project_test1.name)

    def tearDown(self):
        for project in Project.objects.all():
            project.delete()


class ProjectScreenTest(TestCase):
    def setUp(self):
        self.User = UserFactory.create()
        self.project = ProjectFactory.create(user=self.User)

        self.project_screen = ProjectScreenFactory.create(project=self.project, name="test project screen")

    def test_project_scrren_str(self):
        project_screen = ProjectScreen.objects.get(name="test project screen")
        self.assertEqual(project_screen.__str__(), str(project_screen.id))

    def test_project_screen_status(self):
        project_screen = ProjectScreen.objects.get(name="test project screen")
        self.assertEqual(project_screen.status, ProjectScreen.SCREEN_IN_PROGRESS)


class ScreenEventTest(TestCase):
    def setUp(self):
        self.User = UserFactory.create()
        self.project = ProjectFactory.create(user=self.User)

        self.project_screen = ProjectScreenFactory.create(project=self.project, )
        self.screen_event = ScreenEventFactory.create(screen=self.project_screen)

    def test_screen_event_link_to(self):
        self.assertEqual(self.screen_event.link_to, ScreenEvent.LINK_TO_URL)

    def test_screen_event_href(self):
        self.assertEqual(self.screen_event.href, "www.google.com.au")

    def test_screen_event_attributes(self):
        self.assertEqual(self.screen_event.height, 0)
        self.assertEqual(self.screen_event.width, 0)
        self.assertEqual(self.screen_event.x, 0)
        self.assertEqual(self.screen_event.y, 0)


class ScreenCommentTest(TestCase):
    def setUp(self):
        self.User = UserFactory.create()
        self.project = ProjectFactory.create(user=self.User)

        self.project_screen = ProjectScreenFactory.create(project=self.project, )
        self.screen_comment = ScreenCommentFactory.create(screen=self.project_screen, user=self.User)

    def test_screen_comment_attributes(self):
        self.assertEqual(self.screen_comment.x, 0)
        self.assertEqual(self.screen_comment.y, 0)

    def test_screen_user(self):
        self.assertEqual(self.screen_comment.user, self.User)

    def test_screen_screen(self):
        self.assertEqual(self.screen_comment.screen, self.project_screen)


class CommentTest(TestCase):
    def setUp(self):
        self.User = UserFactory.create()
        self.project = ProjectFactory.create(user=self.User)

        self.project_screen = ProjectScreenFactory.create(project=self.project, )
        self.screen_comment = ScreenCommentFactory.create(screen=self.project_screen, user=self.User)
        self.comment = CommentFactory(comment=self.screen_comment)

    def test_comment_text(self):
        self.assertEqual(self.comment.text, "Test comment")

    def test_screen_screen_comment(self):
        self.assertEqual(self.comment.comment, self.screen_comment)


# class ProjectInvitationTest(TestCase):
#     def setUp(self):
#         self.User = UserFactory.create()
#         self.project = ProjectFactory.create(user=self.User)
#
#         self.invitation_token = uuid.uuid4()
#         self.project_invitation = ProjectInvitationFactory(invitation_token = self.invitation_token,
#         user = self.User,project = self.project)
#
#     def test_project_invitation_token(self):
#         self.assertEqual(self.project_invitation.invitation_token, self.invitation_token)
#
#     def test_project_is_active(self):
#         self.assertEqual(self.project_invitation.is_active, False)
#
#     def test_project_email_and_user(self):
#         self.assertEqual(self.project_invitation.email,"ylii0204@student.monash.edu")
#         self.assertEqual(self.project_invitation.user,self.User)

class ProjectMemberTest(TestCase):
    def setUp(self):
        self.email = "kaufmanraymond@hotmail.com"
        self.User = UserFactory.create(email=self.email)
        self.project = ProjectFactory.create(user=self.User)
        self.project_member = ProjectMemberFactory(user=self.User, project=self.project)

    def test_project_member_str(self):
        self.assertEqual(self.project_member.user.email, self.email)

    def test_project_member_status(self):
        self.assertEqual(self.project_member.status, ProjectMember.STATUS_CREATOR)


class ProjectTaskTest(TestCase):

    def setUp(self):
        self.User = UserFactory.create()
        self.project = ProjectFactory.create(user=self.User)
        self.project_task = ProjectTaskFactory.create(title="Test Task 1", creator=self.User, owner=self.User,
                                                      project=self.project)

    def test_projecttask_created(self):
        self.assertTrue(ProjectTask.objects.filter(title="Test Task 1").exists())

    def test_projecttask_str(self):
        self.assertEqual(self.project_task.__str__(), self.project_task.title)

    def test_projecttask_creator_owner(self):
        self.assertEqual(self.project_task.owner, self.User)
        self.assertEqual(self.project_task.creator, self.User)


class TaskTimeTest(TestCase):
    def setUp(self):
        self.User = UserFactory.create()
        self.project = ProjectFactory.create(user=self.User)
        self.project_task = ProjectTaskFactory.create(title="Test Task 1", creator=self.User, owner=self.User,
                                                      project=self.project)
        self.project_member = ProjectMemberFactory(user=self.User, project=self.project)
        self.started = datetime.datetime.now().isoformat()

        self.task_time = TaskTimeFactory.create(started=self.started, task=self.project_task,
                                                member=self.project_member)

    def test_task_time_str(self):
        self.assertEqual(self.task_time.__str__(), self.User.username)

    def test_task_time_track_time(self):
        self.assertEqual(self.task_time.started, self.started)

    def test_task_time_stopped(self):
        self.assertEqual(self.task_time.stoped, True)

    def test_task_time_time(self):
        self.assertEqual(self.task_time.task, self.project_task)


class ProjectIllustrationSetTest(TestCase):
    def setUp(self):
        self.User = UserFactory.create()
        self.project = ProjectFactory.create(user=self.User)
        self.project_illustration_set = ProjectIllustrationSetFactory.create(project=self.project)

    def test_project_illustration_set_name(self):
        self.assertEqual(self.project_illustration_set.name, "test illustration set")

    def test_project_illustration_set_illustration_list(self):
        self.assertEqual(self.project_illustration_set.illustrationList, "8.jpg")

    def test_project_illustration_project(self):
        self.assertEqual(self.project_illustration_set.project, self.project)


class ProjectImageTest(TestCase):
    def setUp(self):
        self.User = UserFactory.create()
        self.project = ProjectFactory.create(user=self.User)
        self.project_illustration_set = ProjectIllustrationSetFactory.create(project=self.project)
        self.project_image = ProjectImageFactory.create(illustration_set=self.project_illustration_set)

    def test_project_image_image(self):
        self.assertEqual(self.project_image.image, "8.jpg")

    def test_project_image_illustration_set(self):
        self.assertEqual(self.project_image.illustration_set, self.project_illustration_set)


class ScreenAssigneeTest(TestCase):
    def setUp(self):
        self.User = UserFactory.create()
        self.project = ProjectFactory.create(user=self.User)
        self.project_screen = ProjectScreenFactory.create(project=self.project, name="test project screen")
        self.screen_assignee = ScreenAssigneeFactory.create(user=self.User, screen=self.project_screen)

    def test_screen_assignee_str(self):
        self.assertEqual(self.screen_assignee.user.username, self.User.username)


class ProjectActivityTest(TestCase):
    def setUp(self):
        self.User = UserFactory.create()
        self.project = ProjectFactory.create(user=self.User)
        self.project_activity = ProjectActivityFactory(member=self.User, project=self.project)

    def test_project_activity_str(self):
        self.assertEqual(self.project_activity.__str__(), ProjectActivity.TASK_CREATED)


class ScreenScenarioTest(TestCase):
    """ Test module for ScreenScenario model """

    def setUp(self):
        self.User = UserFactory.create()
        self.project = ProjectFactory.create(user=self.User)

        self.project_screen = ProjectScreenFactory.create(project=self.project, name="test project screen")
        self.screen_scenario = ScreenScenarioFactory.create(screen=self.project_screen)

    def test_screen_scenario_str(self):
        self.assertEqual(self.screen_scenario.__str__(), str(self.screen_scenario.id))

    def test_screen_scenario_name(self):
        self.assertEqual(self.screen_scenario.name, "test screen scenario")

    def test_screen_scenario_type(self):
        self.assertEqual(self.screen_scenario.type, ScreenScenario.LOGIN)

    def test_screen_scenario_struct_type(self):
        self.assertEqual(self.screen_scenario.struct_type, ScreenScenario.SCENARIO)

    def test_screen_scenario_direction(self):
        self.assertEqual(self.screen_scenario.direction, ScreenScenario.VERTICAL)


class ScenarioElementTest(TestCase):
    def setUp(self):
        self.User = UserFactory.create()
        self.project = ProjectFactory.create(user=self.User)

        self.project_screen = ProjectScreenFactory.create(project=self.project, name="test project screen")
        self.screen_scenario = ScreenScenarioFactory.create(screen=self.project_screen)
        self.scenario_element = ScenarioElementFactory.create(scenario=self.screen_scenario)

    def test_scenario_element_str(self):
        self.assertEqual(self.scenario_element.__str__(), str(self.scenario_element.id))

    def test_scenario_element_struct_type(self):
        self.assertEqual(self.scenario_element.struct_type, ScenarioElement.FRAME)

    def test_scenario_element_func_type(self):
        self.assertEqual(self.scenario_element.func_type, "unknown")

    def test_scenario_element_direction(self):
        self.assertEqual(self.scenario_element.direction, ScenarioElement.VERTICAL)

    def test_scenario_element_scenario(self):
        self.assertEqual(self.scenario_element.scenario, self.screen_scenario)


class ElementCommentTest(TestCase):
    def setUp(self):
        self.User = UserFactory.create()
        self.project = ProjectFactory.create(user=self.User)

        self.project_screen = ProjectScreenFactory.create(project=self.project, name="test project screen")
        self.screen_scenario = ScreenScenarioFactory.create(screen=self.project_screen)
        self.scenario_element = ScenarioElementFactory.create(scenario=self.screen_scenario)
        self.element_comment = ElementCommentFactory.create(element=self.scenario_element, user=self.User,
                                                            text="test element comment")

    def test_element_comment_text(self):
        self.assertEqual(self.element_comment.text, "test element comment")

    def test_element_comment_element(self):
        self.assertEqual(self.element_comment.element, self.scenario_element)

    def test_element_comment_user(self):
        self.assertEqual(self.element_comment.user, self.User)
