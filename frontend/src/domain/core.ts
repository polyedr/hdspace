import {
  ElementsToAdd,
  ChildrenElements,
} from './libraryElements/libraryElements';

export const ENTITIES: {
  [K in Exclude<ElementEntity, 'ocrtext' | 'root' | 'container'>]: K;
} = {
  button: 'button',
  textinput: 'textinput',
  textarea: 'textarea',
  checkbox: 'checkbox',
  radiobutton: 'radiobutton',
  label: 'label',
  hyperlink: 'hyperlink',
  heading: 'heading',
  paragraph: 'paragraph',
  textBlock: 'textBlock',
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
  pageTemplate: 'pageTemplate',
  emptyPageTemplate: 'emptyPageTemplate',
  grid: 'grid',
  columns: 'columns',
  smartContainer: 'smartContainer',
  subscribeForm: 'subscribeForm',
  cardsSection: 'cardsSection',
  featureSection: 'featureSection',
  section: 'section',
};

const CONTROLS_AFFECT_ON_PARAMS = [
  'action',
  'mapProps',
  'placeholder',
  'textContent',
  'image',
  'smartContainer',
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

const CONTROLS_AFFECT_ON_STYLES = [
  'display',
  'indents',
  'size',
  'typography',
  'border',
  'background',
  'bullets',
  'flexGrow',
  'backgroundSize',
] as const;

export type ElementEntity = keyof ElementsToAdd;
export type ChildEntity = keyof ChildrenElements;

export type Entity = ElementEntity | ChildEntity;

export type AvailableControls = {
  [P in Entity]: readonly Control[];
};

export const rootStyleControls = ['background'] as const;
export const containerStyleControls = [
  'indents',
  'size',
  'display',
  'typography',
  'border',
  'background',
  'flexGrow',
] as const;
export const divBlockStyleControls = [
  'indents',
  'size',
  'display',
  'typography',
  'border',
  'background',
] as const;

export const buttonStyleControls = [
  'indents',
  'size',
  'display',
  'typography',
  'border',
  'background',
] as const;
export const buttonParamsControls = [
  'textContent',
  'action',
  'showRipple',
] as const;

export const textinputStyleControls = [
  'indents',
  'size',
  'typography',
  'border',
  'background',
] as const;
export const textareaStyleControls = [
  'indents',
  'size',
  'typography',
  'border',
  'background',
] as const;
export const checkboxStyleControls = ['indents', 'size', 'background'] as const;
export const radiobuttonStyleControls = [
  'indents',
  'size',
  'background',
] as const;
export const labelStyleControls = [
  'indents',
  'display',
  'size',
  'typography',
  'border',
  'background',
] as const;
export const hyperlinkStyleControls = [
  'indents',
  'size',
  'display',
  'typography',
  'border',
  'background',
] as const;
export const headingStyleControls = [
  'indents',
  'size',
  'typography',
  'border',
  'background',
] as const;
export const paragraphStyleControls = [
  'indents',
  'size',
  'typography',
  'border',
  'background',
] as const;
export const ocrtextStyleControls = [
  'indents',
  'size',
  'typography',
  'border',
  'background',
] as const;
export const textBlockStyleControls = [
  'indents',
  'size',
  'typography',
  'border',
  'background',
] as const;
export const listStyleControls = [
  'indents',
  'size',
  'display',
  'border',
  'background',
  'bullets',
] as const;
export const listItemStyleControls = [
  'indents',
  'size',
  'typography',
  'border',
  'background',
] as const;
export const imageStyleControls = [
  'indents',
  'size',
  'border',
  'background',
] as const;
export const smartContainerStyleControls = [
  'indents',
  'size',
  'display',
  'typography',
  'border',
  'background',
] as const;
export const selectStyleControls = [
  'indents',
  'size',
  'typography',
  'border',
  'background',
] as const;
export const selectMenuStyleControls = [
  'indents',
  'size',
  'border',
  'background',
] as const;
export const selectItemStyleControls = [
  'indents',
  'size',
  'typography',
  'border',
  'background',
] as const;
export const mapStyleControls = [
  'indents',
  'size',
  'typography',
  'border',
  'background',
] as const;
export const calendarStyleControls = [
  'indents',
  'size',
  'typography',
  'border',
  'background',
] as const;
export const clockStyleControls = [
  'indents',
  'size',
  'typography',
  'border',
  'background',
] as const;
export const dropdownStyleControls = [
  'indents',
  'size',
  'typography',
  'border',
  'background',
] as const;
export const dropdownMenuStyleControls = [
  'indents',
  'size',
  'border',
  'background',
] as const;
export const dropdownItemStyleControls = [
  'indents',
  'size',
  'typography',
  'border',
  'background',
] as const;
export const videoStyleControls = ['indents', 'size', 'border'] as const;
export const pageTemplateStyleControls = [
  'indents',
  'size',
  'display',
  'typography',
  'border',
  'background',
] as const;
export const emptyPageTemplateStyleControls = [
  'indents',
  'size',
  'display',
  'typography',
  'border',
  'background',
] as const;
export const gridStyleControls = [
  'indents',
  'size',
  'display',
  'typography',
  'border',
  'background',
] as const;
export const columnsStyleControls = [
  'indents',
  'size',
  'display',
  'typography',
  'border',
  'background',
] as const;
export const subscribeFormStyleControls = [
  'indents',
  'size',
  'display',
  'typography',
  'border',
  'background',
] as const;
export const undefinedControls = ['size', 'background'] as const;
export const cardsSectionStyleControls = [
  'indents',
  'size',
  'display',
  'typography',
  'border',
  'background',
] as const;
export const featureSectionStyleControls = [
  'indents',
  'size',
  'display',
  'typography',
  'border',
  'background',
] as const;

export type Control =
  | typeof CONTROLS_AFFECT_ON_PARAMS[number]
  | typeof CONTROLS_AFFECT_ON_STYLES[number];

// WARN: every time you add or remove some properties in prod, you must write migration to add/remove properties for existing entities in db
export const AVAILABLE_CONTROLS: AvailableControls = {
  root: rootStyleControls,
  container: containerStyleControls,
  divBlock: divBlockStyleControls,
  button: [...buttonStyleControls, ...buttonParamsControls],
  textinput: [...textinputStyleControls, 'type', 'textContent', 'placeholder'],
  textarea: [...textareaStyleControls, 'textContent', 'placeholder'],
  checkbox: [...checkboxStyleControls, 'value', 'name', 'showRipple'],
  radiobutton: [...radiobuttonStyleControls, 'value', 'name', 'showRipple'],
  label: [...labelStyleControls, 'textContent', 'labelFor'],
  hyperlink: [...hyperlinkStyleControls, 'textContent', 'action'],
  heading: [...headingStyleControls, 'textContent', 'headingType'],
  paragraph: [...paragraphStyleControls, 'textContent'],
  ocrtext: [...paragraphStyleControls, 'textContent'],
  textBlock: [...textBlockStyleControls, 'textContent'],
  list: [...listStyleControls, 'listItems', 'isOrdered'],
  listItem: listItemStyleControls,
  image: [...imageStyleControls, 'image'],
  select: [
    ...selectStyleControls,
    'showRipple',
    'selectValue',
    'selectOptions',
    'isOpen',
  ],
  selectMenu: selectMenuStyleControls,
  selectItem: selectItemStyleControls,
  map: [...mapStyleControls, 'mapProps'],
  calendar: calendarStyleControls,
  clock: clockStyleControls,
  dropdown: [
    ...dropdownStyleControls,
    'textContent',
    'showRipple',
    'dropdownItems',
    'isOpen',
  ],
  dropdownMenu: dropdownMenuStyleControls,
  dropdownItem: dropdownItemStyleControls,
  video: [...videoStyleControls, 'videoSettings'],
  pageTemplate: pageTemplateStyleControls,
  emptyPageTemplate: emptyPageTemplateStyleControls,
  grid: gridStyleControls,
  columns: columnsStyleControls,
  subscribeForm: subscribeFormStyleControls,
  smartContainer: [...smartContainerStyleControls, 'smartContainer'],
  undefined: undefinedControls,
  cardsSection: cardsSectionStyleControls,
  featureSection: featureSectionStyleControls,
  section: containerStyleControls,
} as const;

export type AvailableChildren = {
  [P in Entity | string]: {
    [key: string]: {
      min: number;
      max: number;
    };
  };
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
  textBlock: {},
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
  pageTemplate: {
    all: {
      min: 0,
      max: Infinity,
    },
  },
  emptyPageTemplate: {
    all: {
      min: 0,
      max: Infinity,
    },
  },
  grid: {
    all: {
      min: 0,
      max: Infinity,
    },
  },
  columns: {
    all: {
      min: 0,
      max: Infinity,
    },
  },
  subscribeForm: {
    all: {
      min: 0,
      max: Infinity,
    },
  },
  smartContainer: {
    all: {
      min: 0,
      max: Infinity,
    },
  },
  undefined: {},
  cardsSection: {
    all: {
      min: 0,
      max: Infinity,
    },
  },
  featureSection: {
    all: {
      min: 0,
      max: Infinity,
    },
  },
  section: {
    all: {
      min: 0,
      max: Infinity,
    },
  },
  custom: {
    all: {
      min: 0,
      max: Infinity,
    },
  },
};

export const defaultFreeCanvasParams = {
  left: 0,
  top: 0,
  width: 300,
  height: 100,
  zIndex: 0,
};
