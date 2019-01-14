from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.base import View
from django.http import JsonResponse
from django.contrib.staticfiles.templatetags.staticfiles import static

from apps.accounts.models import User
from apps.projects.models import ProjectMember, Project

__all__ = (
    "SearchUserView",
    "UserStatusView",
)


class SearchUserView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request):
        data = request.POST
        users = User.objects.all().values(
            "pk",
            "first_name",
            "last_name",
            "profile__avatar",
            "profile__role",
            "profile__hourly_rate",
            "teammember__team__team_name",
        )

        if data["position"]:
            users = users.filter(profile__role=data["position"])
        if data["rate_from"]:
            users = users.filter(profile__hourly_rate__gte=data["rate_from"])
        if data["rate_to"]:
            users = users.filter(profile__hourly_rate__lte=data["rate_to"])
        no_image = static("/img/profile_empty.png")
        if users is None:
            users = []
        return JsonResponse({"users": list(users), "no_image": no_image})


class UserStatusView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request):
        projectId = request.POST["projectId"]
        project = Project.objects.get(pk=projectId)
        members = ProjectMember.objects.filter(project=project)

        context = dict()
        context["members"] = [dict(
            member_id=member.pk,
            status=member.user.profile.online(),
        ) for member in members]

        return JsonResponse(context)
