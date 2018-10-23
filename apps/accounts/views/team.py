from django.http import HttpResponseRedirect
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView
from django.views.generic.base import View
from django.contrib import messages
from django.urls import reverse
from django.http import JsonResponse
from django.db.models import Q
from django.contrib.auth.models import User

from core.views.seo import SEOViewMixin
from accounts.forms import CreateTeamForm, JoinTeamForm
from accounts.models import Team, TeamMember

__all__ = (
    "TeamView",
    "CreateTeamView",
    "DeleteTeamView",
    "SearchTeamView",
    "JoinTeamView",
)


class TeamView(LoginRequiredMixin, SEOViewMixin, TemplateView):
    template_name = "accounts/team.html"
    page_title = "All Teams"

    def get(self, request, *args, **kwargs):
        context = self.get_context_data()
        context["members"] = TeamMember.objects.filter(user=request.user).values(
            "id",
            "charge",
            "time_log",
            "position",
            "user__first_name",
            "user__last_name",
            "user__username",
            "team__team_name",
            "team__logo",
            "team__available",
            "user__profile__avatar",
        )
        return self.render_to_response(context)


class CreateTeamView(LoginRequiredMixin, SEOViewMixin, TemplateView):
    template_name = "accounts/create_team.html"
    page_title = "Create Team"
    form = CreateTeamForm

    def get(self, request, *args, **kwargs):
        context = self.get_context_data()

        if "form" not in kwargs:
            context["form"] = self.form
            context["join_form"] = JoinTeamForm()

        return self.render_to_response(context)

    def post(self, request, *args, **kwargs):
        form = self.form(request.POST, request.FILES)

        if form.is_valid():
            data = form.cleaned_data
            user = User.objects.filter(Q(username=data["username"]) | Q(email=data["email"])).first()
            if user is None:
                user = User.objects.create(
                    first_name=data["first_name"],
                    last_name=data["last_name"],
                    username=data["username"],
                    email=data["email"],
                    is_active=True,
                )
                user.set_password(data["password"])
                user.profile.avatar = data["avatar"]
                user.save()

            member = TeamMember.objects.create(
                charge=data["charge"],
                time_log=data["time_log"],
                position=data["position"],
                role=TeamMember.ROLE_ADMIN,
                is_active=True,
                user=user,
            )

            team = Team.objects.create(
                logo=data["logo"],
                description=data["description"],
                team_name=data["team_name"],
                available=data["available"],
                owner=request.user,
            )
            team.members.add(member)

            if request.user.username != data["username"]:
                member = TeamMember.objects.create(
                    charge=0,
                    time_log=0,
                    position='Owner',
                    role=TeamMember.ROLE_MEMBER,
                    user=request.user,
                )
                team.members.add(member)

            messages.success(request, "Your team has been created successfully.")
            return HttpResponseRedirect(reverse("accounts:teams"))
        else:
            return self.render_to_response(status=400, context=self.get_context_data(
                form=form,
            ))


class DeleteTeamView(LoginRequiredMixin, View):

    def get(self, request, *args, **kwargs):
        member = kwargs.pop("pk")
        member = TeamMember.objects.get(pk=member)
        team = Team.objects.get(owner=request.user.pk)
        team.members.remove(member)
        messages.success(request, "Team has been deleted successfully.")
        return HttpResponseRedirect(reverse("accounts:teams"))


class SearchTeamView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request, *args, **kwargs):
        team_name = request.POST["teamName"]
        teams = Team.objects.filter(team_name__icontains=team_name, available=True).values("id", "team_name", "logo")
        if teams is None:
            teams = []
        return JsonResponse(list(teams), safe=False)


class JoinTeamView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request, *args, **kwargs):
        form = JoinTeamForm(request.POST)
        if form.is_valid():
            data = request.POST
            team_id = data["teamId"]
            team = Team.objects.get(pk=team_id)
            member = TeamMember.objects.create(
                charge=data["hourly_rate"],
                time_log=0,
                position=data["position"],
                role=TeamMember.ROLE_MEMBER,
                is_active=False,
                user=request.user,
            )
            team.members.add(member)

            return JsonResponse({"msg": "You have connected successfully."})
        else:
            return JsonResponse({"msg": "Invalid form data."}, status=400)
