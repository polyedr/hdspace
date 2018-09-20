from django.urls import path

from .views import MessageListView, ChatView, ThreadsListView

app_name = "threads"

urlpatterns = [
    path("list/<int:pk>/", MessageListView.as_view(), name="list"),
    path("chat/<int:pk>/", ChatView.as_view(), name="chat"),
    path("threads/", ThreadsListView.as_view(), name="thread_list"),
]
