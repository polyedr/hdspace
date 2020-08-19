import {
  DEFAULT_PROJECT,
  DEFAULT_ACTIVE_ITEM,
  DEFAULT_ROOT,
} from '$constants/defaultParams';

import * as T from './types';

export const initialData: T.ProjectDataState = {
  libraryElements: {} as any, // will be loaded on app start
  listProject: [],
  screens: [],
};

export const initialUi: T.ProjectUiState = {
  activeItem: DEFAULT_ACTIVE_ITEM,
  editableStyles: 'ownStyles',
  isAddElementsModalOpened: false,
  itemToCopyInfo: null,
  savedElementsValues: {},
  showContainersBorders: false,
};

export const initialEdit: T.ProjectEditState = {
  currentProject: DEFAULT_PROJECT,
  currentScreen: -1,
  scenarios: {},
  scenarioElements: {},
  modifyElements: [],
  notification: null,
};

export const initialCommunication: T.ProjectCommunicationState = {
  loader: false,
  listProjectLoader: false,
  screenLoader: false,
  projectLoader: false,
  scenarioLoader: false,
  initialProjectLoadDone: false,
};

export const initialControl: T.ProjectControlState = {
  rootElement: DEFAULT_ROOT,
  undoActions: [],
  redoActions: [],
  history: [],
  sourceAction: null,
  remoteMove: false,
  groupActionsUp: false,
};
