import { initialData } from '../initial';
import * as T from '../types';
import TYPES from '../../../constants/actions';
import { arrayToMap } from '../../../utils/mappings';
import { Project } from '../../../api/types';
import { ProjectScreen } from '../types';

function dataReducer(
  state: T.ProjectDataState = initialData,
  action: T.Action,
): T.ProjectDataState {
  switch (action.type) {
    case TYPES.LOAD_LIBRARY_ELEMENTS_SUCCESS: {
      return { ...state, libraryElements: action.payload.libraryElements };
    }

    case TYPES.LOAD_PROJECTS_SUCCESS: {
      return {
        ...state,
        projects: arrayToMap<Project>(action.payload.projects),
      };
    }

    case TYPES.SET_SCREENS: {
      return {
        ...state,
        screens: arrayToMap<ProjectScreen>(action.payload.screens),
      };
    }

    case TYPES.UPDATE_ELEMENTS_TREE: {
      const { root } = action.payload;

      const targetScreen = Object.values(state.screens).find(
        (screen) => screen.element.id === root.id,
      );
      if (!targetScreen) return state;

      return {
        ...state,
        screens: {
          ...state.screens,
          [targetScreen.id]: {
            ...state.screens[targetScreen.id],
            element: root,
          },
        },
      };
    }

    case TYPES.SET_SCREEN: {
      const { screen } = action.payload;
      return {
        ...state,
        screens: {
          ...state.screens,
          [screen.id]: {
            ...state.screens[screen.id],
            ...screen,
          },
        },
      };
    }

    case TYPES.SET_PROJECT: {
      return {
        ...state,
        projects: {
          ...state.projects,
          [action.payload.project.id]: action.payload.project,
        },
      };
    }

    case TYPES.RESET_SCREEN_STATE: {
      return {
        ...state,
        screens: {},
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
