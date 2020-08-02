import {
  DEFAULT_PROJECT,
  DEFAULT_SCREEN,
  DEFAULT_ACTIVE_ITEM,
  DEFAULT_ROOT,
} from '$constants/defaultParams';

import * as T from './types';

export const initialData: T.ProjectDataState = {
    libraryElements: {} as any, // will be loaded on app start
    listProject: [],
};

export const initialUi: T.ProjectUiState = {
  activeItem: DEFAULT_ACTIVE_ITEM,
  isAddElementsModalOpened: false,
  itemToCopyInfo: null,
  savedElementsValues: {},
  showContainersBorders: false,
};

export const initialEdit: T.ProjectEditState = {
  currentProject: DEFAULT_PROJECT,
  currentScreen: DEFAULT_SCREEN,
  screens: [],
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
};

export const initialControl: T.ProjectControlState = {
  rootElement: DEFAULT_ROOT,
  undoActions: [],
  redoActions: [],
  history: [],
  sourceAction: null,
  remoteMove: false,
  multi: false,
};