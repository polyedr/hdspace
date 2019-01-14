from django.contrib.auth.mixins import LoginRequiredMixin
from django.http.response import JsonResponse
from django.views.generic.base import View


from apps.projects.models import (
    ProjectMember, ProjectTask, ProjectActivity,
    ProjectScreen, Comment, ScreenComment,
)

__all__ = (
    "ScreenCommentsView",
    "ScreenCommentView",
    "EditView",
    "DeleteCommentView",
)


class ScreenCommentsView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def get(self, request, *args, **kwargs):
        screen_id = kwargs.pop("screen_id")
        comment_id = kwargs.pop("pk")
        screen = ProjectScreen.objects.get(pk=screen_id)
        comments = Comment.objects.filter(comment__pk=comment_id, comment__screen=screen)
        screen_comments = []
        for comment in comments:
            one_comment = dict(
                id=comment.pk,
                image=comment.comment.user.profile.get_image(),
                user=comment.comment.user.get_full_name(),
                comment=comment.text,
                created=comment.created,
            )
            screen_comments.append(one_comment)
        return JsonResponse({
            "screen_comments": screen_comments,
        }, safe=False)


class ScreenCommentView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request, *args, **kwargs):
        screen_id = request.POST["screen_id"]
        comment_id = request.POST["commen_id"]
        x = request.POST["x"]
        y = request.POST["y"]
        comment_text = request.POST["comment"]
        if comment_id == '':
            screen = ProjectScreen.objects.get(pk=screen_id)
            screen_comment = ScreenComment.objects.create(
                x=x,
                y=y,
                screen=screen,
                user=request.user,
            )
            comment = Comment.objects.create(
                comment=screen_comment,
                text=comment_text
            )
        else:
            old_comment = ScreenComment.objects.get(pk=comment_id)
            comment = Comment.objects.create(
                comment=old_comment,
                text=comment_text
            )

        ProjectActivity.objects.create(
            type=ProjectActivity.SCREEN_COMMENT,
            member=request.user,
            project=comment.comment.screen.project,
        )

        member = ProjectMember.objects.get(project=comment.comment.screen.project, user=request.user)
        ProjectTask.objects.create(
            title='',
            description=comment_text,
            creator=member,
            owner=member,
            project=comment.comment.screen.project,
        )

        ProjectActivity.objects.create(
            type=ProjectActivity.TASK_CREATED,
            member=request.user,
            project=comment.comment.screen.project,
        )

        return JsonResponse({
            "id": comment.pk,
            "comment_id": comment.comment.pk,
            "user": request.user.get_full_name(),
            "image": request.user.profile.get_image(),
            "comment": comment.text
        }, safe=False)


class EditView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request, **kwargs):
        comment_id = request.POST["comment_id"]
        comment = request.POST["comment"]
        Comment.objects.filter(pk=comment_id).update(
            text=comment
        )

        return JsonResponse({"msg": "Comment has been edited successfully."})


class DeleteCommentView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request, *args, **kwargs):
        comment_id = request.POST["comment_id"]
        Comment.objects.filter(pk=comment_id).delete()
        return JsonResponse({"msg": "Comment has been deleted successfully."})

