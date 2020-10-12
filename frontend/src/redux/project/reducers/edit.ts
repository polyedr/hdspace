import * as R from 'ramda';
import { initialEdit } from '../initial';
import * as T from '../types';
import TYPES from '../../../constants/actions';

const editReducer = (
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

    case TYPES.SET_CURRENT_PROJECT_ID: {
      return { ...state, currentProjectId: action.payload.projectId };
    }

    case TYPES.SET_NOTIFICATION: {
      return { ...state, notification: action.payload };
    }

    case TYPES.REMOVE_NOTIFICATION: {
      return { ...state, notification: null };
    }

    case TYPES.SET_CURRENT_SCREEN_ID: {
      return { ...state, currentScreenId: action.payload.screenId };
    }

    case TYPES.UPLOAD_IMAGE_FOR_NN_SUCCESS: {
      return { ...state, uploadedImageInfo: action.payload };
    }

    case TYPES.SET_ACTIVE_ELEMENT: {
      return { ...state, activeElementId: action.payload };
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

export default editReducer;
