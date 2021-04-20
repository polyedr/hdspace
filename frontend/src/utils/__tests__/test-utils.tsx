import { initialUserState } from '@Redux/user/initial';
import MockDate from 'mockdate';
import {
  initialCommunication,
  initialControl,
  initialData,
  initialEdit,
  initialUi,
} from '@Redux/project/initial';
import initialPermissions from '@Redux/permissions/initial';
import { AppReduxState, ProjectEditState } from '@Redux/types';
import { defaultFreeCanvasParams } from '@Domain/core';
import { DEFAULT_LAYOUT_LIST, DEFAULT_USER } from '@Constants/defaultParams';
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
  DateRange,
} from '../../types';

export const mockProject: Project = {
  id: 1,
  name: 'Mock Project',
  status: 'in progress',
  created: new Date(0),
  updated: new Date(0),
  projectscreen: [],
  projectLoader: false,
  projectData: {
    classes: [],
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
  screen_data_json: '{}',
};

export const mockRootElement: StateElement = {
  id: '1',
  type: 'root',
  styles: {
    classNames: ['root'],
    ownStyles: {},
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
  },
};

export const mockVIAState = {
  annotatedElementId: mockStateElement.id,
  enabled: true,
  regions: {
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
  activeRegionId: '',
  annotatedImageURL: '',
  copiedRegion: null,
} as ProjectEditState['VIAMode'];

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
};

const randomInteger = (max, min) =>
  Math.floor(Math.random() * (max - min)) + min;

const testId = randomInteger(9999, 1);
export const createMockProject = (): Project => ({
  id: testId,
  name: 'test project',
  status: 'pending',
  projectscreen: [],
  projectLoader: true,
  created: new Date(),
  updated: new Date(),
  projectData: {
    classes: [],
  },
  user: DEFAULT_USER,
});

export const createAssetListMock = (): AssetsList => ({
  created: new Date(),
  id: '9999',
  images: [],
  modified: new Date(),
  name: 'Project assets',
  projectId: '715',
});

export const createMasterScreenMock = (projectId: number): Screen => ({
  buoyancy: 0,
  element: '99999',
  id: testId,
  image: null,
  name: 'Master Screen',
  project: projectId,
  screen_data_json: {},
  screenscenario: [],
  status: 'pending',
});

export const createScreenMock = (projectId: number): Screen => ({
  buoyancy: 1,
  element: '99999',
  id: testId,
  image: null,
  name: 'Screen 1',
  project: projectId,
  screen_data_json: {},
  screenscenario: [],
  status: 'pending',
});

export const projectWithScreensMock = (
  projectId: number,
): ProjectWithScreens => ({
  created: new Date(),
  id: projectId,
  name: 'test name',
  projectData: {
    classes: [],
  },
  projectLoader: false,
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

export const projectScreensMock = [
  createMasterScreenMock(testId),
  createScreenMock(testId),
];

export const prepareSagaTest = () => {
  console.error = jest.fn();
  // stub current date and random value generator to pass enqueueSnackbar equality
  MockDate.set('2000-11-22');
  jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
};
