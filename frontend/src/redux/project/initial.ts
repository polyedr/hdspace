import {
  DEFAULT_PROJECT,
  DEFAULT_SCREEN,
  DEFAULT_ACTIVE_ITEM,
  DEFAULT_ROOT,
} from '$constants/defaultParams';

import * as T from './types';

export const initial: T.ReduxState = {
  data: {
    libraryElements: {} as any, // will be loaded on app start
    listProject: [],
  },
  ui: {
    editableStyles: 'idStyles',
    activeItem: DEFAULT_ACTIVE_ITEM,
    copiedStyles: null,
    showContainersBorders: false,
    isAddElementsModalOpened: false,
    itemToCopyInfo: null,
    savedElementsValues: {},
  },
  edit: {
    currentProject: DEFAULT_PROJECT,
    currentScreen: DEFAULT_SCREEN,
    screens: [],
    listProjectLoader: false,
    loader: false,
    scenarios: {},
    scenarioElements: {},
    rootElement: DEFAULT_ROOT,
    modifyElements: [],
    notification: null,
  },
  // communication: {},
};
