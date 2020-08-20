import * as T from '../types';
import { initialCommunication } from '$redux/project/initial';
import { TYPES } from '$constants/actions';

export const communicationReducer = (
  state: T.ProjectCommunicationState = initialCommunication,
  action: T.Action,
): T.ProjectCommunicationState => {
  switch (action.type) {
    case TYPES.SET_PROJECT_LIST_LOADER: {
      return {
        ...state,
        projectListLoader: action.payload.active,
      };
    }

    case TYPES.SET_LOADER: {
      return {
        ...state,
        loader: action.payload.active,
      };
    }

    case TYPES.SET_SCREEN_LOADER: {
      return {
        ...state,
        screenLoader: action.payload.active,
      };
    }

    case TYPES.SET_PROJECT_LOADER: {
      return {
        ...state,
        projectLoader: action.payload.active,
      };
    }

    case TYPES.SET_SCENARIO_LOADER: {
      return {
        ...state,
        scenarioLoader: action.payload.active,
      };
    }

    case TYPES.LOAD_PROJECTS_SUCCESS: {
      return {
        ...state,
        initialProjectLoadDone: true,
      };
    }

    case TYPES.LOGOUT: {
      return {
        ...initialCommunication,
      };
    }

    default:
      return state;
  }
};
