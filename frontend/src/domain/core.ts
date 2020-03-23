import * as R from 'ramda';
import { createSelector } from 'reselect';
import {
  DEFAULT_INDENTS, DEFAULT_BORDER, DEFAULT_BACKGROUND, DEFAULT_TYPOGRAPHY, DEFAULT_SIZE, DEFAULT_ACTION, DEFAULT_PLACEHOLDER, DEFAULT_TEXT_CONTENT, DEFAULT_MAP_PROPS, DEFAULT_DISPLAY, DEFAULT_IMAGE_PROPS,
} from '$constants/defaultParams';

export const ENTITIES = [
  'root', 'container', 'button', 'textinput', 'hyperlink', 'ocrtext', 'image', 'select', 'map', 'calendar', 'clock', 'undefined'
] as const;
const CONTROLS_AFFECT_ON_PARAMS = ['action', 'mapProps', 'placeholder', 'textContent', 'image'] as const;
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
  button: ['indents', 'size', 'display', 'typography', 'border', 'background', 'textContent', 'action'],
  textinput: ['indents', 'size', 'typography', 'border', 'background', 'textContent', 'placeholder'],
  hyperlink: ['indents', 'size', 'display', 'typography', 'border', 'background', 'textContent', 'action'],
  ocrtext: ['indents', 'size', 'typography', 'border', 'background', 'textContent'],
  image: ['indents', 'size', 'border', 'background', 'image'],
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
  image: DEFAULT_IMAGE_PROPS,
};

type EntityToDefaults = {
  [P in Entity]: Record<Control, any>;
};

const extractDefaults = (entity: Entity, control?: Control) => control
  ? R.pick(AVAILABLE_CONTROLS[entity], CONTROLS_DEFAULTS)[control]
  : R.pick(AVAILABLE_CONTROLS[entity], CONTROLS_DEFAULTS);

const ENTITY_TO_DEFAULTS: EntityToDefaults = {
  root: {
    ...extractDefaults('root'),
    background: {
      ...extractDefaults('root', 'background'),
      'background-color': '#ffffff',
    },
  },
  container: {
    ...extractDefaults('container'),
    size: {
      ...extractDefaults('container', 'size'),
      width: '100%',
    },
  },
  button: {
    ...extractDefaults('button'),
    display: {
      ...extractDefaults('button', 'display'),
      display: 'inline-block',
    },
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
    textContent: {
      ...extractDefaults('textinput', 'textContent'),
      textContent: '',
    },
  },
  hyperlink: {
    ...extractDefaults('hyperlink'),
    display: {
      ...extractDefaults('hyperlink', 'display'),
      display: 'inline',
    },
    indents: {
      ...extractDefaults('hyperlink', 'indents'),
      'padding-top': '0',
      'padding-right': '0',
      'padding-bottom': '0',
      'padding-left': '0',
    },
    textContent: {
      ...extractDefaults('hyperlink', 'textContent'),
      textContent: 'hyperlink',
    },
  },
  ocrtext: extractDefaults('ocrtext'),
  image: {
    ...extractDefaults('image'),
    size: {
      width: 'auto',
      height: 'auto',
    },
    indents: {
      ...extractDefaults('image', 'indents'),
      'padding-top': '0',
      'padding-right': '0',
      'padding-bottom': '0',
      'padding-left': '0',
    },
  },
  select: extractDefaults('select'),
  map: {
    ...extractDefaults('map'),
    size: {
      ...extractDefaults('map', 'size'),
      width: '500px',
      height: '300px',
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
