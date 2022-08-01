from django.urls import path
from apps.schat.apiviews import SchatView

app_name = "schat"

urlpatterns = [
    path("", SchatView.as_view()),
    # path("nlp/", DescribedHTMLView.as_view()),
]

