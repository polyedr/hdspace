from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.base import View
from django.http import JsonResponse
from django.contrib.staticfiles.templatetags.staticfiles import static
from django.core.exceptions import ObjectDoesNotExist

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
        # Validation ObjectId --> String
        for u in users:
            u['pk'] = str(u['pk'])
        return JsonResponse({"users": list(users), "no_image": no_image})


class UserStatusView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request):
        print('UserStatusPro')
        projectId = request.POST["projectId"]
        context = dict()
        members = None
        print(projectId)
        try:
            project = Project.objects.get(pk=projectId)
        except ObjectDoesNotExist:
            project = None
        else:
            try:
                members = ProjectMember.objects.filter(project=project)
            except ObjectDoesNotExist:
                members = None
            else:
                if members is not None:
                    print(members)
                    for member in members:
                        print(member.pk)
                        # print(member.user)

                    context['members'] = []
                    for member in members:
                        member_pk = member.pk
                        try:
                             status_user = member.user.profile.online()
                        except ObjectDoesNotExist:
                            status_user = True
                        context['members'].append(dict(
                            member_id=member_pk,
                            status=status_user,
                        ))
        # Next code is David code to make a query in the data base. Sometimes
        # the query doesn't match and produce an error. With the above code we try to catch
        # the matchQuery error and assign it a temporal value to the variable.
        # context["members"] = [dict(
        #     member_id=member.pk,
        #     status=member.user.profile.online(), // Sometime Problems with the query
        # ) for member in members]
        print(context)

        return JsonResponse(context)
