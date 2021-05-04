from faker import Faker
import random

# Create your views here.
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.projects.models import ScenarioElement
from apps.projects.serializers import ScenarioElementSerializer

fake = Faker()
Faker.seed(0)
color_list = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink']
serializer = ScenarioElementSerializer()


class GeneratorAPIView(APIView):

    def get(self, request, *args, **kwargs):
        query_set = ScenarioElement.objects.all()

        return Response(query_set)

    def post(self, request, format=None):
        if request.data["times"]:
            times = request.data["times"]
            type = request.data["type"]
            data = request.data
            data.pop('times')

        if times:
            for _ in range(times):
                color = color_list[random.randint(0, len(color_list) - 1)]
                color_code = fake.color(hue=color)

                myobj = {
                    "name": f"{color} background button",
                    "children": [],
                    "struct_type": data["type"] if data["type"] else "button",
                    "func_type": data["type"] if data["type"] else "button",
                    "direction": data.get("direction") if data.get("direction") is not None else "vertical",
                    "buoyancy": data.get("buoyancy") if data.get("buoyancy") is not None else 0,
                    "parameters": data.get("parameters") if data.get("parameters") is not None else {
                        "freeCanvas": {
                            "left": 20,
                            "top": 20,
                            "zIndex": 0,
                            "width": 54,
                            "height": 27
                        },
                        "group": "form",
                        "layouts": [
                            "desktop",
                            "tablet",
                            "mobile"
                        ],
                        "textContent": "button",
                        "showRipple": True
                    },
                    "styles": data.get("styles") if data.get("styles") is not None else {
                        "classNames": [
                            "button"
                        ],
                        "ownStyles": {
                            "color": "#000000",
                            "background-color": f"{color_code}"
                        }
                    },
                    "shared": data.get("shared") if data.get("shared") is not None else False

                }
                print("data inserted")
                response = serializer.create(myobj)
                print(response)
            return Response(f"Successfully generated {times} random {type} elements")

    def update(self, request, *args, **kwargs):
        return Response("Update received")

    def delete(self, request, *args, **kwargs):
        return Response("Delete received")
