import * as R from 'ramda';

import {
  IScreenBorders,
  IScreenBackground,
  IScreenTypography,
  IScreenIndents,
  IProjectScreen,
  ActiveItem,
  LibraryElementType,
  ServerFuncType,
} from '$redux/project/types';
import { IApiResponseError, ITokenPair } from '$redux/user/reducer';
// import { ITokenPair, IApiResponseError } from '$redux/user/reducer';
// import { itemRoot } from '$utils/parseListItems';
import { getDaysInMonth } from '$utils/NumberHelper';
import { CssLikeStyles } from '$utils/StyleHelper';

import { IMAGES } from './images';

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
  value: { structType: LibraryElementType; funcType: ServerFuncType }
  checked: boolean,
}

interface IDefaultTemplate {
  [x: string]: {
    label: string,
    value: string,
    elements: ITemplateElement[],
  }
}

interface ISelectOptions {
  label: string,
  value: number,
}

const DEFAULT_QUONTITY_YEARS_FOR_SELECT = 10;
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
  'background-color': 'rgba(255, 255, 255, 100)',
  'background-image': 'none',
  'background-repeat': 'no-repeat',
  'background-size': 'cover',
};

export const DEFAULT_ACTION = {
  actionUrl: '',
};

export const DEFAULT_MAP_PROPS = {
  map_props: {
    center: {
      lat: 50.00008,
      lng: 40.00008,
    },
    zoom: 10,
    markerText: 'A',
  },
};

export const DEFAULT_IMAGE_PROPS = { 
  imageURL: IMAGES.imageIcon,
};

export const DEFAULT_TYPOGRAPHY: IScreenTypography = {
  color: '#323232',
  'font-family': '"Arial", "Verdana", sans-serif"',
  'font-size': '14px',
  'font-style': 'none',
  'font-weight': 400,
  'line-height': '16px',
  'text-align': 'left',
};

export const DEFAULT_PROJECT = {
  id: -1,
  name: '',
  status: '',
  projectscreen: [],
  projectLoader: false,
};

export const DEFAULT_LS = {
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
  image: null,
  listSortable: DEFAULT_LS,
  screenLoader: false,
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

export const MODAL_ADD_ELEMENTS_TABS = ['Screen', 'Widget', 'Button', 'Input', 'Select', 'Image', 'Other'];

export const DEFAULT_TEMPLATES: IDefaultTemplate = {
  signup: {
    label: 'Sign Up',
    value: 'signup',
    elements: [
      { label: 'input/email', value: { funcType: 'email', structType: 'textinput'}, checked: true },
      { label: 'input/last name', value: { funcType: 'lastname', structType: 'textinput'}, checked: true },
      { label: 'input/first name', value: { funcType: 'firstname', structType: 'textinput'}, checked: true },
      { label: 'input/password', value: { funcType: 'password', structType: 'textinput'}, checked: true },
      { label: 'select/day', value: { funcType: 'day', structType: 'select'}, checked: false },
      { label: 'select/month', value: { funcType: 'month', structType: 'select'}, checked: false },
      { label: 'select/year', value: { funcType: 'year', structType: 'select'}, checked: false },
      { label: 'button/ok', value: { funcType: 'end_composite_scenario', structType: 'button'}, checked: true },
    ],
  },
  signin: {
    label: 'Sign In',
    value: 'signin',
    elements: [
      { label: 'input/email', value: { funcType: 'email', structType: 'textinput'}, checked: true },
      { label: 'input/password', value: { funcType: 'password', structType: 'textinput'}, checked: true },
      { label: 'button/ok', value: { funcType: 'end_composite_scenario', structType: 'button'}, checked: true },
      { label: 'hyperlink/forgotten account?', value: { funcType: 'end_simple_scenario', structType: 'hyperlink'}, checked: true },
    ],
  },
  custom: {
    label: 'Custom',
    value: 'custom',
    elements: [],
  },
  template1: {
    label: 'Template 1',
    value: 'template1',
    elements: [
      { label: 'input/first name', value: { funcType: 'firstname', structType: 'textinput' }, checked: true },
      { label: 'input/last name', value: { funcType: 'lastname', structType: 'textinput' }, checked: true },
      { label: 'input/password', value: { funcType: 'password', structType: 'textinput' }, checked: true },
      { label: 'button/ok', value: { funcType: 'end_composite_scenario', structType: 'button' }, checked: false },
    ],
  },
  template2: {
    label: 'Template 2',
    value: 'template1',
    elements: [
      { label: 'input/password', value: { funcType: 'password', structType: 'textinput' }, checked: true },
      { label: 'button/ok', value: { funcType: 'end_composite_scenario', structType: 'button' }, checked: true },
    ],
  },
  template3: {
    label: 'Template 3',
    value: 'template3',
    elements: [
      { label: 'input/first name', value: { funcType: 'firstname', structType: 'textinput'}, checked: true },
      { label: 'input/last name', value: { funcType: 'lastname', structType: 'textinput'}, checked: true },
      { label: 'input/password', value: { funcType: 'password', structType: 'textinput'}, checked: true },
      { label: 'button/ok', value: { funcType: 'end_composite_scenario', structType: 'button'}, checked: false },
    ],
  },
};

export const DEFAULT_RENDER_SELECT_OPTIONS: ISelectOptions[] = [
  { label: 'First', value: 0 },
  { label: 'Second', value: 1 },
  { label: 'Third', value: 2 },
];

const DEFAULT_MONTH: ISelectOptions[] = [
  { label: 'January', value: 0 },
  { label: 'February', value: 1 },
  { label: 'March', value: 2 },
  { label: 'April', value: 3 },
  { label: 'May', value: 4 },
  { label: 'June', value: 5 },
  { label: 'July', value: 6 },
  { label: 'August', value: 7 },
  { label: 'September', value: 8 },
  { label: 'October', value: 9 },
  { label: 'November', value: 10 },
  { label: 'December', value: 11 },
];

export const getDefaultDateSelectOptions = (dateType = 'year'): ISelectOptions[] => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  switch (dateType) {
    case 'year':
      return R.range(0, DEFAULT_QUONTITY_YEARS_FOR_SELECT).map((el) => {
        const newYear = currentYear - el;
        return { label: String(newYear), value: newYear };
      });

    case 'month':
      return DEFAULT_MONTH;

    case 'day':
      return R.range(1, daysInMonth).map(day => ({
        label: String(day),
        value: day,
      }));

    default:
      return DEFAULT_RENDER_SELECT_OPTIONS;
  }
};

export const DEFAULT_PLACEHOLDER = {
  placeholder: 'Enter a label for the field',
};

export const DEFAULT_TEXT_CONTENT = {
  textContent: 'Enter a label for the field',
};

export const DEFAULT_MAP_WIDGET = {
  struct_type: 'widget',
  func_type: 'map',
  func_type_human: 'Map',
  buoyancy: 0,
  parameters: {
    group: 'widget',
  },
  styles: {},
};

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
