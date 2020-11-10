import * as T from './types';
import { RightPanelTab, SCREEN_FORMATS } from '../../constants/defaultParams';

export const initialData: T.ProjectDataState = {
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

export const initialUi: T.ProjectUiState = {
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

export const initialEdit: T.ProjectEditState = {
  currentProjectId: -1,
  currentScreenId: -1,
  activeElementId: '-1',
  hoveredElementId: '-1',
  notification: null,
  freeCanvas: {
    enabled: false,
    lastElements: {},
  },
};

export const initialCommunication: T.ProjectCommunicationState = {
  loader: false,
  projectListLoader: false,
  screenLoader: false,
  projectLoader: false,
  scenarioLoader: false,
  analyzerLoader: false,
};

export const initialControl: T.ProjectControlState = {
  undoActions: [],
  redoActions: [],
  history: [],
  groupActionsUp: false,
};
