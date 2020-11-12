import {
  CssLikeStyles,
  LibraryElement,
  Project,
  StateElement,
  Screen,
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
    ownStyles: {} as Required<CssLikeStyles>,
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

export const DEFAULT_ACTIVE_ELEMENT: StateElement = {
  id: 'none',
  type: 'none',
  name: 'Not selected',
  children: [],
  buoyancy: 0,
  image: null,
  parameters: {},
  styles: {
    classNames: ['root'],
    ownStyles: {},
  },
};

export const CONTAINER_GROUPS = ['containers', 'custom'];

export const SAVEABLE_ELEMENTS = ['section'];

export const KEEP_RP_TAB_ELEMENTS = [
  'section',
  'container',
  'divBlock',
  'grid',
  'columns',
];
