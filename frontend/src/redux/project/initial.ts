import * as T from './types';
import { DEFAULT_ACTIVE_ITEM } from '../../constants/defaultParams';

export const initialData: T.ProjectDataState = {
  libraryElements: {} as any, // will be loaded on app start
  projectList: [],
  screens: [],
};

export const initialUi: T.ProjectUiState = {
  activeItem: DEFAULT_ACTIVE_ITEM,
  editableStyles: 'ownStyles',
  isAddElementsModalOpened: false,
  itemToCopyInfo: null,
  savedElementsValues: {},
  showContainersBorders: false,
  customLibraryElements: {},
};

export const initialEdit: T.ProjectEditState = {
  currentProjectId: -1,
  currentScreenId: -1,
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
  remoteMove: false,
  groupActionsUp: false,
};
