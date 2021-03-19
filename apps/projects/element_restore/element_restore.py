import glob
import json
from apps.projects.models import ScenarioElement

from apps.accounts.tests.accounts_factory import UserFactory
from apps.projects.tests.projects_factory import ProjectFactory, ProjectScreenFactory, \
    ScreenScenarioFactory, ScenarioElementFactory


def restore_element(path="C:/Users/Nelly li/Desktop/Adevi/Element/*"):
    user = UserFactory.create()
    project = ProjectFactory.create(user=user)
    screen = ProjectScreenFactory.create(project=project, name="test project screen")
    scenario = ScreenScenarioFactory.create(screen=screen)

    all_elements = glob.glob(path)
    for i in range(len(all_elements)):
        f = open(all_elements[i])
        element = json.load(f)
        restore_element_aux(element, scenario)


def restore_element_aux(element, scenario, parent=None):
    restored_element = ScenarioElementFactory.create(struct_type=element['struct_type'], parent=parent,
                                                     func_type=element['func_type'], name=element['name'],
                                                     styles=element['styles'], parameters=element['parameters'],
                                                     buoyancy=element['buoyancy'], image=element['image'],
                                                     direction=element['direction'], shared=element['shared'],
                                                     scenario=scenario)

    if element['children'] != []:
        for i in range(len(element['children'])):
            restore_element_aux(element['children'][i], scenario, restored_element)


def clear_database():
    ScenarioElement.objects.all().delete()
