import {
  LibraryElement,
  Project,
  Screen,
  ElementGroup,
  Layout,
} from '../types';
import getDefaultStyles from '../utils/getDefaultStyles';

export const MIN_BORDER_WIDTH = 0;
export const MAX_BORDER_WIDTH = 10;
export const MIN_BORDER_RADIUS = 0;
export const MAX_BORDER_RADIUS = 100;
export const MAX_BORDER_RADIUS_PERCENT = 50;

export const MIN_LATITUDE = -85;
export const MAX_LATITUDE = 85;
export const MIN_LONGITUDE = -180;
export const MAX_LONGITUDE = 180;
export const MIN_MAP_ZOOM = 1;
export const MAX_MAP_ZOOM = 18;

export const DEFAULT_PROJECT: Project = {
  id: -1,
  name: '',
  status: '',
  projectscreen: [],
  projectLoader: false,
  updated: new Date(),
  created: new Date(),
  projectData: {
    classes: [
      {
        className: 'root',
        supportedElement: 'root',
        rules: getDefaultStyles('root'),
      },
    ],
  },
};

export const DEFAULT_ROOT: LibraryElement<'root'> = {
  id: '-1',
  name: 'Root',
  children: [],
  type: 'root',
  buoyancy: 0,
  image: null,
  parameters: {},
  styles: {
    classNames: ['root'],
    ownStyles: {} as Required<React.CSSProperties>,
  },
};

export const DEFAULT_SCREEN: Screen = {
  id: -1,
  project: -1,
  name: '',
  status: '',
  screenscenario: [],
  buoyancy: 0,
  image: null,
  element: '-1',
};

export const DEFAULT_LAYOUT_LIST = [
  Layout.Desktop,
  Layout.Tablet,
  Layout.Mobile,
];

export const SAVEABLE_ELEMENTS = ['section'];

export const KEEP_RP_TAB_ELEMENTS = [
  'root',
  'section',
  'container',
  'divBlock',
];

export const LABELED_INPUT_TYPES = [
  'textinput',
  'textarea',
  'select',
  'radiobutton',
  'checkbox',
];

export const CONTAINER_GROUPS = [ElementGroup.CONTAINERS, ElementGroup.CUSTOM];
export const ROLES = ['STAFF', 'ADMINISTRATOR', 'LIBRARIAN', 'EXTERNAL'];

export const EDITABLE_COMPONENTS_LIST = [
  'textBlock',
  'paragraph',
  'heading',
  'listItem',
  'label',
];

export const NOT_DRAGGABLE_COMPONENTS = [
  'selectMenu',
  'option',
  'column',
  'gridItem',
];

export const ALL_ASSETS_LIST_ID = 'all';
export const ALL_ASSET_LIST_NAME = 'All assets';
export const DEFAULT_ASSET_LIST_NAME = 'Project assets';

export const INTERACTIVE_ELEMENTS = ['hyperlink'];

export const UNIQUE_CONTROLS = [
  'textContent',
  'isChecked',
  'type',
  'placeholder',
  'labelFor',
  'listItems',
  'image',
  'selectValue',
  'selectOptions',
  'isOpen',
  'name',
  'value',
  'mapProps',
  'dropdownItems',
  'videoSettings',
  'stylesOn',
  'layouts',
];

export const ALL_ELEMENTS_INDEX = 'all';

export const PROJECT_STATUS_LIST = ['pending', 'paid'];
