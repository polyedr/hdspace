from django.http import HttpResponseRedirect
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView
from django.views.generic.base import View
from django.contrib import messages
from django.urls import reverse
from django.contrib.auth.models import User

from core.views.seo import SEOViewMixin
from accounts.forms import CreateTeamForm
from accounts.models import Team, TeamMember

__all__ = (
    "TeamView",
    "CreateTeamView",
    "DeleteTeamView",
)


class TeamView(LoginRequiredMixin, SEOViewMixin, TemplateView):
    template_name = "accounts/team.html"
    page_title = "Team Members"

    def get(self, request, *args, **kwargs):
        context = self.get_context_data()
        try:
            team = Team.objects.get(owner=request.user)
            context["members"] = team.members.all()
        except Team.DoesNotExist:
            context["members"] = None
        return self.render_to_response(context)


class CreateTeamView(LoginRequiredMixin, SEOViewMixin, TemplateView):
    template_name = "accounts/create_team.html"
    page_title = "Create Team"
    form = CreateTeamForm

    def get(self, request, *args, **kwargs):
        context = self.get_context_data()

        if "form" not in kwargs:
            context["form"] = self.form

        return self.render_to_response(context)

    def post(self, request, *args, **kwargs):
        form = self.form(request.POST, request.FILES)

        if form.is_valid():
            data = form.cleaned_data
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
                description=data["description"],
                available=data["available"],
                logo=data["logo"],
                user=user,
            )
            try:
                team = Team.objects.get(owner=request.user.pk)
            except Team.DoesNotExist:
                team = Team.objects.create(
                    owner=request.user,
                )
            team.members.add(member)

            messages.success(request, "You team has been added successfully.")
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
