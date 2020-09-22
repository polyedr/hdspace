import { getDefaultStyles } from '../domain/libraryElements/defaultStyles';
import { LibraryElement, Project } from '../api/types';
import { IApiResponseError, ITokenPair } from '../redux/user/types';
import {
  ILSItem,
  Screen,
  ServerStructType,
  StateElement,
} from '../redux/project/types';
import { CssLikeStyles } from '../utils/StyleHelper';
import { isLatinOrNumbers } from '../shared/validators/isLatinOrNumbers';
import {
  composeValidators,
  isLongPassword,
  isOnlyNumeric,
  isRequired,
  isValidEmail,
} from '../shared/validators';

export interface ISignFormElement {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  type: string;
  validator: (value: string) => string | undefined;
}

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

export const DEFAULT_SIGNIN_FIELDS: ISignFormElement[] = [
  {
    label: 'Username',
    name: 'username',
    value: 'username',
    placeholder: 'UserName',
    type: 'text',
    validator: isRequired,
  },
  {
    label: 'Password',
    name: 'password',
    value: 'password',
    placeholder: 'pass',
    type: 'password',
    validator: isRequired,
  },
];

export const DEFAULT_SIGNUP_FIELDS: ISignFormElement[] = [
  {
    label: 'Username',
    name: 'username',
    value: 'username',
    placeholder: 'UserName',
    type: 'text',
    validator: composeValidators(isRequired, isLatinOrNumbers),
  },
  {
    label: 'First name',
    name: 'firstName',
    value: 'firstName',
    placeholder: 'Jhon',
    type: 'text',
    validator: composeValidators(isRequired, isLatinOrNumbers),
  },
  {
    label: 'Last name',
    name: 'lastName',
    value: 'lastName',
    placeholder: 'Doe',
    type: 'text',
    validator: composeValidators(isRequired, isLatinOrNumbers),
  },
  {
    label: 'Email',
    name: 'email',
    value: 'email',
    placeholder: 'example@gmail.com',
    type: 'email',
    validator: composeValidators(isRequired, isValidEmail),
  },
  {
    label: 'Password',
    name: 'password',
    value: 'password',
    placeholder: 'password',
    type: 'password',
    validator: composeValidators(
      isRequired,
      isLongPassword,
      isLatinOrNumbers,
      isOnlyNumeric,
    ),
  },
];

export const DEFAULT_RESTORE_PASSWORD_FIELDS: ISignFormElement[] = [
  {
    label: 'Password',
    name: 'password',
    value: 'password',
    placeholder: 'new password',
    type: 'password',
    validator: composeValidators(isRequired, isLongPassword, isLatinOrNumbers),
  },
  {
    label: 'Confirm password ',
    name: 'confirmPassword',
    value: 'confirmPassword',
    placeholder: 'confirm password',
    type: 'password',
    validator: isRequired,
  },
];

export const DEFAULT_AUTHORISATION_TOKEN: ITokenPair = {
  access: '',
  refresh: '',
};

export const DEFAULT_RESPONSE_ERROR: IApiResponseError = {
  errorStatus: -1,
  errorText: '',
  data: {},
};
