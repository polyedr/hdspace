import { initialUserState } from '@Redux/user/reducer';
import {
  initialCommunication,
  initialControl,
  initialData,
  initialEdit,
  initialUi,
} from '@Redux/project/initial';
import { AppReduxState, ProjectEditState } from '@Redux/types';
import { defaultFreeCanvasParams } from '@Domain/core';
import { DEFAULT_LAYOUT_LIST } from '@Constants/defaultParams';
import {
  Project,
  StateElement,
  Screen,
  UserData,
  ElementGroup,
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
  },
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

export const mockVIAState = {
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
    },
    '25bf7d6f-1a23-4287-be6a-c50f4584f34b': {
      shape_attributes: {
        name: 'rect',
        x: 89,
        y: 126,
        width: 77,
        height: 22,
      },
      region_attributes: {
        'HTML element': 'ocrtext',
      },
      id: '25bf7d6f-1a23-4287-be6a-c50f4584f34b',
    },
    'ddc4ac0d-21e4-40b3-9d03-c1d73e8d9bb3': {
      shape_attributes: {
        name: 'rect',
        x: 60,
        y: 179,
        width: 102,
        height: 25,
      },
      region_attributes: {
        'HTML element': 'ocrtext',
      },
      id: 'ddc4ac0d-21e4-40b3-9d03-c1d73e8d9bb3',
    },
    'a29528c6-f054-4729-9494-0330eb828622': {
      shape_attributes: {
        name: 'rect',
        x: 133,
        y: 313,
        width: 119,
        height: 24,
      },
      region_attributes: {
        'HTML element': 'ocrtext',
      },
      id: 'a29528c6-f054-4729-9494-0330eb828622',
    },
    'fe4e186b-76ef-44aa-ae0f-3c0c4111e972': {
      shape_attributes: {
        name: 'rect',
        x: 16,
        y: 14,
        width: 352,
        height: 335,
      },
      region_attributes: {
        'HTML element': 'input',
      },
      id: 'fe4e186b-76ef-44aa-ae0f-3c0c4111e972',
    },
    'e3661b15-c7e8-49e8-bc86-9e47a90e533c': {
      shape_attributes: {
        name: 'rect',
        x: 52,
        y: 227,
        width: 280,
        height: 42,
      },
      region_attributes: {
        'HTML element': 'button',
      },
      id: 'e3661b15-c7e8-49e8-bc86-9e47a90e533c',
    },
    '66d1288c-ab98-4892-984f-2c675aeca58c': {
      shape_attributes: {
        name: 'rect',
        x: 52,
        y: 172,
        width: 280,
        height: 40,
      },
      region_attributes: {
        'HTML element': 'input',
      },
      id: '66d1288c-ab98-4892-984f-2c675aeca58c',
    },
    'a6a0cd94-8c4b-41ad-9f26-40004276d99d': {
      shape_attributes: {
        name: 'rect',
        x: 52,
        y: 117,
        width: 280,
        height: 40,
      },
      region_attributes: {
        'HTML element': 'input',
      },
      id: 'a6a0cd94-8c4b-41ad-9f26-40004276d99d',
    },
    'c83a3a35-cfcb-4dbc-8330-b1cf1ace5032': {
      shape_attributes: {
        name: 'rect',
        x: 215,
        y: 58,
        width: 12,
        height: 19,
      },
      region_attributes: {
        'HTML element': 'image',
      },
      id: 'c83a3a35-cfcb-4dbc-8330-b1cf1ace5032',
    },
  },
  activeRegionId: '',
} as ProjectEditState['VIAMode'];
