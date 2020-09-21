import { initialData } from '../initial';
import * as T from '../types';
import TYPES from '../../../constants/actions';
import { Project } from '../../../api/types';
import { Screen } from '../types';
import {
  addMapElements,
  arrayToMap,
  flattenElements,
  insertMapElement,
  moveMapElement,
  removeMapElement,
  updateMapElement,
} from '../../../utils/normalizedStateHelpers';

function dataReducer(
  state: T.ProjectDataState = initialData,
  action: T.Action,
): T.ProjectDataState {
  switch (action.type) {
    case TYPES.UPDATE_ELEMENTS_TREE: {
      return {
        ...state,
        elements: {
          ...state.elements,
          ...action.payload,
        },
      };
    }

    case TYPES.MOVE_STATE_ELEMENT: {
      const { elementId, indices, parents } = action.payload;
      return {
        ...state,
        elements: {
          ...state.elements,
          ...moveMapElement(state.elements, elementId, indices, parents),
        },
      };
    }

    case TYPES.UPDATE_STATE_ELEMENT: {
      const { elementId, data } = action.payload;
      return {
        ...state,
        elements: {
          ...state.elements,
          ...updateMapElement(state.elements, elementId, data),
        },
      };
    }

    case TYPES.ADD_STATE_ELEMENTS: {
      const { elements, parentId } = action.payload;
      return {
        ...state,
        elements: {
          ...state.elements,
          ...addMapElements(state.elements, elements, parentId),
        },
      };
    }

    case TYPES.INSERT_STATE_ELEMENT: {
      const { parentId, childId, element } = action.payload;
      return {
        ...state,
        elements: {
          ...state.elements,
          ...insertMapElement(state.elements, element, parentId, childId),
        },
      };
    }

    case TYPES.REMOVE_STATE_ELEMENT: {
      const { elementId } = action.payload;
      return {
        ...state,
        elements: {
          ...state.elements,
          ...removeMapElement(state.elements, elementId),
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
        elements: {},
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
