from django.utils import timezone

from django.views.generic.base import View, TemplateView
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin

from core.utils import date_difference
from projects.forms import AddTaskForm
from projects.models import (
    Project, ProjectMember, ProjectTask,
    TaskTime, ProjectActivity
)


__all__ = (
    "AddProjectTaskView",
    "AssignTaskView",
    "DeleteTaskView",
    "EditTaskView",
    "AddSubTaskView",
    "TaskManagementView",
    "TaskTimeTrackingView",
    "StopTaskTimeTrackingView",
)


class AddProjectTaskView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request, *args, **kwargs):
        project_id = request.POST["projectId"]
        form = AddTaskForm(project_id, data=request.POST)
        if form.is_valid():
            data = form.cleaned_data
            project = Project.objects.get(pk=project_id)
            member = ProjectMember.objects.get(pk=data["owner"])
            creator = ProjectMember.objects.get(project=project, user=request.user)
            task = ProjectTask.objects.create(
                title=data["title"],
                description=data["description"],
                creator=creator,
                owner=member,
                project=project,
            )
            ProjectActivity.objects.create(
                type=ProjectActivity.TASK_CREATED,
                member=request.user,
                project=project,
            )
            return JsonResponse({
                "msg": "Project task has been created successfully.",
                "title": task.title,
                "description": task.description,
                "created": task.created,
                "id": task.pk,
                "owner": task.owner.pk
            })
        else:
            return JsonResponse({
                "msg": "Invalid data",
            }, status=400)


class AssignTaskView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request, *args, **kwargs):
        task_id = request.POST["taskId"]
        member_id = request.POST["memberId"]
        member = ProjectMember.objects.get(pk=member_id)
        task = ProjectTask.objects.get(pk=task_id)
        ProjectTask.objects.filter(pk=task_id).update(
            owner=member,
        )
        try:
            task_time = TaskTime.objects.get(task=task, stoped=False)
            if task_time.member != member:
                task_time.track_time = task_time.track_time + date_difference(timezone.now(), task_time.started)
                task_time.stoped = True
                task_time.started = None
                task_time.save()
        except TaskTime.DoesNotExist:
            pass

        return JsonResponse({
            "msg": "Task has been successfully assigned.",
        })


class DeleteTaskView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request, *args, **kwargs):
        task_id = request.POST["taskId"]
        task = ProjectTask.objects.filter(pk=task_id).first()
        ProjectActivity.objects.create(
            type=ProjectActivity.TASK_REMOVED,
            member=request.user,
            project=task.project,
        )
        task.delete()
        return JsonResponse({"msg": "Task has been deleted successfully."})


class EditTaskView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request, *args, **kwargs):
        project_id = request.POST["projectId"]
        task_id = request.POST["taskId"]
        form = AddTaskForm(project_id, data=request.POST)
        if form.is_valid():
            data = form.cleaned_data
            project = Project.objects.get(pk=project_id)
            member = ProjectMember.objects.get(project=project, user=data["owner"])
            ProjectTask.objects.filter(pk=task_id).update(
                title=data["title"],
                description=data["description"],
                owner=member,
            )
            return JsonResponse({
                "msg": "Project task has been edited successfully.",
            })
        else:
            return JsonResponse({
                "msg": "Invalid data",
            }, status=400)


class AddSubTaskView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request, *args, **kwargs):
        project_id = request.POST["projectId"]
        task_id = request.POST["taskId"]
        form = AddTaskForm(project_id, data=request.POST)
        if form.is_valid():
            data = form.cleaned_data
            project = Project.objects.get(pk=project_id)
            member = ProjectMember.objects.get(project=project, user=data["owner"])
            creator = ProjectMember.objects.get(project=project, user=request.user)
            parent_task = ProjectTask.objects.get(pk=task_id)
            task = ProjectTask.objects.create(
                title=data["title"],
                description=data["description"],
                creator=creator,
                owner=member,
                project=project,
                sub_task=parent_task,
            )
            return JsonResponse({
                "msg": "Project sub task has been created successfully.",
                "title": task.title,
                "description": task.description,
                "created": task.created,
                "id": task.pk,
                "owner": task.owner.pk
            })
        else:
            return JsonResponse({
                "msg": "Invalid data",
            }, status=400)


class TaskManagementView(LoginRequiredMixin, TemplateView):
    template_name = "projects/management.html"

    def get(self, request, *args, **kwargs):
        context = self.get_context_data()

        tasks = ProjectTask.objects.filter(owner__user=request.user).values(
            "id",
            "title",
            "description"
        )
        tasks = list(tasks)

        track_times = TaskTime.objects.filter(member__user=request.user).values(
            "task__pk",
            "stoped",
            "track_time",
        )
        track_times = list(track_times)

        for task in tasks:
            for track_time in track_times:
                if task["id"] == track_time["task__pk"]:
                    task["stoped"] = track_time["stoped"]
                    task["track_time"] = track_time["track_time"]
                else:
                    task["stoped"] = True
                    task["track_time"] = 0
        context["tasks"] = tasks
        return self.render_to_response(context)


class TaskTimeTrackingView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request, *args, **kwargs):
        task_id = request.POST["taskId"]
        task = ProjectTask.objects.get(pk=task_id)
        member = ProjectMember.objects.get(project=task.project, user=request.user)
        try:
            task_time = TaskTime.objects.get(member=member)
            task_time.started = timezone.now()
            task_time.stoped = False
            task_time.save()
        except TaskTime.DoesNotExist:
            TaskTime.objects.create(
                track_time=0,
                started=timezone.now(),
                stoped=False,
                task=task,
                member=member,
            )

        return JsonResponse({
            "msg": "Task time is started tracking.",
        })


class StopTaskTimeTrackingView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request, *args, **kwargs):
        task_id = request.POST["taskId"]
        task = ProjectTask.objects.get(pk=task_id)
        member = ProjectMember.objects.get(project=task.project, user=request.user)
        try:
            task_time = TaskTime.objects.get(member=member, stoped=False)
            task_time.track_time = task_time.track_time + date_difference(timezone.now(), task_time.started)
            task_time.stoped = True
            task_time.save()
        except TaskTime.DoesNotExist:
            pass

        return JsonResponse({
            "msg": "Task tracking stoped.",
        })
