import json

from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from apps.generators.serializers import ScenarioElementSerializer
from rest_framework.views import APIView

class GeneratorAPIView(APIView):
    Generator_class = ScenarioElementSerializer


    def get(self,request,*args, **kwargs):
        return Response("Get received")

    def post(self,request,*args, **kwargs):
        data = request.data
        print(data)
        return Response("Post received")

    def update(self,request,*args, **kwargs):
        return Response("Update received")

    def delete(self,request,*args, **kwargs):
        return Response("Delete received")
