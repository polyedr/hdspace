import json

from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.projects.models import ScenarioElement
from apps.projects.serializers import ScenarioElementSerializer



class GeneratorAPIView(APIView):

    serializer = ScenarioElementSerializer

    def get(self,request,*args, **kwargs):
        query_set = ScenarioElement.objects.all()

        return Response(query_set)

    def post(self,request,format = None):
        times = request.data["times"]

        data = request.data
        data.pop('times')
        for i in range(times):
            print("Element created")
        return Response(request.data)

    def update(self,request,*args, **kwargs):
        return Response("Update received")

    def delete(self,request,*args, **kwargs):
        return Response("Delete received")
