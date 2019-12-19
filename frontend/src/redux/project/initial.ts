import {
  DEFAULT_LIB_ELEMENTS,
  DEFAULT_PROJECT,
  DEFAULT_SCREEN,
  DEFAULT_ACTIVE_ITEM,
} from '$constants/defaultParams';

import * as T from './types';

export const initial: T.ReduxState = {
  data: {
    libraryElements: DEFAULT_LIB_ELEMENTS,
    listProject: [],
  },
  ui: {
    activeItem: DEFAULT_ACTIVE_ITEM,
  },
  edit: {
    currentProject: DEFAULT_PROJECT,
    currentScreen: DEFAULT_SCREEN,
    listProjectLoader: false,
    loader: false,
    scenarios: {},
    scenarioElements: {},
    modifyElements: [],
  },
  // communication: {},
};
