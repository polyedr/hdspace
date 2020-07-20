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
    activeItem: DEFAULT_ACTIVE_ITEM,
    isAddElementsModalOpened: false,
    itemToCopyInfo: null,
    savedElementsValues: {},
  },
  edit: {
    // @ts-ignore TODO: figure out this type
    currentProject: DEFAULT_PROJECT,
    currentScreen: DEFAULT_SCREEN,
    screens: [],
    scenarios: {},
    scenarioElements: {},
    rootElement: DEFAULT_ROOT,
    modifyElements: [],
    notification: null,
  },
  communication: {
    loader: false,
    listProjectLoader: false,
    screenLoader: false,
    projectLoader: false,
    scenarioLoader: false,
  },
  control: {},
};
