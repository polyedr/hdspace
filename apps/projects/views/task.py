from django.views.generic.base import View
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin

from projects.forms import AddTaskForm
from projects.models import Project, ProjectMember, ProjectTask


__all__ = (
    "AddProjectTaskView",
    "AssignTaskView",
    "DeleteTaskView",
    "EditTaskView",
    "AddSubTaskView",
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
        ProjectTask.objects.filter(pk=task_id).update(
            owner=member,
        )

        return JsonResponse({
            "msg": "Task has been successfully assigned.",
        })


class DeleteTaskView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request, *args, **kwargs):
        task_id = request.POST["taskId"]
        ProjectTask.objects.filter(pk=task_id).delete()
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
