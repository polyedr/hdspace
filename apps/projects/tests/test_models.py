from django.test import TestCase
from ..models import *
from ..models import ScreenScenario, Roles, ProjectIllustrationSet, ProjectImage, ScenarioElement, ElementComment
import uuid
import datetime
from guardian.shortcuts import assign_perm
from apps.accounts.models import Profile, User


class UserPermissionTest(TestCase):
    """ Test if user has permission to a project """

    def setUp(self):
        self.User = User.objects.create(email="q1210201368@gmail.com")
        self.project_attributes1 = {
            "user_id": 1,
            "name": "testproject",
            "status": "pending",
        }
        self.project = Project.objects.create(**self.project_attributes1)

    def test_user_has_permission(self):
        assign_perm("assign_project", self.User, self.project)
        self.assertEqual(True, self.User.has_perm("assign_project", self.project))


# Create more test cases showing object level permission

class ProjectTest(TestCase):
    """ Test module for Project model """

    def setUp(self):
        self.User = User.objects.create(email="q1210201368@gmail.com")
        self.project_attributes1 = {"name": "testproject", "status": Project.STATUS_PENDING, "user": self.User}
        self.project = Project.objects.create(**self.project_attributes1)

        self.project_attributes2 = {"name": "testproject2", "status": Project.STATUS_PAID, "user": self.User}
        self.project = Project.objects.create(**self.project_attributes2)

    def test_project_str(self):
        project_test1 = Project.objects.get(name="testproject")
        project_test2 = Project.objects.get(name="testproject2")
        self.assertEqual(project_test1.__str__(), project_test1.name)
        self.assertEqual(project_test2.__str__(), project_test2.name)

    def tearDown(self):
        for project in Project.objects.all():
            project.delete()


class ProjectScreenTest(TestCase):
    def setUp(self):
        self.User = User.objects.create(email="q1210201368@gmail.com")
        self.project_attributes = {"name": "testproject", "status": Project.STATUS_PENDING, "user": self.User}
        self.project = Project.objects.create(**self.project_attributes)
        self.project_screen_attributes = {"name": "test project screen", "status": ProjectScreen.SCREEN_IN_PROGRESS,
                                          "project": self.project}
        self.project_screen = ProjectScreen.objects.create(**self.project_screen_attributes)

    def test_project_scrren_str(self):
        project_screen = ProjectScreen.objects.get(name="test project screen")
        self.assertEqual(project_screen.__str__(), str(project_screen.id))

    def test_project_screen_status(self):
        project_screen = ProjectScreen.objects.get(name="test project screen")
        self.assertEqual(project_screen.status, ProjectScreen.SCREEN_IN_PROGRESS)


class ScreenEventTest(TestCase):
    def setUp(self):
        self.User = User.objects.create(email="q1210201368@gmail.com")
        self.project_attributes1 = {"name": "testproject", "status": Project.STATUS_PENDING, "user": self.User}
        self.project = Project.objects.create(**self.project_attributes1)
        self.project_screen_attributes = {"name": "test project screen", "status": ProjectScreen.SCREEN_IN_PROGRESS,
                                          "project": self.project}
        self.project_screen = ProjectScreen.objects.create(**self.project_screen_attributes)
        self.screen_event_attributes = {
            "event": ScreenEvent.EVENT_CLICK,
            "link_to": ScreenEvent.LINK_TO_URL,
            "href": "www.google.com.au",
            "screen": self.project_screen,
            "height": 0,
            "width": 0,
            "x": 0,
            "y": 0, }
        self.screen_event = ScreenEvent.objects.create(**self.screen_event_attributes)

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
        self.User = User.objects.create(email="q1210201368@gmail.com")
        self.project_attributes1 = {"name": "testproject", "status": Project.STATUS_PENDING, "user": self.User}
        self.project = Project.objects.create(**self.project_attributes1)
        self.project_screen1_attributes = {"name": "test project screen", "status": ProjectScreen.SCREEN_IN_PROGRESS,
                                           "project": self.project}
        self.project_screen1 = ProjectScreen.objects.create(**self.project_screen1_attributes)
        self.screen_comment_attributes = {"x": 0, "y": 0, "screen": self.project_screen1, "user": self.User}
        self.screen_comment = ScreenComment.objects.create(**self.screen_comment_attributes)

    def test_screen_comment_attributes(self):
        self.assertEqual(self.screen_comment.x, 0)
        self.assertEqual(self.screen_comment.y, 0)

    def test_screen_user(self):
        self.assertEqual(self.screen_comment.user, self.User)

    def test_screen_screen(self):
        self.assertEqual(self.screen_comment.screen, self.project_screen1)


class CommentTest(TestCase):
    def setUp(self):
        self.User = User.objects.create(email="q1210201368@gmail.com")
        self.project_attributes1 = {"name": "testproject", "status": Project.STATUS_PENDING, "user": self.User}
        self.project = Project.objects.create(**self.project_attributes1)
        self.project_screen1_attributes = {"name": "test project screen", "status": ProjectScreen.SCREEN_IN_PROGRESS,
                                           "project": self.project}
        self.project_screen1 = ProjectScreen.objects.create(**self.project_screen1_attributes)
        self.screen_comment_attributes = {"x": 0, "y": 0, "screen": self.project_screen1, "user": self.User}
        self.screen_comment = ScreenComment.objects.create(**self.screen_comment_attributes)
        self.comment_attributes = {"text": "Test comment", "comment": self.screen_comment}
        self.comment = Comment.objects.create(**self.comment_attributes)

    def test_comment_text(self):
        self.assertEqual(self.comment.text, "Test comment")

    def test_screen_screen_comment(self):
        self.assertEqual(self.comment.comment, self.screen_comment)


# class ProjectInvitationTest(TestCase):
#     def setUp(self):
#         self.User = User.objects.create(email="q1210201368@gmail.com")
#         self.project_attributes1 = {"name": "testproject", "status": Project.STATUS_PENDING,"user":self.User}
#         self.project = Project.objects.create(**self.project_attributes1)
#         self.uuid = uuid.uuid4()
#         self.project_invitation_attributes = {"invitation_token":self.uuid,"is_active":False,"email":"ylii0204@student.monash.edu","user":self.User,"project":self.project}
#         self.project_invitation = ProjectInvitation.objects.create(**self.project_invitation_attributes)
#
#     def test_project_invitation_token(self):
#         self.assertEqual(self.project_invitation.invitation_token, self.uuid)
#
#     def test_project_is_active(self):
#         self.assertEqual(self.project_invitation.is_active, False)
#
#     def test_project_email_and_user(self):
#         self.assertEqual(self.project_invitation.email,"ylii0204@student.monash.edu")
#         self.assertEqual(self.project_invitation.user,self.User)

class ProjectMemberTest(TestCase):
    def setUp(self):
        self.User = User.objects.create(email="q1210201368@gmail.com")
        self.project_attributes1 = {"name": "testproject", "status": Project.STATUS_PENDING, "user": self.User}
        self.project = Project.objects.create(**self.project_attributes1)
        self.project_member_attributes = {"role": Roles.EXTERNAL_ROLE_PROJECT_OWNER,
                                          "status": ProjectMember.STATUS_CREATOR, "project": self.project,
                                          "user": self.User}
        self.project_member = ProjectMember.objects.create(**self.project_member_attributes)

    def test_project_member_str(self):
        self.assertEqual(self.project_member.user.email, "q1210201368@gmail.com")

    def test_project_member_status(self):
        self.assertEqual(self.project_member.status, ProjectMember.STATUS_CREATOR)


class ProjectTaskTest(TestCase):

    def setUp(self):
        self.User = User.objects.create(email="q1210201368@gmail.com")
        self.project_attributes1 = {"name": "testproject", "status": Project.STATUS_PENDING, "user": self.User}
        self.project1 = Project.objects.create(**self.project_attributes1)

        self.project_task_attributes = {
            "title": "Test Task1",
            "description": "Test Task",
            "status": ProjectTask.TASK_CREATED,
            "creator": self.User,
            "owner": self.User,
            "project": self.project1
        }
        self.project_task = ProjectTask.objects.create(**self.project_task_attributes)
        self.projecttask_test1 = ProjectTask.objects.get(title="Test Task1")

    def test_projecttask_created(self):
        self.assertTrue(ProjectTask.objects.filter(title="Test Task1").exists())

    def test_projecttask_str(self):
        self.assertEqual(self.projecttask_test1.__str__(), self.projecttask_test1.title)

    def test_projecttask_creator_owner(self):
        self.assertEqual(self.projecttask_test1.owner, self.User)
        self.assertEqual(self.projecttask_test1.creator, self.User)


class TaskTimeTest(TestCase):
    def setUp(self):
        self.User = User.objects.create(email="q1210201368@gmail.com")
        self.project_attributes = {"name": "testproject", "status": Project.STATUS_PENDING, "user": self.User}
        self.project = Project.objects.create(**self.project_attributes)

        self.project_task_attributes = {
            "title": "Test Task1",
            "description": "Test Task",
            "status": ProjectTask.TASK_CREATED,
            "creator": self.User,
            "owner": self.User,
            "project": self.project
        }
        self.project_task = ProjectTask.objects.create(**self.project_task_attributes)

        self.project_member_attributes = {"role": Roles.EXTERNAL_ROLE_PROJECT_OWNER,
                                          "status": ProjectMember.STATUS_CREATOR, "project": self.project,
                                          "user": self.User}
        self.project_member = ProjectMember.objects.create(**self.project_member_attributes)

        self.started_time = datetime.datetime.now().isoformat()
        self.task_time_attributes = {
            "track_time": 0,
            "started": self.started_time,
            "stoped": True,
            "task": self.project_task,
            "member": self.project_member

        }
        self.task_time = TaskTime.objects.create(**self.task_time_attributes)

    def test_task_time_str(self):
        self.assertEqual(self.task_time.__str__(), self.User.username)

    def test_task_time_track_time(self):
        self.assertEqual(self.task_time.track_time, 0)

    def test_task_time_track_time(self):
        self.assertEqual(self.task_time.started, self.started_time)

    def test_task_time_stopped(self):
        self.assertEqual(self.task_time.stoped, True)

    def test_task_time_time(self):
        self.assertEqual(self.task_time.task, self.project_task)


class ProjectIllustrationSetTest(TestCase):
    def setUp(self):
        self.User = User.objects.create(email="q1210201368@gmail.com")
        self.project_attributes = {"name": "testproject", "status": Project.STATUS_PENDING, "user": self.User}
        self.project = Project.objects.create(**self.project_attributes)

        self.project_illustration_set_attributes = {
            "name": "test illustration set",
            "illustrationList": "8.jpg",
            "project": self.project
        }
        self.project_illustration_set = ProjectIllustrationSet.objects.create(
            **self.project_illustration_set_attributes)

    def test_project_illustration_set_name(self):
        self.assertEqual(self.project_illustration_set.name, "test illustration set")

    def test_project_illustration_set_illustration_list(self):
        self.assertEqual(self.project_illustration_set.illustrationList, "8.jpg")

    def test_project_illustration_project(self):
        self.assertEqual(self.project_illustration_set.project, self.project)


class ProjectImageTest(TestCase):
    def setUp(self):
        self.User = User.objects.create(email="q1210201368@gmail.com")
        self.project_attributes = {"name": "testproject", "status": Project.STATUS_PENDING, "user": self.User}
        self.project = Project.objects.create(**self.project_attributes)
        self.project_illustration_set_attributes = {
            "name": "test illustration set",
            "illustrationList": "8.jpg",
            "project": self.project
        }
        self.project_illustration_set = ProjectIllustrationSet.objects.create(
            **self.project_illustration_set_attributes)

        self.project_image_attributes = {
            "image": "8.jpg",
            "illustration_set": self.project_illustration_set
        }
        self.project_image = ProjectImage.objects.create(**self.project_image_attributes)

    def test_project_image_image(self):
        self.assertEqual(self.project_image.image, "8.jpg")

    def test_project_image_illustration_set(self):
        self.assertEqual(self.project_image.illustration_set, self.project_illustration_set)


class ScreenAssigneeTest(TestCase):
    def setUp(self):
        self.User = User.objects.create(email="q1210201368@gmail.com")
        self.project_attributes = {"name": "testproject", "status": Project.STATUS_PENDING, "user": self.User}
        self.project = Project.objects.create(**self.project_attributes)
        self.project_screen_attributes = {"name": "test project screen", "status": ProjectScreen.SCREEN_IN_PROGRESS,
                                          "project": self.project}
        self.project_screen = ProjectScreen.objects.create(**self.project_screen_attributes)
        self.screen_assignee_attributes = {
            "screen": self.project_screen,
            "user": self.User
        }
        self.screen_assignee = ScreenAssignee.objects.create(**self.screen_assignee_attributes)

    def test_screen_assignee_str(self):
        self.assertEqual(self.screen_assignee.user.username, self.User.username)


class ProjectActivityTest(TestCase):
    def setUp(self):
        self.User = User.objects.create(email="q1210201368@gmail.com")
        self.project_attributes = {"name": "testproject", "status": Project.STATUS_PENDING, "user": self.User}
        self.project = Project.objects.create(**self.project_attributes)

        self.project_activity_attributes = {
            "type": ProjectActivity.TASK_CREATED,
            "member": self.User,
            "project": self.project,

        }
        self.project_activity = ProjectActivity.objects.create(**self.project_activity_attributes)

    def test_project_activity_str(self):
        self.assertEqual(self.project_activity.__str__(), ProjectActivity.TASK_CREATED)


class ScreenScenarioTest(TestCase):
    """ Test module for ScreenScenario model """

    def setUp(self):
        self.User = User.objects.create(email="q1210201368@gmail.com")
        self.project_attributes = {"name": "testproject", "status": Project.STATUS_PENDING, "user": self.User}
        self.project = Project.objects.create(**self.project_attributes)
        self.project_screen_attributes = {"name": "test project screen", "status": ProjectScreen.SCREEN_IN_PROGRESS,
                                          "project": self.project}
        self.project_screen = ProjectScreen.objects.create(**self.project_screen_attributes)

        self.ScreenScenario_attributes = {
            "name": "test screen scenario",
            "type": ScreenScenario.LOGIN,
            "struct_type": ScreenScenario.SCENARIO,
            "screen": self.project_screen,
            "image": "8.jpg",
            "direction": ScreenScenario.VERTICAL,

        }
        self.screen_scenario = ScreenScenario.objects.create(**self.ScreenScenario_attributes)

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
        self.User = User.objects.create(email="q1210201368@gmail.com")
        self.project_attributes = {"name": "testproject", "status": Project.STATUS_PENDING, "user": self.User}
        self.project = Project.objects.create(**self.project_attributes)
        self.project_screen_attributes = {"name": "test project screen", "status": ProjectScreen.SCREEN_IN_PROGRESS,
                                          "project": self.project}
        self.project_screen = ProjectScreen.objects.create(**self.project_screen_attributes)
        self.ScreenScenario_attributes = {
            "name": "test screen scenario",
            "type": ScreenScenario.LOGIN,
            "struct_type": ScreenScenario.SCENARIO,
            "screen": self.project_screen,
            "image": "8.jpg",
            "direction": ScreenScenario.VERTICAL,
        }
        self.screen_scenario = ScreenScenario.objects.create(**self.ScreenScenario_attributes)
        self.scenario_element_attributes = {
            "name": "test scenario element",
            "struct_type": ScenarioElement.FRAME,
            "func_type": "unknown",
            "direction": ScenarioElement.VERTICAL,
            "scenario": self.screen_scenario,
            "image": "8.jpg",
            "shared": False
        }
        self.scenario_element = ScenarioElement.objects.create(**self.scenario_element_attributes)

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
        self.User = User.objects.create(email="q1210201368@gmail.com")
        self.project_attributes = {"name": "testproject", "status": Project.STATUS_PENDING, "user": self.User}
        self.project = Project.objects.create(**self.project_attributes)
        self.project_screen_attributes = {"name": "test project screen", "status": ProjectScreen.SCREEN_IN_PROGRESS,
                                          "project": self.project}
        self.project_screen = ProjectScreen.objects.create(**self.project_screen_attributes)
        self.ScreenScenario_attributes = {
            "name": "test screen scenario",
            "type": ScreenScenario.LOGIN,
            "struct_type": ScreenScenario.SCENARIO,
            "screen": self.project_screen,
            "image": "8.jpg",
            "direction": ScreenScenario.VERTICAL,
        }
        self.screen_scenario = ScreenScenario.objects.create(**self.ScreenScenario_attributes)
        self.scenario_element_attributes = {
            "name": "test scenario element",
            "struct_type": ScenarioElement.FRAME,
            "func_type": "unknown",
            "direction": ScenarioElement.VERTICAL,
            "scenario": self.screen_scenario,
            "image": "8.jpg",
            "shared": False
        }
        self.scenario_element = ScenarioElement.objects.create(**self.scenario_element_attributes)
        self.element_comment_attributes = {
            "text": "test element comment",
            "element": self.scenario_element,
            "user": self.User
        }
        self.element_comment = ElementComment.objects.create(**self.element_comment_attributes)

    def test_element_comment_text(self):
        self.assertEqual(self.element_comment.text, "test element comment")

    def test_element_comment_element(self):
        self.assertEqual(self.element_comment.element, self.scenario_element)

    def test_element_comment_user(self):
        self.assertEqual(self.element_comment.user, self.User)
