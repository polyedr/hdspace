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
  newScreenModalOpen: false,
  sidebar: {
    open: false,
    iframe: null,
    host: '',
  },
  enableTabsAutoSwitch: false,
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
    enabled: false,
    regions: {},
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
