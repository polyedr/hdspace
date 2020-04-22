import * as R from 'ramda';
import { createSelector } from 'reselect';
import {
  DEFAULT_INDENTS,
  DEFAULT_BORDER,
  DEFAULT_BACKGROUND,
  DEFAULT_TYPOGRAPHY,
  DEFAULT_SIZE,
  DEFAULT_ACTION,
  DEFAULT_PLACEHOLDER,
  DEFAULT_TEXT_CONTENT,
  DEFAULT_MAP_PROPS,
  DEFAULT_DISPLAY,
  DEFAULT_IMAGE_PROPS,
  DEFAULT_VALUE,
  DEFAULT_NAME,
  DEFAULT_RIPPLE,
  DEFAULT_INPUT_TYPE,
  DEFAULT_SELECT_OPTIONS,
  DEFAULT_SELECT_VALUE,
} from '$constants/defaultParams';
import { ServerStructType } from '$redux/project/types';

import { LibraryElements } from './libraryElements';

export const ENTITIES = [
  'root',
  'container',
  'button',
  'textinput',
  'checkbox',
  'radiobutton',
  'hyperlink',
  'ocrtext',
  'image',
  'select',
  'map',
  'calendar',
  'clock',
  'undefined',
] as const;

const CONTROLS_AFFECT_ON_PARAMS = [
  'action',
  'mapProps',
  'placeholder',
  'textContent',
  'image',
  'value',
  'name',
  'showRipple',
  'type',
  'selectOptions',
  'selectValue',
] as const;

const CONTROLS_AFFECT_ON_STYLES = ['display', 'indents', 'size', 'typography', 'border', 'background'] as const;

const controlAffectsOnStyles = (controlName: Control) => (
  CONTROLS_AFFECT_ON_STYLES.find(x => x === controlName) !== undefined
);

export type Entity = Exclude<ServerStructType, 'menu' | 'menuItem'>;
export type ElementEntity = Exclude<Entity, 'root' | 'container'>;
export type ChildEntity<EntityName extends Entity> = 'root' | LibraryElements[EntityName]['children'][number]['struct_type'];
export type EntityControls<EntityName extends Entity> = { [P in ChildEntity<EntityName>]: Control[] };

export type AvailableControls = {
  [P in Entity]: {
    [T in ChildEntity<P>]: Control[]
  }
};

export type Control = typeof CONTROLS_AFFECT_ON_PARAMS[number] | typeof CONTROLS_AFFECT_ON_STYLES[number];

// WARN: every time you add or remove some properties in prod, you must write migration to add/remove properties for existing entities in db
export const AVAILABLE_CONTROLS: AvailableControls = {
  root: {
    root: ['background'],
  },
  container: {
    root: ['indents', 'size', 'display', 'typography', 'border', 'background'],
  },
  button: {
    root: ['indents', 'size', 'display', 'typography', 'border', 'background', 'textContent', 'action', 'showRipple'],
  },
  textinput: {
    root: ['indents', 'size', 'typography', 'border', 'background', 'type', 'textContent', 'placeholder'],
  },
  checkbox: {
    root: ['indents', 'size', 'background', 'value', 'name', 'showRipple'],
  },
  radiobutton: {
    root: ['indents', 'size', 'background', 'value', 'name', 'showRipple'],
  },
  hyperlink: {
    root: ['indents', 'size', 'display', 'typography', 'border', 'background', 'textContent', 'action'],
  },
  ocrtext: {
    root: ['indents', 'size', 'typography', 'border', 'background', 'textContent'],
  },
  image: {
    root: ['indents', 'size', 'border', 'background', 'image'],
  },
  select: {
    root: ['indents', 'size', 'typography', 'border', 'background', 'showRipple', 'selectValue', 'selectOptions'],
    menu: ['indents', 'size', 'border', 'background'],
    menuItem: ['indents', 'size', 'typography', 'border', 'background'],
  },
  map: {
    root: ['indents', 'size', 'typography', 'border', 'background', 'mapProps'],
  },
  calendar: {
    root: ['indents', 'size', 'typography', 'border', 'background'],
  },
  clock: {
    root: ['indents', 'size', 'typography', 'border', 'background'],
  },
  undefined: {
    root: ['size', 'background'],
  },
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
  value: DEFAULT_VALUE,
  name: DEFAULT_NAME,
  showRipple: DEFAULT_RIPPLE,
  type: DEFAULT_INPUT_TYPE,
  selectOptions: DEFAULT_SELECT_OPTIONS,
  selectValue: DEFAULT_SELECT_VALUE,
};

type EntityToDefaults = {
  [P in Entity]: {
    [T in ChildEntity<P>]: Record<Control, any>;
  };
};

const extractDefaults = <EntityName extends Entity>(entity: EntityName, child: ChildEntity<EntityName>, control?: Control) =>
  control
  ? R.pick(AVAILABLE_CONTROLS[entity][child as 'root'], CONTROLS_DEFAULTS)[control]
  : R.pick(AVAILABLE_CONTROLS[entity][child as 'root'], CONTROLS_DEFAULTS);

const rootDefaults = {
  root: {
    ...extractDefaults('root', 'root'),
    background: {
      ...extractDefaults('root', 'root', 'background'),
      'background-color': '#ffffff',
    },
  },
};

const containerDefaults = {
  root: {
    ...extractDefaults('container', 'root'),
    size: {
      ...extractDefaults('container', 'root', 'size'),
      width: '100%',
    },
  },
};

const buttonDefaults = {
  root: {
    ...extractDefaults('button', 'root'),
    indents: {
      ...extractDefaults('button','root', 'indents'),
      'padding-top': '6px',
      'padding-right': '16px',
      'padding-bottom': '6px',
      'padding-left': '16px',
    },
    display: {
      ...extractDefaults('button', 'root', 'display'),
      display: 'inline-block',
    },
    border: {
      ...extractDefaults('button', 'root', 'border'),
      'border-color': '#1890ff',
      'border-radius': '4px',
    },
    background: {
      ...extractDefaults('button', 'root', 'background'),
      'background-color': '#1890ff',
    },
    typography: {
      ...extractDefaults('button', 'root', 'typography'),
      color: '#ffffff',
      'line-height': '1.75',
    },
    textContent: {
      ...extractDefaults('button', 'root', 'textContent'),
      textContent: 'button',
    },
  },
};

const textinputDefaults = {
  root: {
    ...extractDefaults('textinput', 'root'),
    indents: {
      ...extractDefaults('textinput', 'root', 'indents'),
      'padding-top': '18.5px',
      'padding-right': '14px',
      'padding-bottom': '18.5px',
      'padding-left': '14px',
    },
    border: {
      ...extractDefaults('textinput', 'root', 'border'),
      'border-color': '#d9d9d9',
      'border-width': '1px',
      'border-style': 'solid',
      'border-radius': '4px',
    },
    textContent: {
      ...extractDefaults('textinput', 'root', 'textContent'),
      textContent: '',
    },
  },
};

const checkboxDefaults = {
  root: {
    ...extractDefaults('checkbox', 'root'),
    background: {
      ...extractDefaults('checkbox', 'root', 'background'),
      'background-color': '#1890ff',
    },
    size: {
      ...extractDefaults('checkbox', 'root', 'size'),
      width: '24px',
      height: 'auto',
    },
    indents: {
      ...extractDefaults('checkbox', 'root', 'indents'),
      'padding-top': '0',
      'padding-right': '0',
      'padding-bottom': '0',
      'padding-left': '0',
    },
    value: {
      value: '',
    },
  },
};

const radiobuttonDefaults = {
  root: {
    ...extractDefaults('radiobutton', 'root'),
    background: {
      ...extractDefaults('radiobutton', 'root', 'background'),
      'background-color': '#1890ff',
    },
    size: {
      ...extractDefaults('radiobutton', 'root', 'size'),
      width: '24px',
      height: 'auto',
    },
    indents: {
      ...extractDefaults('radiobutton', 'root', 'indents'),
      'padding-top': '0',
      'padding-right': '0',
      'padding-bottom': '0',
      'padding-left': '0',
    },
    value: {
      value: '',
    },
  },
};

const hyperlinkDefaults = {
  root: {
    ...extractDefaults('hyperlink', 'root'),
    display: {
      ...extractDefaults('hyperlink', 'root', 'display'),
      display: 'inline',
    },
    indents: {
      ...extractDefaults('hyperlink', 'root', 'indents'),
      'padding-top': '0',
      'padding-right': '0',
      'padding-bottom': '0',
      'padding-left': '0',
    },
    textContent: {
      ...extractDefaults('hyperlink', 'root', 'textContent'),
      textContent: 'hyperlink',
    },
  },
};

const ocrtextDefaults = {
  root: extractDefaults('ocrtext', 'root'),
};

const imageDefaults = {
  root: {
    ...extractDefaults('image', 'root'),
    size: {
      width: 'auto',
      height: 'auto',
    },
    indents: {
      ...extractDefaults('image', 'root', 'indents'),
      'padding-top': '0',
      'padding-right': '0',
      'padding-bottom': '0',
      'padding-left': '0',
    },
  },
};

const selectDefaults = {
  root: {
    ...extractDefaults('select', 'root'),
    indents: {
      ...extractDefaults('select', 'root', 'indents'),
      'padding-top': '18.5px',
      'padding-right': '14px',
      'padding-bottom': '18.5px',
      'padding-left': '14px',
    },
    border: {
      ...extractDefaults('select', 'root', 'border'),
      'border-color': '#d9d9d9',
      'border-width': '1px',
      'border-style': 'solid',
      'border-radius': '4px',
    },
  },
  menu: {
    ...extractDefaults('select', 'menu'),
    background: {
      ...extractDefaults('select', 'menu', 'background'),
      'background-color': '#ffffff',
    },
    indents: {
      ...extractDefaults('select', 'menu', 'indents'),
      'padding-top': '0px',
      'padding-right': '0px',
      'padding-bottom': '0px',
      'padding-left': '0px',
      'margin-top': '0px',
      'margin-right': '0px',
      'margin-bottom': '0px',
      'margin-left': '0px',
    },
    border: {
      ...extractDefaults('select', 'menu', 'border'),
      'border-color': '#d9d9d9',
      'border-width': '1px',
      'border-style': 'solid',
      'border-radius': '4px',
    },
  },
  menuItem: {
    ...extractDefaults('select', 'menuItem'),
    background: {
      ...extractDefaults('select', 'menuItem', 'background'),
      'background-color': '#ffffff',
    },
    indents: {
      ...extractDefaults('select', 'menuItem', 'indents'),
      'padding-top': '6px',
      'padding-right': '16px',
      'padding-bottom': '6px',
      'padding-left': '16px',
    },
    border: {
      ...extractDefaults('select', 'menuItem', 'border'),
      'border-width': '0px',
    },
    typography: {
      ...extractDefaults('select', 'menuItem', 'typography'),
      'line-height': '1.5',
    },
  },
};

const mapDefaults = {
  root: {
    ...extractDefaults('map', 'root'),
    size: {
      ...extractDefaults('map', 'root', 'size'),
      width: '500px',
      height: '300px',
    },
  },
};

const calendarDefaults = {
  root: extractDefaults('calendar', 'root'),
};

const clockDefaults = {
  root: extractDefaults('clock', 'root'),
};

const undefinedDefaults = {
  root: {
    ...extractDefaults('undefined', 'root',),
    size: {
      ...extractDefaults('undefined', 'root', 'size'),
      width: '100px',
      height: '100px',
    },
    background: {
      ...extractDefaults('undefined', 'root', 'background'),
      'background-color': '#fff333',
    },
  },
};

const ENTITY_TO_DEFAULTS: EntityToDefaults = {
  root: rootDefaults,
  container: containerDefaults,
  button: buttonDefaults,
  textinput: textinputDefaults,
  checkbox: checkboxDefaults,
  radiobutton: radiobuttonDefaults,
  hyperlink: hyperlinkDefaults,
  ocrtext: ocrtextDefaults,
  image: imageDefaults,
  select: selectDefaults,
  map: mapDefaults,
  calendar: calendarDefaults,
  clock: clockDefaults,
  undefined: undefinedDefaults,
};

export const getConfigurablePropsOf = <EntityName extends Entity>(child: ChildEntity<EntityName>) => createSelector(
  (entity: EntityName) => entity,
  (entity: EntityName) => {
    const entityControlsDefaults = ENTITY_TO_DEFAULTS[entity][child as 'root'];
    return R.keys(entityControlsDefaults).reduce((acc, c) => {
      const controlAffectsOn = controlAffectsOnStyles(c) ? 'styles' : 'params';
      return ({
        ...acc,
        [controlAffectsOn]: { ...acc[controlAffectsOn], ...entityControlsDefaults[c] },
      })
    }, { styles: {}, params: {} });
  },
);
