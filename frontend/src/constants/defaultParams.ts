import {
  IProjectScreen,
  ActiveItem,
  ServerStructType,
  ILSItem,
} from '$redux/project/types';
import { IApiResponseError, ITokenPair } from '$redux/user/types';
import { LibraryElement, Project } from '$api/types';
import { CssLikeStyles } from '$utils/StyleHelper';
import { getDefaultStyles } from '$domain/libraryElements/defaultStyles';

export interface ISignFormElement {
  label: string;
  value: string;
  placeholder: string;
  type: string;
}

export interface ISignFormField {
  value: string;
  label: string;
  placeholder: string;
  isError: boolean;
  errorText: string;
}

export interface ISignFormFields {
  [x: string]: ISignFormField;
}

export interface ITemplateElement {
  label: string;
  value: { structType: ServerStructType; funcType: ServerStructType };
  checked: boolean;
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

export const DEFAULT_SCREEN: IProjectScreen = {
  id: -1,
  project: -1,
  name: '',
  status: '',
  screenscenario: [],
  buoyancy: 0,
  image: null,
  listSortable: DEFAULT_LS,
  projectscreen: [],
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

export const MODAL_ADD_ELEMENTS_TABS = [
  'Containers',
  'Widget',
  'Typography',
  'Form',
  'Image',
  'Other',
];

export const DEFAULT_SIGNIN_FIELDS: ISignFormElement[] = [
  {
    label: 'Username or Email',
    value: 'username',
    placeholder: 'UserName',
    type: 'text',
  },
  {
    label: 'Password',
    value: 'password',
    placeholder: 'pass',
    type: 'password',
  },
];

export const DEFAULT_SIGNUP_FIELDS: ISignFormElement[] = [
  {
    label: 'Username',
    value: 'username',
    placeholder: 'UserName',
    type: 'text',
  },
  {
    label: 'First name',
    value: 'firstName',
    placeholder: 'Jhon',
    type: 'text',
  },
  { label: 'Last name', value: 'lastName', placeholder: 'Doe', type: 'text' },
  {
    label: 'Email',
    value: 'email',
    placeholder: 'example@gmail.com',
    type: 'text',
  },
  {
    label: 'Password',
    value: 'password',
    placeholder: 'pass',
    type: 'password',
  },
  {
    label: 'Confirm password',
    value: 'confirmPassword',
    placeholder: 'pass',
    type: 'password',
  },
];

export const DEFAULT_RESTORE_PASSWORD_FIELDS: ISignFormElement[] = [
  {
    label: 'Password',
    value: 'password',
    placeholder: 'new password',
    type: 'text',
  },
  {
    label: 'Confirm password ',
    value: 'confirmPassword',
    placeholder: 'confirm password',
    type: 'text',
  },
];

export const DEFAULT_AUTHORISATION_TOKEN: ITokenPair = {
  access: '',
  refresh: '',
};

export const DEFAULT_RESPONSE_ERROR: IApiResponseError = {
  errorStatus: -1,
  errorText: '',
};
