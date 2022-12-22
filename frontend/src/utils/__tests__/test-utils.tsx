import { initialUserState } from '@Redux/user/initial';
import MockDate from 'mockdate';
import {
  initialCommunication,
  initialControl,
  initialData,
  initialEdit,
  initialUi,
} from '@Redux/project/initial';
import { initialmarketplaceData } from '@Redux/marketplace/initial';
import initialPermissions from '@Redux/permissions/initial';
import { AppReduxState, ProjectEditState } from '@Redux/types';
import { defaultFreeCanvasParams } from '@Domain/core';
import { DEFAULT_LAYOUT_LIST, DEFAULT_USER } from '@Constants/defaultParams';
import { generateRandomInteger } from '@Utils/NumberHelper';
import { NOT_SELECTED_FRAMEWORK } from '@Constants/frameworks';
import logger from 'loglevel';
import {
  Project,
  StateElement,
  Screen,
  UserData,
  ElementGroup,
  Experience,
  AssetsList,
  ProjectWithScreens,
  ProjectsSearchParameter,
  TemplatesSearchParameter,
  DateRange,
  NNBlockType,
  Layout,
  Marketplace,
} from '@Src/types';

export const mockProject: Project = {
  id: 1,
  name: 'Mock Project',
  status: 'in progress',
  created: new Date(0),
  updated: new Date(0),
  projectscreen: [],
  projectTrelloJSON: null,
  projectLoader: false,
  tags: [],
  projectData: {
    classes: [],
    uiFramework: NOT_SELECTED_FRAMEWORK,
    defaultStyles: {
      accentColor: {},
      border: {},
      borderColor: {},
      colors: {},
      elementsBackgroundColor: {},
      fontColorOverlay: {},
      headingType: {},
      indents: {},
      screenBackgroundColor: {},
      typography: {},
    },
    layout: {
      value: Layout.Desktop,
      rotated: false,
    },
  },
  user: DEFAULT_USER,
};

export const mockScreen: Screen = {
  id: 1,
  buoyancy: 0,
  image: null,
  project: 1,
  name: 'Mock Screen',
  status: 'in progress',
  screenscenario: [],
  element: '1',
  screenData: {
    uiFramework: NOT_SELECTED_FRAMEWORK,
    freeCanvas: false,
    editableScreenUser: [],
  },
};

export const mockRootElement: StateElement = {
  id: '1',
  type: 'root',
  styles: {
    classNames: ['root'],
    ownStyles: {},
    pseudoClassStyles: {},
  },
  parameters: {
    freeCanvas: {
      ...defaultFreeCanvasParams,
      width: 50,
      height: 50,
    },
    group: ElementGroup.NONE,
    layouts: DEFAULT_LAYOUT_LIST,
  },
  children: ['2'],
  buoyancy: 0,
  image: null,
  name: 'Root',
  shared: false,
};

export const mockStateElement: StateElement = {
  id: '2',
  type: 'paragraph',
  styles: {
    classNames: ['paragraph'],
    ownStyles: {},
    pseudoClassStyles: {},
  },
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: defaultFreeCanvasParams,
    group: ElementGroup.TYPOGRAPHY,
    textContent:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Id labore error ipsum laboriosam necessitatibus aperiam facere aut quo quibusdam, possimus quia odit placeat nostrum, similique pariatur corporis nobis sint rerum laborum architecto natus! Aut illum a minus cumque iste, quibusdam corporis atque odit magnam impedit esse possimus perspiciatis culpa non id tempore fugiat molestiae eos dolorem, labore maiores ratione? Sequi tenetur porro enim reprehenderit amet accusamus eos itaque saepe quidem quod, sit vero ab recusandae vitae, facere nobis cumque minima libero aut quos nihil labore eius. Soluta doloremque mollitia nihil voluptatibus, nostrum commodi eaque similique ipsam ad libero at tenetur.',
  },
  children: [],
  buoyancy: 0,
  image: null,
  name: 'paragraph',
  parent: '1',
  shared: false,
};

export const mockUserData: UserData = {
  isActive: true,
  dateJoined: new Date(),
  email: 'test@mail.test',
  firstName: 'John',
  lastName: 'Doe',
  id: 777,
  password: 'testpasswordencrypted',
  username: 'testuser',
  profile: {
    role: 'STAFF',
    hourlyRate: 0,
    approved: true,
    avatar: null,
    id: 888,
    experienced: Experience.EXPERIENCED,
    parameters: {
      avatarCrop: '',
      profileDataParameters: {
        autoSwitchTabs: false,
        dropTargetBordersMode: true,
      },
    },
  },
};

export const mockVIAState = {
  blockType: NNBlockType.WEBPAGE,
  resultId: '-1',
  viaData: {},
  annotatedElementId: mockStateElement.id,
  enabled: true,
  regions: {
    fdict: {
      '7343f00c-4ec0-4e71-8a07-ec1f8820d489': {
        shape_attributes: {
          name: 'rect',
          x: 99,
          y: 52,
          width: 187,
          height: 37,
        },
        region_attributes: {
          'HTML element': 'ocrtext',
        },
        id: '7343f00c-4ec0-4e71-8a07-ec1f8820d489',
        layer: 1,
      },
    },
  },
  activeRegionId: '',
  annotatedImageFile: null,
  copiedRegion: null,
} as unknown as ProjectEditState['VIAMode'];

export const mockMarketplace: Marketplace = {
  id: 1,
  name: 'Mock Project',
  status: 'in progress',
  created: new Date(0),
  updated: new Date(0),
  projectscreen: [],
  projectTrelloJSON: null,
  TemplateLoader: false,
  tags: [],
  marketplaceData: {
    classes: [],
    uiFramework: NOT_SELECTED_FRAMEWORK,
    defaultStyles: {
      accentColor: {},
      border: {},
      borderColor: {},
      colors: {},
      elementsBackgroundColor: {},
      fontColorOverlay: {},
      headingType: {},
      indents: {},
      screenBackgroundColor: {},
      typography: {},
    },
    layout: {
      value: Layout.Desktop,
      rotated: false,
    },
  },
  user: DEFAULT_USER,
};
export const mockInitialState: AppReduxState = {
  user: initialUserState,
  project: {
    data: initialData,
    edit: initialEdit,
    communication: initialCommunication,
    control: initialControl,
    ui: initialUi,
  },
  router: {
    action: 'POP',
    location: {
      hash: '',
      key: '',
      pathname: '',
      search: '',
      state: '',
    },
  },
  notification: {
    notifications: [],
  },
  permissions: initialPermissions,
  marketplace: {
    data: initialmarketplaceData,
  },
};

export const mockState: AppReduxState = {
  ...mockInitialState,
  user: {
    ...mockInitialState.user,
    userData: mockUserData,
  },
  project: {
    ...mockInitialState.project,
    data: {
      ...mockInitialState.project.data,
      projectsData: {
        ...mockInitialState.project.data.projectsData,
        results: {
          [mockProject.id]: mockProject,
        },
      },
      elements: {
        [mockRootElement.id]: mockRootElement,
        [mockStateElement.id]: mockStateElement,
      },
      screens: {
        [mockScreen.id]: mockScreen,
      },
    },
    edit: {
      ...mockInitialState.project.edit,
      currentProjectId: mockProject.id,
      currentScreenId: mockScreen.id,
    },
  },
  marketplace: {
    ...mockInitialState.marketplace,
    data: {
      ...mockInitialState.marketplace.data,
      marketplaceData: {
        ...mockInitialState.marketplace.data.marketplaceData,
        results: {
          [mockMarketplace.id]: mockMarketplace,
        },
      },
    },
  },
};

const getTestId = () => generateRandomInteger(1, 9999);

export const createMockProject = (): Project => ({
  id: getTestId(),
  name: 'test project',
  status: 'pending',
  projectscreen: [],
  projectTrelloJSON: null,
  projectLoader: true,
  created: new Date(),
  updated: new Date(),
  tags: [],
  projectData: {
    classes: [],
    uiFramework: NOT_SELECTED_FRAMEWORK,
    defaultStyles: {
      accentColor: {},
      border: {},
      borderColor: {},
      colors: {},
      elementsBackgroundColor: {},
      fontColorOverlay: {},
      headingType: {},
      indents: {},
      screenBackgroundColor: {},
      typography: {},
    },
    layout: {
      value: Layout.Desktop,
      rotated: false,
    },
  },
  user: DEFAULT_USER,
});

export const createAssetListMock = (): AssetsList => ({
  created: new Date(),
  id: '9999',
  modified: new Date(),
  name: 'Project assets',
  projectId: '715',
});

export const createMasterScreenMock = (projectId: number): Screen => ({
  buoyancy: 0,
  element: '99999',
  id: getTestId(),
  image: null,
  name: 'Master Screen',
  project: projectId,
  screenData: {
    uiFramework: NOT_SELECTED_FRAMEWORK,
    freeCanvas: false,
    editableScreenUser: [],
  },
  screenscenario: [],
  status: 'pending',
});

export const createScreenMock = (
  projectId: number,
  buoyancy: number = 1,
): Screen => ({
  buoyancy,
  element: '99999',
  id: getTestId(),
  image: null,
  name: 'Screen 1',
  project: projectId,
  screenData: {
    uiFramework: NOT_SELECTED_FRAMEWORK,
    freeCanvas: false,
    editableScreenUser: [],
  },
  screenscenario: [],
  status: 'pending',
});

export const createProjectWithScreensMock = (
  projectId: number,
): ProjectWithScreens => ({
  created: new Date(),
  id: projectId,
  name: 'test name',
  projectTrelloJSON: null,
  projectData: {
    classes: [],
    uiFramework: NOT_SELECTED_FRAMEWORK,
    defaultStyles: {
      accentColor: {},
      border: {},
      borderColor: {},
      colors: {},
      elementsBackgroundColor: {},
      fontColorOverlay: {},
      headingType: {},
      indents: {},
      screenBackgroundColor: {},
      typography: {},
    },
    layout: {
      value: Layout.Desktop,
      rotated: false,
    },
  },
  projectLoader: false,
  tags: [],
  projectscreen: [
    createMasterScreenMock(projectId),
    createScreenMock(projectId),
  ],
  status: 'pending',
  updated: new Date(),
  user: DEFAULT_USER,
});

export const projectSearchParameterMock: [
  ProjectsSearchParameter,
  string | DateRange,
] = [ProjectsSearchParameter.name, 'text search'];

export const templateSearchParameterMock: [
  TemplatesSearchParameter,
  string | DateRange,
] = [TemplatesSearchParameter.name, 'text search'];

export const projectScreensMock = [
  createMasterScreenMock(getTestId()),
  createScreenMock(getTestId()),
];

export const beforeSagaTest = () => {
  logger.error = jest.fn();
  // stub current date and random value generator to pass enqueueSnackbar equality
  MockDate.set('2000-11-22');
  jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
};
