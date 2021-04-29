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
  bordersEnabled: true,
  currentDropTargetParams: null,
  canCreateGroup: false,
  layout: {
    value: Layout.Desktop,
    rotated: false,
  },
  editorDocument: null,
  newScreenModalOpen: false,
  sidebar: {
    open: false,
    iframe: null,
    host: '',
  },
  tabsAutoSwitch: false,
};

export const initialEdit: ProjectEditState = {
  currentProjectId: -1,
  currentScreenId: -1,
  activeElementId: '-1',
  preSelectedElementId: null,
  masterSourceElementId: null,
  hoveredElementId: '-1',
  masterScreenId: null,
  masterCoreElementId: '-1',
  masterGroupsElementId: '-1',
  selectedAssetListId: null,
  selectedElementsIds: [],
  VIAMode: {
    enabled: true,
    regions: {
      '2cd3dadb-333b-47f0-b918-e79ee959eb3e': {
        shape_attributes: {
          name: 'rect',
          x: 161,
          y: 77,
          width: 209,
          height: 27,
        },
        region_attributes: {
          'HTML element': 'ocrtext',
        },
        id: '2cd3dadb-333b-47f0-b918-e79ee959eb3e',
        layer: 5,
      },
      '8ded0d9c-7172-435c-8ea1-ee5d2e655721': {
        shape_attributes: {
          name: 'rect',
          x: 371,
          y: 81,
          width: 33,
          height: 23,
        },
        region_attributes: {
          'HTML element': 'ocrtext',
        },
        id: '8ded0d9c-7172-435c-8ea1-ee5d2e655721',
        layer: 4,
      },
      'a79e63fb-bab7-4714-b182-7aa785c32f98': {
        shape_attributes: {
          name: 'rect',
          x: 146,
          y: 158,
          width: 61,
          height: 30,
        },
        region_attributes: {
          'HTML element': 'image',
        },
        id: 'a79e63fb-bab7-4714-b182-7aa785c32f98',
        layer: 3,
      },
      '680921e7-513d-459e-9320-fe936f821a55': {
        shape_attributes: {
          name: 'rect',
          x: 146,
          y: 82,
          width: 13,
          height: 13,
        },
        region_attributes: {
          'HTML element': 'image',
        },
        id: '680921e7-513d-459e-9320-fe936f821a55',
        layer: 2,
      },
      '186db29b-b696-4384-865f-52c04ca8ed62': {
        shape_attributes: {
          name: 'rect',
          x: 146,
          y: 44,
          width: 165,
          height: 30,
        },
        region_attributes: {
          'HTML element': 'image',
        },
        id: '186db29b-b696-4384-865f-52c04ca8ed62',
        layer: 1,
      },
      'a74796bd-994f-43ea-9fc1-d634255122eb': {
        shape_attributes: {
          name: 'rect',
          x: 146,
          y: 5,
          width: 165,
          height: 30,
        },
        region_attributes: {
          'HTML element': 'image',
        },
        id: 'a74796bd-994f-43ea-9fc1-d634255122eb',
        layer: 0,
      },
    },
    activeRegionId: '',
    annotatedElementId: '',
    annotatedImageURL: '',
    copiedRegion: null,
  },
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
  importLoader: false,
};

export const initialControl: ProjectControlState = {
  history: [],
  currentHistoryRecord: -1,
};
