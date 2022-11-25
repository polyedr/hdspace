import {
  LibraryElement,
  Project,
  Screen,
  ElementGroup,
  Layout,
  UserProjectPermission,
  UserData,
  ProfileData,
  Experience,
} from '../types';
import getDefaultStyles from '../utils/getDefaultStyles';
import { NOT_SELECTED_FRAMEWORK } from './frameworks';

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

export const DEFAULT_USER_PROFILE: ProfileData = {
  avatar: null,
  approved: false,
  role: '',
  hourlyRate: -1,
  id: -1,
  experienced: Experience.BEGINNER,
  parameters: {
    avatarCrop: '',
    profileDataParameters: {
      autoSwitchTabs: false,
      dropTargetBordersMode: true,
    },
    passwordZulip: '',
  },
};

export const DEFAULT_USER: UserData = {
  id: -1,
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  dateJoined: null,
  isActive: false,
  password: '',
  profile: DEFAULT_USER_PROFILE,
};

export const DEFAULT_PROJECT: Project = {
  id: -1,
  name: '',
  status: '',
  projectscreen: [],
  projectLoader: false,
  updated: new Date(),
  created: new Date(),
  projectTrelloJSON: {
    closed: false,
    desc: '',
    descData: '',
    id: '',
    idEnterprise: null,
    idOrganization: '',
    labelNames: null,
    limits: '',
    name: '',
    pinned: false,
    prefs: null,
    shortUrl: '',
    url: '',
  },
  tags: [],
  projectData: {
    defaultStyles: {
      indents: {
        marginTop: 0,
        marginLeft: 0,
        marginBottom: 0,
        marginRight: 0,
        paddingTop: 0,
        paddingLeft: 0,
        paddingBottom: 0,
        paddingRight: 0,
      },
      typography: {
        color: '#323232',
        fontFamily: `"Arial", sans-serif`,
        fontSize: '14px',
        fontWeight: 100,
        textAlign: 'center',
      },
      headingType: {
        fontSize: '40px',
      },
      colors: {
        color: '#323232',
      },
      accentColor: {
        'accent-color': 'transparent',
      },
      screenBackgroundColor: {
        background: 'transparent',
      },
      fontColorOverlay: {
        color: '#323232',
      },
      elementsBackgroundColor: {
        'background-color': 'transparent',
      },
      borderColor: {
        'border-color': 'transparent',
      },
      border: {
        borderRadius: '0%',
      },
    },
    classes: [
      {
        className: 'root',
        supportedElement: 'root',
        rules: getDefaultStyles('root'),
      },
    ],
    uiFramework: NOT_SELECTED_FRAMEWORK,
    layout: {
      value: Layout.Desktop,
      rotated: false,
    },
  },
  user: DEFAULT_USER,
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
    pseudoClassStyles: {},
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
  screenData: {
    uiFramework: NOT_SELECTED_FRAMEWORK,
    freeCanvas: false,
    editableScreenUser: [],
  },
};

export const DEFAULT_LAYOUT_LIST = [
  Layout.Desktop,
  Layout.Tablet,
  Layout.Mobile,
  Layout.MotoG4,
  Layout.Pixel2,
  Layout.iPhone5,
  Layout.iPhone678,
  Layout.iPhone678Plus,
  Layout.iPhoneX,
  Layout.iPad,
  Layout.iPadPro,
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
  'switch',
];

export const CONTAINER_GROUPS = [ElementGroup.CONTAINERS, ElementGroup.CUSTOM];
export const ROLES = ['STAFF', 'ADMINISTRATOR', 'LIBRARIAN', 'EXTERNAL'];

export const NOT_DRAGGABLE_COMPONENTS = ['option', 'column', 'gridItem'];

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
  'styleSheets',
  'breadcrumb',
  'pagination',
  'carousel',
  'navbar',
];

export const ALL_ELEMENTS_INDEX = 'all';

export const PROJECT_STATUS_LIST = ['pending', 'paid'];
export const TEMPLATE_STATUS_LIST = ['pending', 'paid'];
export const EDITABLE_USER_PERMISSIONS = [
  UserProjectPermission.VIEW_PROJECT,
  UserProjectPermission.CHANGE_PROJECT,
];

export const PERMISSION_LABELS = {
  [UserProjectPermission.VIEW_PROJECT]: 'View project',
  [UserProjectPermission.CHANGE_PROJECT]: 'Change project',
};

export const URL_REGEX =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

export const shorten_url_api_key = 'vhDRD2O8a2G7NDk2LLej7vUxiDzDIYBp';
export const SHARING_USER_ID: string = '105';

export const USERNAME_VIEW = 'projectviewer';
export const PASSWORD_VIEW = '].?h^QC<FV4SdsmF';
