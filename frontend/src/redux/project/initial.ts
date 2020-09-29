import * as T from './types';

export const initialData: T.ProjectDataState = {
  projectsData: {
    results: {},
    pageSize: 3,
    loading: false,
    currentPage: 0,
    count: 0,
  },
  screens: {},
  elements: {},
};

export const initialUi: T.ProjectUiState = {
  editableStyles: 'ownStyles',
  isAddElementsModalOpened: false,
  itemToCopyInfo: null,
  savedElementsValues: {},
  showContainersBorders: false,
  customLibraryElements: {},
  borderedElementsRect: {},
  currentDropTargetId: null,
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
