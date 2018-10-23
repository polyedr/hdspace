from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.base import View
from django.http import JsonResponse
from django.contrib.staticfiles.templatetags.staticfiles import static

from accounts.forms import SearchUserForm
from django.contrib.auth.models import User

__all__ = (
    "SearchUserView",
)


class SearchUserView(LoginRequiredMixin, View):

    # noinspection PyMethodMayBeStatic
    def post(self, request):
        form = SearchUserForm(request.POST)
        if form.is_valid():
            data = form.cleaned_data
            users = User.objects.filter(profile__role=data["position"]).values(
                "pk",
                "first_name",
                "last_name",
                "profile__avatar",
                "profile__role",
                "profile__hourly_rate",
                "teammember__team__team_name",
            )
            no_image = static("/img/profile_empty.png")
            if users is None:
                users = []
            return JsonResponse({"users": list(users), "no_image": no_image})
        else:
            return JsonResponse({"msg": "Position field required."}, status=400)
