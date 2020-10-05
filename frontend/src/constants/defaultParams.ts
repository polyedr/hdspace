import { getDefaultStyles } from '../domain/libraryElements/defaultStyles';
import { LibraryElement, Project } from '../api/types';
import { ITokenPair } from '../redux/user/types';
import {
  ILSItem,
  Screen,
  ServerStructType,
  StateElement,
} from '../redux/project/types';
import { CssLikeStyles } from '../utils/StyleHelper';

export interface ITemplateElement {
  label: string;
  name: string;
  value: { structType: ServerStructType; funcType: ServerStructType };
  checked: boolean;
  custom: boolean;
}

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

export const DEFAULT_LS: { root: ILSItem } = {
  root: {
    id: -1,
    type: 'root',
    children: [],
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

export const STATUS = ['on_hold', 'in_progress', 'review', 'approved'];

export const LIST_SCENARIO_TYPE = ['container', 'root'];

export const DEFAULT_SCREEN_MODE = {
  isDefaultMode: false,
  isTabletMode: false,
  isMobileMode: false,
};

export const MODAL_ADD_ELEMENTS_TABS = [
  'Containers',
  'Widget',
  'Typography',
  'Form',
  'Image',
  'Other',
  'Custom',
];

export const DEFAULT_AUTHORISATION_TOKEN: ITokenPair = {
  access: '',
  refresh: '',
};

export const LIST_NOT_DRAGGING = ['element'];

export const CONTAINER_GROUPS = ['containers', 'custom'];

export const SAVEABLE_ELEMENTS = ['section'];
