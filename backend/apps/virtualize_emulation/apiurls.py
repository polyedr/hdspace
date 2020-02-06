from django.urls import path, include

api_virtualize_emulation_scenario_patterns = []
urlpatterns = [
    path("virtualize_emulations", include(api_virtualize_emulation_scenario_patterns))
]
