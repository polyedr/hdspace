import { initialData } from '../initial';
import * as T from '../types';
import TYPES from '$constants/actions';

function dataReducer(
  state: T.ProjectDataState = initialData,
  action: T.Action,
): T.ProjectDataState {
  switch (action.type) {
    case TYPES.LOAD_LIBRARY_ELEMENTS_SUCCESS: {
      return { ...state, libraryElements: action.payload.libraryElements };
    }

    case TYPES.LOAD_PROJECTS_SUCCESS: {
      return { ...state, projectList: action.payload.projects };
    }

    case TYPES.SET_SCREENS: {
      return { ...state, screens: action.payload.screens };
    }

    case TYPES.UPDATE_ELEMENTS_TREE: {
      const { root } = action.payload;
      const newState = { ...state };

      newState.screens = newState.screens.map((screen) => {
        const result = { ...screen };
        if (screen.element?.id === root.id) {
          result.element = root;
        }
        return result;
      });

      return newState;
    }

    case TYPES.SET_SCREEN: {
      const newState = { ...state };
      newState.screens = newState.screens.map((screen) => {
        if (screen.id === action.payload.screen.id) {
          return {
            ...screen,
            ...action.payload.screen,
          };
        }
        return screen;
      });
      return newState;
    }

    case TYPES.SET_PROJECT: {
      const newState = { ...state };
      newState.projectList = newState.projectList.map((project) => {
        if (project.id === action.payload.project.id) {
          return action.payload.project;
        }
        return project;
      });
      return newState;
    }

    case TYPES.RESET_SCREEN_STATE: {
      return {
        ...state,
        screens: [],
      };
    }

    case TYPES.LOGOUT: {
      return {
        ...initialData,
      };
    }

    default:
      return state;
  }
}

export default dataReducer;
