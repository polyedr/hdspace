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
  DEFAULT_HEADING_TYPE,
  DEFAULT_LIST_ITEMS,
  DEFAULT_BULLETS,
  DEFAULT_LIST_TYPE,
  DEFAULT_LABEL_FOR,
  DEFAULT_DROPDOWN_ITEMS,
  DEFAULT_SELECT_OPEN,
} from '$constants/defaultParams';

export const ENTITIES = [
  'root',
  'container',
  'button',
  'textinput',
  'textarea',
  'checkbox',
  'radiobutton',
  'label',
  'hyperlink',
  'heading',
  'paragraph',
  'text_block',
  'list',
  'image',
  'select',
  'map',
  'calendar',
  'clock',
  'dropdown',
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
  'headingType',
  'listItems',
  'isOrdered',
  'labelFor',
  'dropdownItems',
  'isOpen',
] as const;

const CONTROLS_AFFECT_ON_STYLES = ['display', 'indents', 'size', 'typography', 'border', 'background', 'bullets'] as const;

const controlAffectsOnStyles = (controlName: Control) => (
  CONTROLS_AFFECT_ON_STYLES.find(x => x === controlName) !== undefined
);

export type ContainerEntity = 'root' | 'container';

export type ElementEntity =
| 'undefined'
| 'image'
| 'button'
| 'textinput'
| 'textarea'
| 'hyperlink'
| 'select'
| 'map'
| 'calendar'
| 'clock'
| 'checkbox'
| 'radiobutton'
| 'heading'
| 'paragraph'
| 'ocrtext'
| 'text_block'
| 'list'
| 'label'
| 'dropdown';

export type ChildEntity = 'selectMenu' | 'selectItem' | 'dropdownMenu' | 'dropdownItem' | 'listItem';

export type Entity = ContainerEntity | ElementEntity | ChildEntity;

export type SubEntity = 'root';

export type AvailableControls = {
  [P in Entity]: {
    [T in SubEntity]: Control[]
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
  textarea: {
    root: ['indents', 'size', 'typography', 'border', 'background', 'textContent', 'placeholder'],
  },
  checkbox: {
    root: ['indents', 'size', 'background', 'value', 'name', 'showRipple'],
  },
  radiobutton: {
    root: ['indents', 'size', 'background', 'value', 'name', 'showRipple'],
  },
  label: {
    root: ['indents', 'display', 'size', 'typography', 'border', 'background', 'textContent', 'labelFor'],
  },
  hyperlink: {
    root: ['indents', 'size', 'display', 'typography', 'border', 'background', 'textContent', 'action'],
  },
  heading: {
    root: ['indents', 'size', 'typography', 'border', 'background', 'textContent', 'headingType'],
  },
  paragraph: {
    root: ['indents', 'size', 'typography', 'border', 'background', 'textContent'],
  },
  ocrtext: {
    root: ['indents', 'size', 'typography', 'border', 'background', 'textContent'],
  },
  text_block: {
    root: ['indents', 'size', 'typography', 'border', 'background', 'textContent'],
  },
  list: {
    root: ['indents', 'size', 'display', 'border', 'background', 'listItems', 'bullets', 'isOrdered'],
  },
  listItem: {
    root: ['indents', 'size', 'typography', 'border', 'background'],
  },
  image: {
    root: ['indents', 'size', 'border', 'background', 'image'],
  },
  select: {
    root: ['indents', 'size', 'typography', 'border', 'background', 'showRipple', 'selectValue', 'selectOptions', 'isOpen'],
  },
  selectMenu: {
    root: ['indents', 'size', 'border', 'background'],
  },
  selectItem: {
    root: ['indents', 'size', 'typography', 'border', 'background']
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
  dropdown: {
    root: ['indents', 'size', 'typography', 'border', 'background', 'textContent', 'showRipple', 'dropdownItems', 'isOpen'],
  },
  dropdownMenu: {
    root: ['indents', 'size', 'border', 'background'],
  },
  dropdownItem: {
    root: ['indents', 'size', 'typography', 'border', 'background']
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
  headingType: DEFAULT_HEADING_TYPE,
  listItems: DEFAULT_LIST_ITEMS,
  bullets: DEFAULT_BULLETS,
  isOrdered: DEFAULT_LIST_TYPE,
  labelFor: DEFAULT_LABEL_FOR,
  dropdownItems: DEFAULT_DROPDOWN_ITEMS,
  isOpen: DEFAULT_SELECT_OPEN,
};

type EntityToDefaults = {
  [P in Entity]: {
    [T in SubEntity]: Record<Control, any>;
  };
};

const extractDefaults = <EntityName extends Entity>(entity: EntityName, subEntity: SubEntity, control?: Control) =>
  control
  ? R.pick(AVAILABLE_CONTROLS[entity][subEntity], CONTROLS_DEFAULTS)[control]
  : R.pick(AVAILABLE_CONTROLS[entity][subEntity], CONTROLS_DEFAULTS);

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
    typography: {
      ...extractDefaults('hyperlink', 'root', 'typography'),
      color: '#1890ff',
    },
    textContent: {
      ...extractDefaults('hyperlink', 'root', 'textContent'),
      textContent: 'hyperlink',
    },
  },
};

const textareaDefaults = {
  root: {
    ...extractDefaults('textarea', 'root'),
    indents: {
      ...extractDefaults('textarea', 'root', 'indents'),
      'padding-top': '18.5px',
      'padding-right': '14px',
      'padding-bottom': '18.5px',
      'padding-left': '14px',
    },
    border: {
      ...extractDefaults('textarea', 'root', 'border'),
      'border-color': '#d9d9d9',
      'border-width': '1px',
      'border-style': 'solid',
      'border-radius': '4px',
    },
    textContent: {
      ...extractDefaults('textarea', 'root', 'textContent'),
      textContent: '',
    },
  },
};

const labelDefaults = {
  root: {
    ...extractDefaults('label', 'root'),
    display: {
      ...extractDefaults('label', 'root', 'display'),
      display: 'inline',
    },
    indents: {
      ...extractDefaults('label', 'root', 'indents'),
      'padding-top': '0',
      'padding-right': '0',
      'padding-bottom': '0',
      'padding-left': '0',
    },
    textContent: {
      ...extractDefaults('label', 'root', 'textContent'),
      textContent: 'This is label',
    },
  },
};

const headingDefaults = {
  root: {
    ...extractDefaults('heading', 'root'),
    indents: {
      ...extractDefaults('heading', 'root', 'indents'),
      'padding-top': '0',
      'padding-right': '0',
      'padding-bottom': '0',
      'padding-left': '0',
    },
    typography: {
      ...extractDefaults('heading', 'root', 'typography'),
      'font-size': '43px',
      'line-height': '1.167',
    },
    textContent: {
      ...extractDefaults('heading', 'root', 'textContent'),
      textContent: 'Heading',
    },
  },
};

const paragraphDefaults = {
  root: {
    ...extractDefaults('paragraph', 'root'),
    indents: {
      ...extractDefaults('paragraph', 'root', 'indents'),
      'padding-top': '0',
      'padding-right': '0',
      'padding-bottom': '0',
      'padding-left': '0',
    },
    textContent: {
      ...extractDefaults('paragraph', 'root', 'textContent'),
      textContent: 'This is paragraph',
    },
  },
};

const ocrtextDefaults = {
  root: {
    ...extractDefaults('ocrtext', 'root'),
    indents: {
      ...extractDefaults('ocrtext', 'root', 'indents'),
      'padding-top': '0',
      'padding-right': '0',
      'padding-bottom': '0',
      'padding-left': '0',
    },
    textContent: {
      ...extractDefaults('ocrtext', 'root', 'textContent'),
      textContent: 'This is paragraph',
    },
  },
};

const textBlockDefaults = {
  root: {
    ...extractDefaults('text_block', 'root'),
    indents: {
      ...extractDefaults('text_block', 'root', 'indents'),
      'padding-top': '0',
      'padding-right': '0',
      'padding-bottom': '0',
      'padding-left': '0',
    },
    textContent: {
      ...extractDefaults('text_block', 'root', 'textContent'),
      textContent: 'This is text block',
    },
  },
};

const listDefaults = {
  root: {
    ...extractDefaults('list', 'root'),
    indents: {
      ...extractDefaults('list', 'root', 'indents'),
      'padding-top': '0',
      'padding-right': '0',
      'padding-bottom': '0',
      'padding-left': '40px',
    },
  },
};

const listItemDefaults = {
  root: {
    ...extractDefaults('listItem', 'root'),
    indents: {
      ...extractDefaults('listItem', 'root', 'indents'),
      'padding-top': '0',
      'padding-right': '0',
      'padding-bottom': '0',
      'padding-left': '0',
    },
  },
};

const dropdownDefaults = {
  root: {
    ...extractDefaults('dropdown', 'root'),
    indents: {
      ...extractDefaults('dropdown', 'root', 'indents'),
      'padding-top': '6px',
      'padding-right': '16px',
      'padding-bottom': '6px',
      'padding-left': '16px',
    },
    display: {
      ...extractDefaults('dropdown', 'root', 'display'),
      display: 'inline-block',
    },
    border: {
      ...extractDefaults('dropdown', 'root', 'border'),
      'border-color': '#1890ff',
      'border-radius': '4px',
    },
    background: {
      ...extractDefaults('dropdown', 'root', 'background'),
      'background-color': '#1890ff',
    },
    typography: {
      ...extractDefaults('dropdown', 'root', 'typography'),
      color: '#ffffff',
      'line-height': '1.75',
    },
    textContent: {
      ...extractDefaults('dropdown', 'root', 'textContent'),
      textContent: 'dropdown',
    },
  },
};

const dropdownMenuDefaults = {
  root: {
    ...extractDefaults('dropdownMenu', 'root'),
    background: {
      ...extractDefaults('dropdownMenu', 'root', 'background'),
      'background-color': '#ffffff',
    },
    indents: {
      ...extractDefaults('dropdownMenu', 'root', 'indents'),
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
      ...extractDefaults('dropdownMenu', 'root', 'border'),
      'border-color': '#d9d9d9',
      'border-width': '1px',
      'border-style': 'solid',
      'border-radius': '4px',
    },
  },
};

const dropdownItemDefaults = {
  root: {
    ...extractDefaults('dropdownItem', 'root'),
    background: {
      ...extractDefaults('dropdownItem', 'root', 'background'),
      'background-color': '#ffffff',
    },
    indents: {
      ...extractDefaults('dropdownItem', 'root', 'indents'),
      'padding-top': '6px',
      'padding-right': '16px',
      'padding-bottom': '6px',
      'padding-left': '16px',
    },
    border: {
      ...extractDefaults('dropdownItem', 'root', 'border'),
      'border-width': '0px',
    },
    typography: {
      ...extractDefaults('dropdownItem', 'root', 'typography'),
      'line-height': '1.5',
    },
  },
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
};

const selectMenuDefaults = {
  root: {
    ...extractDefaults('selectMenu', 'root'),
    background: {
      ...extractDefaults('selectMenu', 'root', 'background'),
      'background-color': '#ffffff',
    },
    indents: {
      ...extractDefaults('selectMenu', 'root', 'indents'),
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
      ...extractDefaults('selectMenu', 'root', 'border'),
      'border-color': '#d9d9d9',
      'border-width': '1px',
      'border-style': 'solid',
      'border-radius': '4px',
    },
  },
};

const selectItemDefaults = {
  root: {
    ...extractDefaults('selectItem', 'root'),
    background: {
      ...extractDefaults('selectItem', 'root', 'background'),
      'background-color': '#ffffff',
    },
    indents: {
      ...extractDefaults('selectItem', 'root', 'indents'),
      'padding-top': '6px',
      'padding-right': '16px',
      'padding-bottom': '6px',
      'padding-left': '16px',
    },
    border: {
      ...extractDefaults('selectItem', 'root', 'border'),
      'border-width': '0px',
    },
    typography: {
      ...extractDefaults('selectItem', 'root', 'typography'),
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
  textarea: textareaDefaults,
  label: labelDefaults,
  heading: headingDefaults,
  paragraph: paragraphDefaults,
  ocrtext: ocrtextDefaults,
  text_block: textBlockDefaults,
  list: listDefaults,
  listItem: listItemDefaults,
  image: imageDefaults,
  select: selectDefaults,
  selectMenu: selectMenuDefaults,
  selectItem: selectItemDefaults,
  map: mapDefaults,
  calendar: calendarDefaults,
  clock: clockDefaults,
  dropdown: dropdownDefaults,
  dropdownMenu: dropdownMenuDefaults,
  dropdownItem: dropdownItemDefaults,
  undefined: undefinedDefaults,
};

export const getConfigurablePropsOf = <EntityName extends Entity>(subEntity: SubEntity) => createSelector(
  (entity: EntityName) => entity,
  (entity: EntityName) => {
    const entityControlsDefaults = ENTITY_TO_DEFAULTS[entity][subEntity];
    return R.keys(entityControlsDefaults).reduce((acc, c) => {
      const controlAffectsOn = controlAffectsOnStyles(c) ? 'styles' : 'params';
      return ({
        ...acc,
        [controlAffectsOn]: { ...acc[controlAffectsOn], ...entityControlsDefaults[c] },
      })
    }, { styles: {}, params: {} });
  },
);
