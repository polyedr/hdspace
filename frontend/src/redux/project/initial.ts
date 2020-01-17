import {
  DEFAULT_PROJECT,
  DEFAULT_SCREEN,
  DEFAULT_ACTIVE_ITEM,
} from '$constants/defaultParams';

import * as T from './types';

export const initial: T.ReduxState = {
  data: {
    libraryElements: {},
    listProject: [],
  },
  ui: {
    activeItem: DEFAULT_ACTIVE_ITEM,
    isAddElementsModalOpened: false,
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
