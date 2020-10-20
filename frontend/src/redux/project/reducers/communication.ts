import * as T from '../types';
import TYPES from '../../../constants/actions';
import { initialCommunication } from '../initial';

const communicationReducer = (
  state: T.ProjectCommunicationState = initialCommunication,
  action: T.Action,
): T.ProjectCommunicationState => {
  switch (action.type) {
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

    case TYPES.SET_ANALYZER_LOADER: {
      return {
        ...state,
        analyzerLoader: action.payload.active,
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

export default communicationReducer;
