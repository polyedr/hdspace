import { ProjectsSearchParameter, Layout } from '@Src/types';
import {
  ProjectCommunicationState,
  ProjectControlState,
  ProjectDataState,
  ProjectEditState,
  ProjectUiState,
} from '../types';

export const initialData: ProjectDataState = {
  projectsData: {
    next: null,
    previous: null,
    parameter: [ProjectsSearchParameter.name, ''],
    results: {},
    pageSize: 10,
    loading: false,
  },
  screens: {},
  elements: {},
  customElementsData: {
    previous: null,
    next: null,
    results: [],
    loading: false,
    pageSize: 40,
  },
  elementInputs: {},
  assetLists: {
    previous: null,
    next: null,
    results: [],
    loading: false,
    pageSize: 40,
  },
  assetResults: {},
};

export const initialUi: ProjectUiState = {
  editableStyles: 'ownStyles',
  itemToCopyInfo: null,
  savedElementsValues: {},
  showContainersBorders: false,
  elementCanBeEdited: false,
  elementBeingEdited: false,
  bordersEnabled: true,
  currentDropTargetParams: null,
  canCreateGroup: false,
  layout: {
    value: Layout.Desktop,
    rotated: false,
  },
  editorDocument: null,
};

const mockVIAState = {
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

export const initialEdit: ProjectEditState = {
  currentProjectId: -1,
  currentScreenId: -1,
  activeElementId: '-1',
  hoveredElementId: '-1',
  masterScreenId: null,
  masterCoreElementId: '-1',
  masterGroupsElementId: '-1',
  selectedAssetListId: null,
  selectedElementsIds: [],
  VIAMode: /* {
    enabled: false,
    regions: {},
    activeRegionId: '',
  } */ mockVIAState,
  freeCanvas: {
    enabled: false,
    lastElements: {},
  },
};

export const initialCommunication: ProjectCommunicationState = {
  screenCreateLoader: false,
  updateImageLoader: false,
  screenLoader: false,
  masterScreenLoader: false,
  projectLoader: false,
  projectCreateLoader: false,
  analyzerLoader: false,
  assetsLoader: false,
};

export const initialControl: ProjectControlState = {
  history: [],
  currentHistoryRecord: -1,
};
