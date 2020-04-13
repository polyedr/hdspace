import { T as ProjectT } from '$redux/project';

export function makeContainerMock(scenario?: Partial<ProjectT.IScenarioItem>): ProjectT.IScenarioItem {
  return {
    parent_id: -1,
    id: -100,
    name: 'Root',
    struct_type: 'container',
    screen: 0,
    buoyancy: 0,
    direction: 'vertical',
    elements: [],
    parameters: {
      children: [],
    },
    styles: {},
    ...scenario,
  }
}

export function makeElementMock(element?: Partial<ProjectT.IScenarioElement>): ProjectT.IScenarioElement {
  return {
    scenario: 0,
    buoyancy: 0,
    dynamic_buoyancy: 0,
    name: 'Element',
    struct_type: 'textinput',
    func_type: 'textinput',
    id: -1000,
    image: null,
    parameters: {
      parent_id: 0,
      group: `don't know what is this`,
    },
    styles: {},
    children: [],
    ...element,
  }
}
