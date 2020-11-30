import { initialUserState } from '@Redux/user/reducer';
import {
  initialCommunication,
  initialControl,
  initialData,
  initialEdit,
  initialUi,
} from '@Redux/project/initial';
import { AppReduxState } from '@Redux/types';
import { Project, StateElement, Screen } from '../../types';

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
};

export const mockRootElement: StateElement = {
  id: '1',
  type: 'root',
  styles: {
    classNames: ['root'],
    ownStyles: {},
  },
  parameters: {},
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
    textContent:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Id labore error ipsum laboriosam necessitatibus aperiam facere aut quo quibusdam, possimus quia odit placeat nostrum, similique pariatur corporis nobis sint rerum laborum architecto natus! Aut illum a minus cumque iste, quibusdam corporis atque odit magnam impedit esse possimus perspiciatis culpa non id tempore fugiat molestiae eos dolorem, labore maiores ratione? Sequi tenetur porro enim reprehenderit amet accusamus eos itaque saepe quidem quod, sit vero ab recusandae vitae, facere nobis cumque minima libero aut quos nihil labore eius. Soluta doloremque mollitia nihil voluptatibus, nostrum commodi eaque similique ipsam ad libero at tenetur.',
    zIndex: 0,
    left: 0,
    top: 0,
  },
  children: [],
  buoyancy: 0,
  image: null,
  name: 'paragraph',
  parent: '1',
  shared: false,
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
