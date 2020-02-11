import * as R from 'ramda';
import { createSelector } from 'reselect';
import { IScenarioItem, IScenarios, IScenarioElement, IScenarioElements } from '$redux/project/types';
import {
  LIST_SCENARIO_TYPE, DEFAULT_INDENTS, DEFAULT_BORDER, DEFAULT_BACKGROUND, DEFAULT_TYPOGRAPHY, DEFAULT_SIZE, DEFAULT_ACTION, DEFAULT_PLACEHOLDER, DEFAULT_TEXT_CONTENT, DEFAULT_MAP_PROPS, DEFAULT_DISPLAY,
} from '$constants/defaultParams';

export const ENTITIES = [
  'root', 'container', 'button', 'textinput', 'hyperlink', 'ocrtext', 'image', 'select', 'map', 'calendar', 'clock', 'undefined'
] as const;
const CONTROLS_AFFECT_ON_PARAMS = ['action', 'mapProps', 'placeholder', 'textContent'] as const;
const CONTROLS_AFFECT_ON_STYLES = ['display', 'indents', 'size', 'typography', 'border', 'background'] as const;

const controlAffectsOnStyles = (controlName: Control) => (
  CONTROLS_AFFECT_ON_STYLES.find(x => x === controlName) !== undefined
);

export type Entity = typeof ENTITIES[number];
export type Control = typeof CONTROLS_AFFECT_ON_PARAMS[number] | typeof CONTROLS_AFFECT_ON_STYLES[number];

// WARN: every time you add or remove some properties in prod, you must write migration to add/remove properties for existing entities in db
export const AVAILABLE_CONTROLS: Record<Entity, Control[]> = {
  root: ['background'],
  container: ['indents', 'size', 'display', 'typography', 'border', 'background'],
  button: ['indents', 'size', 'typography', 'border', 'background', 'textContent', 'action'],
  textinput: ['indents', 'size', 'typography', 'border', 'background', 'placeholder'],
  hyperlink: ['typography', 'border', 'background', 'action'],
  ocrtext: ['indents', 'size', 'typography', 'border', 'background', 'textContent'],
  image: ['indents', 'size', 'border', 'background'],
  select: ['indents', 'size', 'typography', 'border', 'background'],
  map: ['indents', 'size', 'typography', 'border', 'background', 'mapProps'],
  calendar: ['indents', 'size', 'typography', 'border', 'background'],
  clock: ['indents', 'size', 'typography', 'border', 'background'],
  undefined: ['size', 'background'],
};

const CONTROLS_DEFAULTS: Record<Control, any> = {
  display: DEFAULT_DISPLAY,
  indents: DEFAULT_INDENTS,
  size: DEFAULT_SIZE,
  typography: DEFAULT_TYPOGRAPHY,
  border: DEFAULT_BORDER,
  background: DEFAULT_BACKGROUND,
  action: DEFAULT_ACTION,
  placeholder: DEFAULT_PLACEHOLDER,
  textContent: DEFAULT_TEXT_CONTENT,
  mapProps: DEFAULT_MAP_PROPS,
};

type EntityToDefaults = {
  [P in Entity]: Record<Control, any>;
};

const extractDefaults = (entity: Entity, control?: Control) => control
  ? R.pick(AVAILABLE_CONTROLS[entity], CONTROLS_DEFAULTS)[control]
  : R.pick(AVAILABLE_CONTROLS[entity], CONTROLS_DEFAULTS);

const ENTITY_TO_DEFAULTS: EntityToDefaults = {
  root: extractDefaults('root'),
  container: extractDefaults('container'),
  button: {
    ...extractDefaults('button'),
    border: {
      ...extractDefaults('button', 'border'),
      'border-color': '#1890ff',
      'border-width': '1px',
      'border-style': 'solid',
      'border-radius': '4px',
    },
    background: {
      ...extractDefaults('button', 'background'),
      'background-color': '#1890ff',
    },
    typography: {
      ...extractDefaults('button', 'typography'),
      color: '#ffffff',
    },
    textContent: {
      ...extractDefaults('button', 'textContent'),
      textContent: 'button',
    },
  },
  textinput: {
    ...extractDefaults('textinput'),
    border: {
      ...extractDefaults('textinput', 'border'),
      'border-color': '#d9d9d9',
      'border-width': '1px',
      'border-style': 'solid',
      'border-radius': '4px',
    },
  },
  hyperlink: extractDefaults('hyperlink'),
  ocrtext: extractDefaults('ocrtext'),
  image: extractDefaults('image'),
  select: extractDefaults('select'),
  map: {
    ...extractDefaults('map'),
    size: {
      ...extractDefaults('map', 'size'),
      width: 500,
      height: 300,
    },
  },
  calendar: extractDefaults('calendar'),
  clock: extractDefaults('clock'),
  undefined: {
    ...extractDefaults('undefined'),
    size: {
      ...extractDefaults('undefined', 'size'),
      width: '100px',
      height: '100px',
    },
    background: {
      ...extractDefaults('undefined', 'background'),
      'background-color': '#fff333',
    },
  }
};

export const getConfigurablePropsOf = createSelector(
  (entity: Entity) => entity,
  (entity: Entity) => {
    const entityControlsDefaults = ENTITY_TO_DEFAULTS[entity];
    return R.keys(entityControlsDefaults).reduce((acc, c) => {
      const controlAffectsOn = controlAffectsOnStyles(c) ? 'styles' : 'params';
      return ({
        ...acc,
        [controlAffectsOn]: { ...acc[controlAffectsOn], ...entityControlsDefaults[c] },
      })
    }, { styles: {}, params: {} });
  },
);

export const greaterBuoyancyFirst = <T extends { buoyancy: number }>(a: T, b: T) => b.buoyancy - a.buoyancy;
export const isElement = (id: string) => id.slice(-1) === 'e';
export const isScenario = (x: any): x is IScenarioItem => LIST_SCENARIO_TYPE.indexOf(x.struct_type) !== -1;

export const scenariosItemsToScenarios = (items: IScenarioItem[]): IScenarios => items.reduce(
  (acc, x) => ({ ...acc, [x.id]: x }), {},
);

export const elementsToScenariosElements = (elements: IScenarioElement[]): IScenarioElements => elements.reduce(
  (acc, x) => ({ ...acc, [x.id]: x }), {},
);
