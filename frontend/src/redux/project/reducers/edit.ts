import * as R from 'ramda';
import { initial } from '../initial';
import * as T from '../types';

export function editReducer(state: T.ReduxState['edit'] = initial.edit, action: T.Action): T.ReduxState['edit'] {
  switch (action.type) {
    case 'PROJECTS:UPDATE_ELEMENTS_TREE': {
      return {
        ...state,
        rootElement: action.payload.root,
      };
    };

    case 'PROJECTS:CLEAN_AFTER_PREV_SCREEN': {
      return {
        ...state,
        ...R.pick(
          ['currentScreen', 'scenarios', 'scenarioElements', 'modifyElements'],
          initial.edit,
        ),
      };
    }

    case 'PROJECTS:SET_PROJECT': {
      return { ...state, currentProject: action.payload.project };
    }

    case 'PROJECTS:SET_LIST_PROJECT_LOADER': {
      return { ...state, listProjectLoader: action.payload.active };
    }

    case 'PROJECTS:SET_LOADER': {
      return { ...state, loader: action.payload.active };
    }

    case 'PROJECTS:CLEAN_AFTER_PREV_SCREEN': {
      return {
        ...state,
        scenarios: {},
        scenarioElements: {},
        modifyElements: [],
      };
    }

    case 'PROJECTS:SET_SCREEN': {
      return { ...state, currentScreen: action.payload.screen };
    }

    case 'PROJECTS:SET_SCREENS': {
      return { ...state, screens: action.payload.screens };
    }

    case 'PROJECTS:SET_PROJECT_LOADER': {
      return { ...state, currentProject: { ...state.currentProject, projectLoader: action.payload.active } };
    }

    case 'PROJECTS:SET_SCREEN_LOADER': {
      return { ...state, currentScreen: { ...state.currentScreen, screenLoader: action.payload.active } };
    }

    case 'PROJECTS:SET_SCENARIO_LOADER': {
      return { ...state, scenarioLoader: action.payload.active };
    }

    case 'PROJECTS:SET_SCENARIOS': {
      return { ...state, scenarios: action.payload.scenarios };
    }

    case 'PROJECTS:SET_SCENARIO_ELEMENTS': {
      return { ...state, scenarioElements: action.payload.elements };
    }

    case 'PROJECTS:SET_MODIFY_ELEMENTS': {
      return { ...state, modifyElements: action.payload.elements };
    }

    case 'PROJECTS:UPLOAD_IMAGE_FOR_NN_SUCCESS': {
      return { ...state, uploadedImageInfo: action.payload };
    }
    default: return state;
  }
}
