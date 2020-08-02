import { ElementsToAdd, ChildrenElements } from './libraryElements/libraryElements';

export const ENTITIES: { [K in Exclude<ElementEntity, 'ocrtext' | 'root' | 'container'>]: K } = {
  button: 'button',
  textinput: 'textinput',
  textarea: 'textarea',
  checkbox: 'checkbox',
  radiobutton: 'radiobutton',
  label: 'label',
  hyperlink: 'hyperlink',
  heading: 'heading',
  paragraph: 'paragraph',
  text_block: 'text_block',
  list: 'list',
  image: 'image',
  select: 'select',
  map: 'map',
  calendar: 'calendar',
  clock: 'clock',
  dropdown: 'dropdown',
  video: 'video',
  undefined: 'undefined',
  divBlock: 'divBlock',
};

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
  'videoSettings',
] as const;

const CONTROLS_AFFECT_ON_STYLES = ['display', 'indents', 'size', 'typography', 'border', 'background', 'bullets'] as const;

export type ElementEntity = keyof ElementsToAdd;
export type ChildEntity = keyof ChildrenElements;

export type Entity = ElementEntity | ChildEntity;

export type SubEntity = 'root';

export type AvailableControls = {
  [P in Entity]: {
    [T in SubEntity]: readonly Control[]
  }
};

export const rootStyleControls = ['background'] as const;
export const containerStyleControls = ['indents', 'size', 'display', 'typography', 'border', 'background'] as const;
export const divBlockStyleControls = ['indents', 'size', 'display', 'typography', 'border', 'background'] as const;

export const buttonStyleControls = ['indents', 'size', 'display', 'typography', 'border', 'background'] as const;
export const buttonParamsControls = ['textContent', 'action', 'showRipple'] as const;

export const textinputStyleControls = ['indents', 'size', 'typography', 'border', 'background'] as const;
export const textareaStyleControls = ['indents', 'size', 'typography', 'border', 'background'] as const;
export const checkboxStyleControls = ['indents', 'size', 'background'] as const;
export const radiobuttonStyleControls = ['indents', 'size', 'background'] as const;
export const labelStyleControls = ['indents', 'display', 'size', 'typography', 'border', 'background'] as const;
export const hyperlinkStyleControls = ['indents', 'size', 'display', 'typography', 'border', 'background'] as const;
export const headingStyleControls = ['indents', 'size', 'typography', 'border', 'background'] as const;
export const paragraphStyleControls = ['indents', 'size', 'typography', 'border', 'background'] as const;
export const ocrtextStyleControls = ['indents', 'size', 'typography', 'border', 'background'] as const;
export const textBlockStyleControls = ['indents', 'size', 'typography', 'border', 'background'] as const;
export const listStyleControls = ['indents', 'size', 'display', 'border', 'background', 'bullets'] as const;
export const listItemStyleControls = ['indents', 'size', 'typography', 'border', 'background'] as const;
export const imageStyleControls = ['indents', 'size', 'border', 'background'] as const;
export const selectStyleControls = ['indents', 'size', 'typography', 'border', 'background'] as const;
export const selectMenuStyleControls = ['indents', 'size', 'border', 'background'] as const;
export const selectItemStyleControls = ['indents', 'size', 'typography', 'border', 'background'] as const;
export const mapStyleControls = ['indents', 'size', 'typography', 'border', 'background'] as const;
export const calendarStyleControls = ['indents', 'size', 'typography', 'border', 'background'] as const;
export const clockStyleControls = ['indents', 'size', 'typography', 'border', 'background'] as const;
export const dropdownStyleControls = ['indents', 'size', 'typography', 'border', 'background'] as const;
export const dropdownMenuStyleControls = ['indents', 'size', 'border', 'background'] as const;
export const dropdownItemStyleControls = ['indents', 'size', 'typography', 'border', 'background'] as const;
export const videoStyleControls = ['indents', 'size', 'border'] as const;
export const undefinedControls = ['size', 'background'] as const;

export type Control = typeof CONTROLS_AFFECT_ON_PARAMS[number] | typeof CONTROLS_AFFECT_ON_STYLES[number];

// WARN: every time you add or remove some properties in prod, you must write migration to add/remove properties for existing entities in db
export const AVAILABLE_CONTROLS: AvailableControls = {
  root: {
    root: rootStyleControls,
  },
  container: {
    root: containerStyleControls,
  },
  divBlock: {
    root: divBlockStyleControls,
  },
  button: {
    root: [...buttonStyleControls, ...buttonParamsControls],
  },
  textinput: {
    root: [...textinputStyleControls, 'type', 'textContent', 'placeholder'],
  },
  textarea: {
    root: [...textareaStyleControls, 'textContent', 'placeholder'],
  },
  checkbox: {
    root: [...checkboxStyleControls, 'value', 'name', 'showRipple'],
  },
  radiobutton: {
    root: [...radiobuttonStyleControls, 'value', 'name', 'showRipple'],
  },
  label: {
    root: [...labelStyleControls, 'textContent', 'labelFor'],
  },
  hyperlink: {
    root: [...hyperlinkStyleControls, 'textContent', 'action'],
  },
  heading: {
    root: [...headingStyleControls, 'textContent', 'headingType'],
  },
  paragraph: {
    root: [...paragraphStyleControls, 'textContent'],
  },
  ocrtext: {
    root: [...paragraphStyleControls, 'textContent'],
  },
  text_block: {
    root: [...textBlockStyleControls, 'textContent'],
  },
  list: {
    root: [...listStyleControls, 'listItems', 'isOrdered'],
  },
  listItem: {
    root: listItemStyleControls,
  },
  image: {
    root: [...imageStyleControls, 'image'],
  },
  select: {
    root: [...selectStyleControls, 'showRipple', 'selectValue', 'selectOptions', 'isOpen'],
  },
  selectMenu: {
    root: selectMenuStyleControls,
  },
  selectItem: {
    root: selectItemStyleControls,
  },
  map: {
    root: [...mapStyleControls, 'mapProps'],
  },
  calendar: {
    root: calendarStyleControls,
  },
  clock: {
    root: clockStyleControls,
  },
  dropdown: {
    root: [...dropdownStyleControls, 'textContent', 'showRipple', 'dropdownItems', 'isOpen'],
  },
  dropdownMenu: {
    root: dropdownMenuStyleControls,
  },
  dropdownItem: {
    root: dropdownItemStyleControls,
  },
  video: {
    root: [...videoStyleControls, 'videoSettings'],
  },
  undefined: {
    root: undefinedControls,
  },
} as const;

export type AvailableChildren = {
  [P in Entity]: {
    [key: string]: {
      min: number,
      max: number,
    }
  }
};

export const AVAILABLE_CHILDREN: AvailableChildren = {
  root: {
    all: {
      min: 0,
      max: Infinity,
    },
  },
  container: {
    all: {
      min: 0,
      max: Infinity,
    },
  },
  divBlock: {
    all: {
      min: 0,
      max: Infinity,
    },
  },
  button: {},
  textinput: {},
  textarea: {},
  checkbox: {},
  radiobutton: {},
  label: {},
  hyperlink: {},
  heading: {},
  paragraph: {},
  ocrtext: {},
  text_block: {},
  list: {
    listItem: {
      min: 1,
      max: Infinity,
    },
  },
  listItem: {},
  image: {},
  select: {
    selectMenu: {
      min: 1,
      max: 1,
    },
  },
  selectMenu: {
    selectItem: {
      min: 1,
      max: Infinity,
    },
  },
  selectItem: {},
  map: {},
  calendar: {},
  clock: {},
  dropdown: {
    dropdownMenu: {
      min: 1,
      max: 1,
    },
  },
  dropdownMenu: {
    dropdownItem: {
      min: 1,
      max: Infinity,
    },
  },
  dropdownItem: {},
  video: {},
  undefined: {},
};
