from django.urls import path
from apps.phrases.apiviews import DescribedHTMLView

app_name = "phrases"

urlpatterns = [
    path("", DescribedHTMLView.as_view()),
    # path("nlp/", DescribedHTMLView.as_view()),
]
