import * as T from '../types';
import { initial } from '$redux/project/initial';


export const communicationReducer = (state: T.ReduxState['communication'] = initial.communication, action: T.Action) => {
  switch (action.type) {
    case 'PROJECTS:SET_LIST_PROJECT_LOADER': {
      return {
        ...state,
        listProjectLoader: action.payload.active
      };
    }

    case 'PROJECTS:SET_LOADER': {
      return {
        ...state,
        loader: action.payload.active
      };
    }

    case 'PROJECTS:SET_SCREEN_LOADER': {
      return {
        ...state,
        screenLoader: action.payload.active
      };
    }

    case 'PROJECTS:SET_PROJECT_LOADER': {
      return {
        ...state,
        projectLoader: action.payload.active
      };
    }

    case 'PROJECTS:SET_SCENARIO_LOADER': {
      return {
        ...state,
        scenarioLoader: action.payload.active
      };
    }

    default:
      return state;
  }
};