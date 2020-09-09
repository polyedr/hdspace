import { initialData } from '../initial';
import * as T from '../types';
import TYPES from '../../../constants/actions';
import { arrayToMap, flattenElements } from '../../../utils/mappings';
import { Project } from '../../../api/types';
import { Screen } from '../types';

function dataReducer(
  state: T.ProjectDataState = initialData,
  action: T.Action,
): T.ProjectDataState {
  switch (action.type) {
    case TYPES.UPDATE_ELEMENTS_TREE: {
      const { root } = action.payload;

      const targetScreen = Object.values(state.screens).find(
        (screen) => screen.elementId === root.id,
      );
      if (!targetScreen) return state;

      return {
        ...state,
        screens: {
          ...state.screens,
          [targetScreen.id]: {
            ...state.screens[targetScreen.id],
            elementId: root.id,
          },
        },
      };
    }

    case TYPES.LOAD_PROJECTS_SUCCESS: {
      return {
        ...state,
        projects: arrayToMap<Project>(action.payload.projects),
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

    case TYPES.SET_SCREENS: {
      return {
        ...state,
        screens: arrayToMap<Screen>(action.payload.screens),
      };
    }

    case TYPES.UPDATE_SCREEN: {
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

    case TYPES.ADD_ELEMENT: {
      return {
        ...state,
        elements: {
          ...state.elements,
          ...flattenElements([action.payload]),
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
