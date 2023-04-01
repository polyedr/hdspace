import json
from requests import Response
from rest_framework import status
from rest_framework.views import APIView
from django_bulk_update.helper import bulk_update
from django.db import models
from utils.models import TimeStampedModel
from projects.models import Project


# A model
class PCategory(TimeStampedModel):
    name = models.CharField(max_length=50)
    buoyancy = models.IntegerField(null=True, blank=True)
    project = models.ForeignKey(
        Project, related_name="projectcategory", on_delete=models.CASCADE, null=True
    )

    def __str__(self):
        return self.name


# A view
class CategoriesReorder(APIView):
    def patch(self, request, pk=None):
        """
        Update the order of the categories by the parent project id
        request.data is in the expected structure:
        category pk is in data.children.{n}.id
        """
        decoded = request.body.decode('utf8')
        data = json.loads(decoded)

        sorted_dict = {}
        for key, value in enumerate(data['children']):
            sorted_dict[value['id']] = key

        categories = PCategory.objects.filter(project=pk)
        for category in categories:
            print(category.id)
            category.buoyancy = sorted_dict[category.id]

        affected_rows = bulk_update(categories, update_fields=['buoyancy'])
        if affected_rows:
            return Response({'affected_rows': affected_rows})
        return Response({}, status.HTTP_204_NO_CONTENT)
