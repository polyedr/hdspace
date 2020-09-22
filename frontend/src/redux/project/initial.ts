import * as T from './types';

export const initialData: T.ProjectDataState = {
  projects: {},
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
  draggableItemId: null,
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
  initialProjectLoadDone: false,
};

export const initialControl: T.ProjectControlState = {
  undoActions: [],
  redoActions: [],
  history: [],
  groupActionsUp: false,
};
