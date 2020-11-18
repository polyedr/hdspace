import { RightPanelTab, SCREEN_FORMATS } from '../../types';
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
};

export const initialUi: ProjectUiState = {
  editableStyles: 'ownStyles',
  rightPanel: {
    activeTab: RightPanelTab.ELEMENTS,
  },
  itemToCopyInfo: null,
  savedElementsValues: {},
  showContainersBorders: false,
  currentDropTargetParams: null,
  borderedElementsRef: {},
  screenFormat: {
    format: SCREEN_FORMATS.Desktop,
    rotated: false,
  },
};

export const initialEdit: ProjectEditState = {
  currentProjectId: -1,
  currentScreenId: -1,
  activeElementId: '-1',
  hoveredElementId: '-1',
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
  scenarioLoader: false,
  analyzerLoader: false,
};

export const initialControl: ProjectControlState = {
  undoActions: [],
  redoActions: [],
  history: [],
  groupActionsUp: false,
};
