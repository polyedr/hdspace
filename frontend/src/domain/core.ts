import {
  AvailableChildren,
  AvailableControls,
  ElementEntity,
  FreeCanvasElementParams,
} from '../types';

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
  column: 'column',
  smartHeader: 'smartHeader',
  smartFooter: 'smartFooter',
  smartForm: 'smartForm',
  smartWebpage: 'smartWebpage',
  subscribeForm: 'subscribeForm',
  cardsSection: 'cardsSection',
  featureSection: 'featureSection',
  section: 'section',
};

export const rootStyleControls = ['background'] as const;

export const containerStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'border',
  'display',
  'flexGrow',
] as const;

export const divBlockStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'border',
  'display',
] as const;

export const buttonStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'border',
  'display',
] as const;

export const buttonParamsControls = ['textContent', 'showRipple'] as const;

export const textinputStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'border',
] as const;

export const textareaStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'border',
] as const;

export const checkboxStyleControls = ['indents', 'size', 'background'] as const;

export const radiobuttonStyleControls = [
  'indents',
  'size',
  'background',
] as const;

export const labelStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'border',
  'display',
] as const;

export const hyperlinkStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'border',
  'display',
] as const;

export const headingStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'border',
] as const;

export const paragraphStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'border',
] as const;

export const ocrtextStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'border',
] as const;

export const textBlockStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'border',
] as const;

export const listStyleControls = [
  'indents',
  'size',
  'background',
  'border',
  'display',
  'bullets',
] as const;

export const listItemStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'border',
] as const;

export const imageStyleControls = [
  'indents',
  'size',
  'background',
  'border',
] as const;

export const smartContainerStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'border',
  'display',
] as const;

export const selectStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'border',
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
  'background',
  'border',
] as const;

export const mapStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'border',
] as const;

export const calendarStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'border',
] as const;

export const clockStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'border',
] as const;

export const dropdownStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'border',
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
  'background',
  'border',
] as const;

export const videoStyleControls = ['indents', 'size', 'border'] as const;

export const pageTemplateStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'border',
  'display',
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
  'typography',
  'background',
  'border',
  'display',
] as const;

export const columnsStyleControls = [
  'columns',
  'indents',
  'size',
  'typography',
  'background',
  'border',
  'display',
] as const;

export const columnStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'border',
  'display',
] as const;

export const subscribeFormStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'border',
  'display',
] as const;

export const undefinedControls = ['size', 'background'] as const;

export const cardsSectionStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'border',
  'display',
] as const;

export const featureSectionStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'border',
  'display',
] as const;

// WARN: every time you add or remove some properties in prod, you must write migration to add/remove properties for existing entities in db
export const AVAILABLE_CONTROLS: AvailableControls = {
  root: rootStyleControls,
  container: containerStyleControls,
  divBlock: divBlockStyleControls,
  button: [...buttonStyleControls, ...buttonParamsControls],
  textinput: ['textContent', 'type', 'placeholder', ...textinputStyleControls],
  textarea: ['textContent', 'placeholder', ...textareaStyleControls],
  checkbox: ['value', 'name', ...checkboxStyleControls, 'showRipple'],
  radiobutton: ['value', 'name', ...radiobuttonStyleControls, 'showRipple'],
  label: ['textContent', 'labelFor', ...labelStyleControls],
  hyperlink: ['textContent', 'action', ...hyperlinkStyleControls],
  heading: ['textContent', 'headingType', ...headingStyleControls],
  paragraph: ['textContent', ...paragraphStyleControls],
  ocrtext: ['textContent', ...paragraphStyleControls],
  textBlock: ['textContent', ...textBlockStyleControls],
  list: ['listItems', 'isOrdered', ...listStyleControls],
  listItem: listItemStyleControls,
  image: ['image', ...imageStyleControls],
  select: ['selectValue', 'selectOptions', ...selectStyleControls, 'isOpen'],
  selectMenu: selectMenuStyleControls,
  selectItem: selectItemStyleControls,
  map: ['mapProps', ...mapStyleControls],
  calendar: calendarStyleControls,
  clock: clockStyleControls,
  dropdown: [
    'textContent',
    'dropdownItems',
    ...dropdownStyleControls,
    'isOpen',
    'showRipple',
  ],
  dropdownMenu: dropdownMenuStyleControls,
  dropdownItem: dropdownItemStyleControls,
  video: [...videoStyleControls, 'videoSettings'],
  pageTemplate: pageTemplateStyleControls,
  emptyPageTemplate: emptyPageTemplateStyleControls,
  grid: gridStyleControls,
  columns: columnsStyleControls,
  column: columnStyleControls,
  subscribeForm: subscribeFormStyleControls,
  smartHeader: [...smartContainerStyleControls, 'stylesOn', 'smartHeader'],
  smartFooter: [...smartContainerStyleControls, 'stylesOn', 'smartFooter'],
  smartForm: [...smartContainerStyleControls, 'stylesOn', 'smartForm'],
  smartWebpage: [...smartContainerStyleControls, 'stylesOn', 'smartWebpage'],
  undefined: undefinedControls,
  cardsSection: cardsSectionStyleControls,
  featureSection: featureSectionStyleControls,
  section: containerStyleControls,
} as const;

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
    column: {
      min: 0,
      max: Infinity,
    },
  },
  column: {
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
  smartHeader: {
    all: {
      min: 0,
      max: Infinity,
    },
  },
  smartFooter: {
    all: {
      min: 0,
      max: Infinity,
    },
  },
  smartForm: {
    all: {
      min: 0,
      max: Infinity,
    },
  },
  smartWebpage: {
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

export const defaultFreeCanvasParams: Partial<FreeCanvasElementParams> = {
  left: 0,
  top: 0,
  zIndex: 0,
};
