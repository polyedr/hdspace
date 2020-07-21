import * as R from 'ramda';
import { initialEdit } from '../initial';
import * as T from '../types';

export const editReducer = (state: T.ProjectEditState = initialEdit, action: T.Action): T.ProjectEditState => {
  switch (action.type) {
    case 'PROJECTS:CLEAN_AFTER_PREV_SCREEN': {
      return {
        ...state,
        ...R.pick(
          ['currentScreen', 'scenarios', 'scenarioElements', 'modifyElements'],
          initialEdit,
        ),
      };
    }

    case 'PROJECTS:SET_PROJECT': {
      return { ...state, currentProject: action.payload.project };
    }

    case 'PROJECTS:SET_NOTIFICATION': {
      return { ...state, notification: action.payload };
    }

    case 'PROJECTS:REMOVE_NOTIFICATION': {
      return { ...state, notification: null };
    }

    case 'PROJECTS:SET_SCREEN': {
      return { ...state, currentScreen: action.payload.screen };
    }

    case 'PROJECTS:SET_SCREENS': {
      return { ...state, screens: action.payload.screens };
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
};