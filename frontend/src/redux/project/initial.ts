import { ProjectsSearchParameter, Layout } from '@Src/types';
import MASTER_ELEMENTS_LIST from '@Components/Editor/MasterScreen/masterElementsList';
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
  masterScreen: {
    enabled: false,
    activeId: 'masterRoot',
    elements: MASTER_ELEMENTS_LIST,
  },
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

export const initialEdit: ProjectEditState = {
  currentProjectId: -1,
  currentScreenId: -1,
  activeElementId: '-1',
  hoveredElementId: '-1',
  selectedAssetListId: null,
  selectedElementsIds: [],
  freeCanvas: {
    enabled: false,
    lastElements: {},
  },
};

export const initialCommunication: ProjectCommunicationState = {
  screenCreateLoader: false,
  updateImageLoader: false,
  screenLoader: false,
  projectLoader: false,
  projectCreateLoader: false,
  analyzerLoader: false,
  assetsLoader: false,
};

export const initialControl: ProjectControlState = {
  undoActions: [],
  redoActions: [],
  history: [],
  groupActionsUp: false,
};
