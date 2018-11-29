from django.urls import path

from .views import *  # noqa

app_name = "threads"

urlpatterns = [
    path("list/<int:pk>/", MessageListView.as_view(), name="list"),
    path("chat/<int:pk>/", ChatView.as_view(), name="chat"),
    path("delete/", DeleteView.as_view(), name="delete"),
    path("edit/", EditView.as_view(), name="edit"),
    path("add-message-file/", AddMessageFileView.as_view(), name="add_message_file"),
]
