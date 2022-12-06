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
  buttonGenerator: 'buttonGenerator',
  textinput: 'textinput',
  textarea: 'textarea',
  slider: 'slider',
  dateTimePicker: 'dateTimePicker',
  checkbox: 'checkbox',
  switch: 'switch',
  radiobuttonGroup: 'radiobuttonGroup',
  label: 'label',
  heading: 'heading',
  paragraph: 'paragraph',
  textBlock: 'textBlock',
  list: 'list',
  image: 'image',
  imagesList: 'imagesList',
  select: 'select',
  map: 'map',
  calendar: 'calendar',
  clock: 'clock',
  dropdown: 'dropdown',
  video: 'video',
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
  hyperlink: 'hyperlink',
};

export const rootStyleControls = ['background'] as const;

export const containerStyleControls = [
  'indents',
  'size',
  'display',
  'flexConstraints',
  'typography',
  'background',
  'position',
  'backgroundImage',
  'border',
  'flexGrow',
  'opacity',
] as const;

export const divBlockStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'position',
  'backgroundImage',
  'border',
  'display',
  'opacity',
] as const;

export const buttonStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'position',
  'backgroundImage',
  'border',
  'display',
  'opacity',
] as const;

export const buttonParamsControls = ['text'] as const;

export const textinputStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'position',
  'border',
  'opacity',
] as const;

export const dateTimePickerStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'position',
  'border',
  'opacity',
] as const;

export const textareaStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'position',
  'border',
  'opacity',
] as const;

export const sliderStyleControls = ['indents', 'size', 'opacity'] as const;

export const checkboxStyleControls = [
  'indents',
  'size',
  'background',
  'position',
  'opacity',
] as const;

export const switchStyleControls = [
  'indents',
  'size',
  'background',
  'position',
  'opacity',
] as const;

export const radiobuttonStyleControls = [
  'indents',
  'size',
  'background',
  'position',
  'opacity',
] as const;

export const radiobuttonGroupStyleControls = [
  'indents',
  'size',
  'background',
  'position',
  'opacity',
] as const;

export const labelStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'position',
  'border',
  'display',
  'opacity',
] as const;

export const headingStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'position',
  'border',
  'opacity',
] as const;

export const paragraphStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'position',
  'border',
  'opacity',
] as const;

export const ocrtextStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'position',
  'border',
  'opacity',
] as const;

export const textBlockStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'position',
  'border',
  'opacity',
] as const;

export const listStyleControls = [
  'indents',
  'size',
  'background',
  'position',
  'border',
  'display',
  'bullets',
  'opacity',
] as const;

export const paginationStyleControls = [
  'indents',
  'size',
  'background',
  'position',
  'border',
  'display',
  'opacity',
] as const;

export const listItemStyleControls = [
  'indents',
  'size',
  'background',
  'position',
  'border',
  'opacity',
] as const;

export const listImagesItemStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'position',
  'backgroundImage',
  'border',
  'opacity',
] as const;

export const breadcrumbItemStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'position',
  'border',
  'opacity',
] as const;
export const paginationItemStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'position',
  'border',
  'opacity',
] as const;
export const navbarItemStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'position',
  'border',
  'opacity',
] as const;
export const imageStyleControls = [
  'indents',
  'size',
  'background',
  'position',
  'border',
  'opacity',
] as const;

export const smartContainerStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'position',
  'border',
  'display',
  'opacity',
] as const;

export const selectStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'position',
  'border',
  'opacity',
] as const;

export const selectMenuStyleControls = [
  'indents',
  'size',
  'border',
  'background',
  'position',
  'opacity',
] as const;

export const optionStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'position',
  'border',
  'opacity',
] as const;

export const mapStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'position',
  'border',
  'opacity',
] as const;

export const calendarStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'position',
  'border',
  'opacity',
] as const;

export const clockStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'position',
  'border',
  'opacity',
] as const;

export const dropdownStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'position',
  'border',
  'opacity',
] as const;

export const dropdownMenuStyleControls = [
  'indents',
  'size',
  'border',
  'background',
  'position',
  'opacity',
] as const;

export const dropdownItemStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'position',
  'border',
  'opacity',
] as const;

export const videoStyleControls = [
  'indents',
  'size',
  'border',
  'opacity',
] as const;

export const pageTemplateStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'position',
  'border',
  'display',
  'opacity',
] as const;

export const emptyPageTemplateStyleControls = [
  'indents',
  'size',
  'display',
  'typography',
  'border',
  'background',
  'position',
  'opacity',
] as const;

export const gridItemStyleControls = [
  'indents',
  'typography',
  'background',
  'position',
  'backgroundImage',
  'border',
  'opacity',
] as const;

export const gridStyleControls = [
  'grid',
  'indents',
  'size',
  'typography',
  'background',
  'position',
  'border',
  'opacity',
] as const;

export const nativeColumnsStyleControls = [
  'nativeColumns',
  'indents',
  'size',
  'typography',
  'background',
  'position',
  'border',
  'display',
  'opacity',
] as const;

export const columnsStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'position',
  'backgroundImage',
  'border',
  'opacity',
] as const;

export const columnStyleControls = [
  'indents',
  'typography',
  'background',
  'position',
  'border',
  'opacity',
] as const;

export const subscribeFormStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'position',
  'border',
  'display',
  'opacity',
] as const;

export const undefinedControls = ['size', 'background'] as const;

export const htmlElementControls = ['background'] as const;

export const cardsSectionStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'position',
  'border',
  'display',
  'opacity',
] as const;

export const featureSectionStyleControls = [
  'indents',
  'size',
  'typography',
  'background',
  'position',
  'border',
  'display',
  'opacity',
] as const;

export const breadcrumbStyleControls = [
  'indents',
  'size',
  'background',
  'position',
  'border',
  'display',
  'opacity',
] as const;

export const carouselStyleControls = [
  'indents',
  'size',
  'background',
  'position',
  'border',
  'display',
  'opacity',
] as const;

export const navbarStyleControls = [
  'indents',
  'size',
  'background',
  'position',
  'border',
  'display',
  'opacity',
] as const;

export const elementsGroupStyleControls = [
  'indents',
  'background',
  'position',
  'opacity',
] as const;

// WARN: every time you add or remove some properties in prod, you must write migration to add/remove properties for existing entities in db
export const AVAILABLE_CONTROLS: AvailableControls = {
  root: rootStyleControls,
  container: [...containerStyleControls, 'layouts'],
  divBlock: [...divBlockStyleControls, 'layouts'],
  button: [...buttonStyleControls, ...buttonParamsControls, 'layouts'],
  buttonGenerator: [...subscribeFormStyleControls, 'layouts'],
  input: [
    'textContent',
    'type',
    'placeholder',
    ...textinputStyleControls,
    'layouts',
  ],
  textinput: [
    'text',
    'type',
    'placeholder',
    ...textinputStyleControls,
    'layouts',
  ],
  textarea: ['text', 'placeholder', ...textareaStyleControls, 'layouts'],
  dateTimePicker: [
    'dateTimePickerControls',
    ...dateTimePickerStyleControls,
    'layouts',
  ],
  slider: ['sliderSettings', ...sliderStyleControls],
  checkbox: [
    'value',
    'name',
    ...checkboxStyleControls,
    'layouts',
    'textContent',
  ],
  switch: ['value', 'name', ...switchStyleControls, 'layouts'],
  radiobutton: ['value', ...radiobuttonStyleControls, 'layouts'],
  radiobuttonGroup: [
    'radiobuttons',
    'alignment',
    ...radiobuttonGroupStyleControls,
    'layouts',
  ],
  label: ['text', 'labelFor', ...labelStyleControls, 'layouts'],
  heading: ['textContent', 'headingType', ...headingStyleControls, 'layouts'],
  paragraph: ['textContent', ...paragraphStyleControls, 'layouts'],
  ocrtext: ['textContent', ...paragraphStyleControls, 'layouts'],
  textBlock: ['textContent', ...textBlockStyleControls, 'layouts'],
  list: ['listItems', 'isOrdered', ...listStyleControls, 'layouts'],
  listItem: [...listItemStyleControls, 'text', 'layouts'],
  image: [
    'image',
    ...imageStyleControls,
    'alt',
    'title',
    'resizeOptions',
    'layouts',
  ],
  imagesList: ['imagesList', ...imageStyleControls, 'layouts'],
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
  hyperlink: ['textContent', 'labelFor', ...labelStyleControls, 'layouts'],
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
  buttonGenerator: {
    all: {
      min: 0,
      max: Infinity,
    },
  },
  textinput: {},
  input: {},
  dateTimePicker: {},
  textarea: {},
  slider: {},
  checkbox: {},
  switch: {},
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
  imagesList: {
    image: {
      min: 1,
      max: Infinity,
    },
  },
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
  hyperlink: {},
};

export const defaultFreeCanvasParams: Partial<FreeCanvasElementParams> = {
  left: 0,
  top: 0,
  zIndex: 0,
  width: 300,
  height: 100,
};
