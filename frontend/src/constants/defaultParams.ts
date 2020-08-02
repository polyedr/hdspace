import {
  IScreenBorders,
  IScreenBackground,
  IScreenTypography,
  IScreenIndents,
  IProjectScreen,
  ActiveItem,
  ServerStructType,
  ILSItem,
} from '$redux/project/types';
import { IApiResponseError, ITokenPair } from '$redux/user/reducer';
import { CssLikeStyles } from '$utils/StyleHelper';
import { LibraryElement } from '$api/types';

export interface ISignFormElement {
  label: string,
  value: string,
  placeholder: string,
  type: string,
}

export interface ISignFormField {
  value: string,
  label: string,
  placeholder: string,
  isError: boolean,
  errorText: string,
}

export interface ISignFormFields {
  [x: string]: ISignFormField,
}

export interface ITemplateElement {
  label: string,
  value: { structType: ServerStructType; funcType: ServerStructType }
  checked: boolean,
}

export const MIN_WIDTH = '24px';
export const MIN_HEIGHT = 'auto';

export const DEFAULT_WIDTH = 'auto';
export const DEFAULT_HEIGHT = 'auto';

export const DEFAULT_SIZE = {
  width: 'auto',
  height: 'auto',
};

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

export const DEFAULT_INDENTS: IScreenIndents = {
  'margin-top': '0px',
  'margin-right': '0px',
  'margin-bottom': '0px',
  'margin-left': '0px',
  'padding-top': '5px',
  'padding-right': '5px',
  'padding-bottom': '5px',
  'padding-left': '5px',
};

export const DEFAULT_DISPLAY: CssLikeStyles = { 
  display: 'block',
  'flex-direction': 'row',
  'justify-content': 'flex-start',
  'align-items': 'stretch',
 };

export const DEFAULT_BORDER: IScreenBorders = {
  'border-width': '0px',
  'border-color': '#323232',
  'border-style': 'solid',
  'border-radius': '0px',
};

export const DEFAULT_BACKGROUND: IScreenBackground = {
  'background-color': 'rgba(255, 255, 255, 0)',
  'background-image': 'none',
  'background-repeat': 'no-repeat',
  'background-size': 'cover',
};

export const DEFAULT_BULLETS: CssLikeStyles = {
  'list-style-type': 'disc',
};

export const DEFAULT_TYPOGRAPHY: IScreenTypography = {
  color: '#323232',
  'font-family': '"Roboto", sans-serif',
  'font-size': '14px',
  'font-style': 'none',
  'font-weight': 400,
  'line-height': '1.5',
  'text-align': 'left',
};

export const DEFAULT_PROJECT = {
  id: -1,
  name: '',
  status: '',
  projectscreen: [],
  projectLoader: false,
  updated: new Date(),
  created: new Date(),
  projectData: {
    classes: [],
  }
};

export const DEFAULT_LS: { root: ILSItem } = {
  root: {
    id: -1,
    type: 'root',
    children: [],
  },
};

export const DEFAULT_SCREEN: IProjectScreen = {
  id: -1,
  project: -1,
  name: '',
  status: '',
  screenscenario: [],
  buoyancy: 0,
  image: null,
  listSortable: DEFAULT_LS,
  screenLoader: false,
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
    ownStyles: {},
  },
};

export const DEFAULT_ACTIVE_ITEM: ActiveItem = {
  itemId: 'none',
  itemType: 'none',
  name: 'Not selected',
};

export const STATUS = ['on_hold', 'in_progress', 'review', 'approved'];

export const LIST_SCENARIO_TYPE = ['container', 'root'];

export const DEFAULT_SCREEN_MODE = {
  isDefaultMode: false,
  isTabletMode: false,
  isMobileMode: false,
};

export const MODAL_ADD_ELEMENTS_TABS = ['Containers', 'Widget', 'Typography', 'Form', 'Image', 'Other'];

export const DEFAULT_SIGNIN_FIELDS: ISignFormElement[] = [
  { label: 'Username or Email', value: 'username', placeholder: 'UserName', type: 'text' },
  { label: 'Password', value: 'password', placeholder: 'pass', type: 'password' },
];

export const DEFAULT_SIGNUP_FIELDS: ISignFormElement[] = [
  { label: 'Username', value: 'username', placeholder: 'UserName', type: 'text' },
  { label: 'First name', value: 'firstName', placeholder: 'Jhon', type: 'text' },
  { label: 'Last name', value: 'lastName', placeholder: 'Doe', type: 'text' },
  { label: 'Email', value: 'email', placeholder: 'example@gmail.com', type: 'text' },
  { label: 'Password', value: 'password', placeholder: 'pass', type: 'password' },
  { label: 'Confirm password', value: 'confirmPassword', placeholder: 'pass', type: 'password' },
];

export const DEFAULT_RESTORE_PASSWORD_FIELDS: ISignFormElement[] = [
  { label: 'Password', value: 'password', placeholder: 'new password', type: 'text' },
  { label: 'Confirm password ', value: 'confirmPassword', placeholder: 'confirm password', type: 'text' },
];

export const DEFAULT_AUTHORISATION_TOKEN: ITokenPair = {
  access: '',
  refresh: '',
};

export const DEFAULT_RESPONSE_ERROR: IApiResponseError = {
  errorStatus: -1,
  errorText: '',
};
