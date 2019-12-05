import {
  DEFAULT_LIB_ELEMENTS,
  DEFAULT_PROJECT,
  DEFAULT_SCREEN,
} from '$constants/defaultParams';

import * as T from './types';

export const initial: T.ReduxState = {
  data: {
    libraryElements: DEFAULT_LIB_ELEMENTS,
    listProject: [],
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
