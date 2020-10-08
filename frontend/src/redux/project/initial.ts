import * as T from './types';

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
    currentPage: 1,
  },
};

export const initialUi: T.ProjectUiState = {
  editableStyles: 'ownStyles',
  isAddElementsModalOpened: false,
  itemToCopyInfo: null,
  savedElementsValues: {},
  showContainersBorders: false,
  currentDropTargetParams: null,
  borderedElementsRef: {},
};

export const initialEdit: T.ProjectEditState = {
  currentProjectId: -1,
  currentScreenId: -1,
  activeElementId: '-1',
  notification: null,
};

export const initialCommunication: T.ProjectCommunicationState = {
  loader: false,
  projectListLoader: false,
  screenLoader: false,
  projectLoader: false,
  scenarioLoader: false,
};

export const initialControl: T.ProjectControlState = {
  undoActions: [],
  redoActions: [],
  history: [],
  groupActionsUp: false,
};
