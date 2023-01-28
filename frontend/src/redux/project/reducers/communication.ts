import TYPES from '../../actionTypes';
import { initialCommunication } from '../initial';
import { Action, ProjectCommunicationState } from '../../types';

const communicationReducer = (
  state: ProjectCommunicationState = initialCommunication,
  action: Action,
): ProjectCommunicationState => {
  switch (action.type) {
    case TYPES.SET_UPDATE_IMAGE_LOADER: {
      return {
        ...state,
        updateImageLoader: action.payload.active,
      };
    }

    case TYPES.SET_SCREEN_LOADER: {
      return {
        ...state,
        screenLoader: action.payload.active,
      };
    }

    case TYPES.SET_MASTER_SCREEN_LOADER: {
      return {
        ...state,
        masterScreenLoader: action.payload.active,
      };
    }

    case TYPES.SET_PROJECT_LOADER: {
      return {
        ...state,
        projectLoader: action.payload.active,
      };
    }

    case TYPES.SET_PROJECT_CREATE_LOADER: {
      return {
        ...state,
        projectCreateLoader: action.payload.active,
      };
    }

    case TYPES.SET_ANALYZER_LOADER: {
      return {
        ...state,
        analyzerLoader: action.payload.active,
      };
    }

    case TYPES.SET_SCREEN_CREATE_LOADER: {
      return {
        ...state,
        screenCreateLoader: action.payload,
      };
    }

    case TYPES.SET_ASSETS_LISTS_LOADER: {
      return {
        ...state,
        assetsListsLoader: action.payload.active,
      };
    }

    case TYPES.LOGOUT: {
      return {
        ...initialCommunication,
      };
    }

    case TYPES.SET_VALUE_IMPORT_LOADER: {
      return {
        ...state,
        importLoader: action.payload,
      };
    }

    case TYPES.SET_IMPORT_VALUE: {
      return {
        ...state,
        importValue: {
          notSupportedTag: action?.payload?.notSupportedTag,
          canvasData: action?.payload?.canvasData,
          importSuccessRawData: action?.payload?.importSuccessRawData,
          error: action.payload?.error,
        },
      };
    }

    default:
      return state;
  }
};

export default communicationReducer;
