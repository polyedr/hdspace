from rest_framework import generics

from apps.phrases.serializers import DescribedHTMLSerializer
from apps.phrases.models import DescribedHTML


class DescribedHTMLView(generics.ListCreateAPIView):
    """
    List all the HTML components described, or create a new HTML description.
    """
    queryset = DescribedHTML.objects.all()
    serializer_class = DescribedHTMLSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
