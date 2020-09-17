import { initialData } from '../initial';
import * as T from '../types';
import TYPES from '../../../constants/actions';
import { Project } from '../../../api/types';
import { Screen } from '../types';
import {
  arrayToMap,
  flattenElements,
} from '../../../utils/normalizedStateHelpers';

function dataReducer(
  state: T.ProjectDataState = initialData,
  action: T.Action,
): T.ProjectDataState {
  switch (action.type) {
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
        elements: {
          ...state.elements,
          ...flattenElements([root]),
        },
      };
    }

    case TYPES.UPDATE_ELEMENTS: {
      return {
        ...state,
        ...action.payload,
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

    case TYPES.ADD_ELEMENTS: {
      const { parentId, elements } = action.payload;

      const newState = {
        ...state,
        elements: {
          ...state.elements,
          ...flattenElements(elements, parentId),
        },
      };

      if (parentId) {
        newState.elements[parentId].children = [
          ...new Set([
            ...newState.elements[parentId].children,
            ...elements.map((el) => el.id),
          ]),
        ];
      }

      return newState;
    }

    case TYPES.REMOVE_ELEMENTS: {
      const elementIds = action.payload;
      const newState = {
        ...state,
      };

      elementIds.forEach((id) => {
        const target = newState.elements[id];
        if (target?.parent) {
          const parent = newState.elements[target.parent];

          parent.children = parent?.children.filter(
            (childId) => childId !== id,
          );
        }

        target.children.forEach((childId) => {
          delete newState.elements[childId];
        });

        delete newState.elements[id];
      });

      return newState;
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
