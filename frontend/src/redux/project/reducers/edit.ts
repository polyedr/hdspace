import * as R from 'ramda';
import { initialEdit } from '../initial';
import * as T from '../types';
import { TYPES } from '$constants/actions';

export const editReducer = (
  state: T.ProjectEditState = initialEdit,
  action: T.Action,
): T.ProjectEditState => {
  switch (action.type) {
    case TYPES.CLEAN_AFTER_PREV_SCREEN: {
      return {
        ...state,
        ...R.pick(
          ['currentScreen', 'scenarios', 'scenarioElements', 'modifyElements'],
          initialEdit,
        ),
      };
    }

    case TYPES.SET_PROJECT: {
      return { ...state, currentProject: action.payload.project };
    }

    case TYPES.SET_NOTIFICATION: {
      return { ...state, notification: action.payload };
    }

    case TYPES.REMOVE_NOTIFICATION: {
      return { ...state, notification: null };
    }

    case TYPES.SET_SCREEN: {
      return { ...state, currentScreen: action.payload.screenId };
    }

    case TYPES.SET_SCENARIOS: {
      return { ...state, scenarios: action.payload.scenarios };
    }

    case TYPES.SET_SCENARIO_ELEMENTS: {
      return { ...state, scenarioElements: action.payload.elements };
    }

    case TYPES.SET_MODIFY_ELEMENTS: {
      return { ...state, modifyElements: action.payload.elements };
    }

    case TYPES.UPLOAD_IMAGE_FOR_NN_SUCCESS: {
      return { ...state, uploadedImageInfo: action.payload };
    }

    case TYPES.LOGOUT: {
      return {
        ...initialEdit,
      };
    }

    default:
      return state;
  }
};
