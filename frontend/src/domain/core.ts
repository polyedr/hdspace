import {
  AvailableChildren,
  AvailableControls,
  ElementEntity,
  FreeCanvasElementParams,
} from '../types';

export const ENTITIES: {
  [K in Exclude<ElementEntity, 'ocrtext' | 'root' | 'container' | 'input'>]: K;
} = {
  button: 'button',
  textinput: 'textinput',
  textarea: 'textarea',
  checkbox: 'checkbox',
  radiobuttonGroup: 'radiobuttonGroup',
  label: 'label',
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
  nativeColumns: 'nativeColumns',
  columns: 'columns',
  smartHeader: 'smartHeader',
  smartFooter: 'smartFooter',
  smartForm: 'smartForm',
  smartWebpage: 'smartWebpage',
  subscribeForm: 'subscribeForm',
  cardsSection: 'cardsSection',
  featureSection: 'featureSection',
  section: 'section',
  group: 'group',
  html: 'html',
  breadcrumb: 'breadcrumb',
  pagination: 'pagination',
  carousel: 'carousel',
  navbar: 'navbar',
};

export const rootStyleControls = ['background'] as const;

export const containerStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'backgroundImage',
  'border',
  'display',
  'flexGrow',
] as const;

export const divBlockStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'backgroundImage',
  'border',
  'display',
] as const;

export const buttonStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'backgroundImage',
  'border',
  'display',
] as const;

export const buttonParamsControls = ['textContent'] as const;

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

export const radiobuttonGroupStyleControls = [
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

export const paginationStyleControls = [
  'indents',
  'size',
  'background',
  'border',
  'display',
] as const;

export const listItemStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'backgroundImage',
  'border',
] as const;
export const breadcrumbItemStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'border',
] as const;
export const paginationItemStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'border',
] as const;
export const navbarItemStyleControls = [
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

export const optionStyleControls = [
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

export const gridItemStyleControls = [
  'indents',
  'typography',
  'background',
  'backgroundImage',
  'border',
] as const;

export const gridStyleControls = [
  'grid',
  'indents',
  'size',
  'typography',
  'background',
  'border',
] as const;

export const nativeColumnsStyleControls = [
  'nativeColumns',
  'indents',
  'size',
  'typography',
  'background',
  'border',
  'display',
] as const;

export const columnsStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'backgroundImage',
  'border',
] as const;

export const columnStyleControls = [
  'indents',
  'typography',
  'background',
  'border',
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

export const htmlElementControls = ['background'] as const;

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

export const breadcrumbStyleControls = [
  'indents',
  'size',
  'background',
  'border',
  'display',
] as const;

export const carouselStyleControls = [
  'indents',
  'size',
  'background',
  'border',
  'display',
] as const;

export const navbarStyleControls = [
  'indents',
  'size',
  'background',
  'border',
  'display',
] as const;

export const elementsGroupStyleControls = ['indents', 'background'] as const;

// WARN: every time you add or remove some properties in prod, you must write migration to add/remove properties for existing entities in db
export const AVAILABLE_CONTROLS: AvailableControls = {
  root: rootStyleControls,
  container: [...containerStyleControls, 'layouts'],
  divBlock: [...divBlockStyleControls, 'layouts'],
  button: [...buttonStyleControls, ...buttonParamsControls, 'layouts'],
  input: [
    'textContent',
    'type',
    'placeholder',
    ...textinputStyleControls,
    'layouts',
  ],
  textinput: [
    'textContent',
    'type',
    'placeholder',
    ...textinputStyleControls,
    'layouts',
  ],
  textarea: ['textContent', 'placeholder', ...textareaStyleControls, 'layouts'],
  checkbox: ['value', 'name', ...checkboxStyleControls, 'layouts'],
  radiobutton: ['value', ...radiobuttonStyleControls, 'layouts'],
  radiobuttonGroup: [
    'radiobuttons',
    'alignment',
    'selectValue',
    ...radiobuttonGroupStyleControls,
    'layouts',
  ],
  label: ['textContent', 'labelFor', ...labelStyleControls, 'layouts'],
  heading: ['textContent', 'headingType', ...headingStyleControls, 'layouts'],
  paragraph: ['textContent', ...paragraphStyleControls, 'layouts'],
  ocrtext: ['textContent', ...paragraphStyleControls, 'layouts'],
  textBlock: ['textContent', ...textBlockStyleControls, 'layouts'],
  list: ['listItems', 'isOrdered', ...listStyleControls, 'layouts'],
  listItem: [...listItemStyleControls, 'layouts'],
  image: [
    'image',
    ...imageStyleControls,
    'alt',
    'title',
    'resizeOptions',
    'layouts',
  ],
  select: ['selectValue', 'selectOptions', ...selectStyleControls, 'layouts'],
  option: [...optionStyleControls, 'layouts'],
  map: ['mapProps', ...mapStyleControls, 'layouts'],
  calendar: [...calendarStyleControls, 'layouts'],
  clock: [...clockStyleControls, 'layouts'],
  dropdown: [
    'textContent',
    'dropdownItems',
    ...dropdownStyleControls,
    'layouts',
  ],
  dropdownMenu: [...dropdownMenuStyleControls, 'layouts'],
  dropdownItem: [...dropdownItemStyleControls, 'layouts'],
  video: [...videoStyleControls, 'videoSettings', 'layouts'],
  pageTemplate: [...pageTemplateStyleControls, 'layouts'],
  emptyPageTemplate: [...emptyPageTemplateStyleControls, 'layouts'],
  gridItem: [...gridItemStyleControls, 'layouts'],
  grid: [...gridStyleControls, 'layouts'],
  nativeColumns: [...nativeColumnsStyleControls, 'layouts'],
  columns: ['columns', ...columnsStyleControls, 'layouts'],
  column: [...columnStyleControls, 'layouts'],
  subscribeForm: [...subscribeFormStyleControls, 'layouts'],
  smartHeader: [
    ...smartContainerStyleControls,
    'stylesOn',
    'smartHeader',
    'layouts',
  ],
  smartFooter: [
    ...smartContainerStyleControls,
    'stylesOn',
    'smartFooter',
    'layouts',
  ],
  smartForm: [
    ...smartContainerStyleControls,
    'stylesOn',
    'smartForm',
    'layouts',
  ],
  smartWebpage: [
    ...smartContainerStyleControls,
    'stylesOn',
    'smartWebpage',
    'layouts',
  ],
  undefined: [...undefinedControls, 'layouts'],
  cardsSection: [...cardsSectionStyleControls, 'layouts'],
  featureSection: [...featureSectionStyleControls, 'layouts'],
  section: [...containerStyleControls, 'layouts'],
  group: elementsGroupStyleControls,
  html: [
    'textContent',
    'tagName',
    ...htmlElementControls,
    'styleSheets',
    'attributes',
    'layouts',
  ],
  breadcrumb: ['breadcrumb', ...breadcrumbStyleControls, 'layouts'],
  breadcrumbItem: [...breadcrumbItemStyleControls, 'layouts'],
  pagination: ['pagination', ...paginationStyleControls, 'layouts'],
  paginationItem: [...paginationItemStyleControls, 'layouts'],
  carousel: ['carousel', ...carouselStyleControls, 'layouts'],
  carouselItem: [...paginationItemStyleControls, 'layouts'],
  navbar: ['navbar', ...navbarStyleControls, 'layouts'],
  navbarItem: [...navbarItemStyleControls, 'layouts'],
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
  input: {},
  textarea: {},
  checkbox: {},
  radiobuttonGroup: {
    radiobutton: {
      min: 2,
      max: Infinity,
    },
  },
  radiobutton: {},
  label: {},
  heading: {},
  paragraph: {},
  ocrtext: {},
  textBlock: {},
  group: {
    all: {
      min: 0,
      max: Infinity,
    },
  },
  list: {
    listItem: {
      min: 1,
      max: Infinity,
    },
  },
  listItem: {},
  image: {},
  select: {
    option: {
      min: 1,
      max: Infinity,
    },
  },
  option: {},
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
    gridItem: {
      min: 4,
      max: 9,
    },
  },
  gridItem: {
    all: {
      min: 0,
      max: Infinity,
    },
  },
  nativeColumns: {
    all: {
      min: 0,
      max: Infinity,
    },
  },
  columns: {
    column: {
      min: 2,
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
  html: {
    all: {
      min: 0,
      max: Infinity,
    },
  },
  breadcrumb: {
    breadcrumbItem: {
      min: 1,
      max: Infinity,
    },
  },
  breadcrumbItem: {},
  pagination: {
    paginationItem: {
      min: 1,
      max: Infinity,
    },
  },
  paginationItem: {},
  carousel: {
    carouselItem: {
      min: 1,
      max: Infinity,
    },
  },
  carouselItem: {},
  navbar: {
    carouselItem: {
      min: 1,
      max: Infinity,
    },
  },
  navbarItem: {},
};

export const defaultFreeCanvasParams: Partial<FreeCanvasElementParams> = {
  left: 0,
  top: 0,
  zIndex: 0,
  width: 300,
  height: 100,
};
