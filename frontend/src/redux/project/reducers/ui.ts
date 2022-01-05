import { initialUi } from '../initial';
import TYPES from '../../actionTypes';
import { Action, ProjectUiState } from '../../types';

function uiReducer(
  state: ProjectUiState = initialUi,
  action: Action,
): ProjectUiState {
  switch (action.type) {
    case TYPES.SET_EDITOR_DOCUMENT: {
      return {
        ...state,
        editorDocument: action.payload,
      };
    }

    case TYPES.SET_EDITABLE_STYLES: {
      return { ...state, editableStyles: action.payload.className };
    }

    case TYPES.TOGGLE_CONTAINERS_BORDERS: {
      return { ...state, showContainersBorders: action.payload };
    }

    case TYPES.TOGGLE_GRID: {
      return { ...state, showGrid: action.payload };
    }

    case TYPES.EXPORT_SCREEN_FLAG: {
      return { ...state, exportScreenFlag: action.payload };
    }

    case TYPES.SET_BORDERS_ENABLED: {
      return { ...state, bordersEnabled: action.payload };
    }

    case TYPES.SET_ELEMENT_TO_COPY: {
      return { ...state, itemToCopyInfo: action.payload };
    }

    case TYPES.UPDATE_SAVED_ELEMENTS_VALUES: {
      const { elementsValues } = action.payload;

      return {
        ...state,
        savedElementsValues: {
          ...state.savedElementsValues,
          ...elementsValues,
        },
      };
    }

    case TYPES.UPDATE_SAVED_ELEMENT_VALUES: {
      const { itemID, savedValue } = action.payload;

      return {
        ...state,
        savedElementsValues: {
          ...state.savedElementsValues,
          [itemID]: {
            ...state.savedElementsValues[itemID],
            savedValue,
          },
        },
      };
    }

    case TYPES.SET_CURRENT_DROP_TARGET_PARAMS:
      if (
        state.currentDropTargetParams &&
        state.currentDropTargetParams.id === action.payload.id &&
        state.currentDropTargetParams.position === action.payload.position
      ) {
        return state;
      }
      return {
        ...state,
        currentDropTargetParams:
          action.payload.id === null ? null : action.payload,
      };

    case TYPES.CHANGE_LAYOUT: {
      return {
        ...state,
        layout: {
          ...state.layout,
          value: action.payload,
        },
      };
    }

    case TYPES.ROTATE_SCREEN_FORMAT: {
      return {
        ...state,
        layout: {
          ...state.layout,
          rotated: action.payload,
        },
      };
    }

    case TYPES.SET_CAN_CREATE_GROUP: {
      return { ...state, canCreateGroup: action.payload };
    }

    case TYPES.SET_NEW_SCREEN_MODAL: {
      return {
        ...state,
        newScreenModalOpen: action.payload,
      };
    }

    case TYPES.SET_SIDEBAR_OPEN: {
      return {
        ...state,
        sidebar: {
          ...state.sidebar,
          open: action.payload,
        },
      };
    }

    case TYPES.SET_SIDEBAR_IFRAME: {
      return {
        ...state,
        sidebar: {
          ...state.sidebar,
          iframe: action.payload,
        },
      };
    }

    case TYPES.SET_SIDEBAR_HOST: {
      return {
        ...state,
        sidebar: {
          ...state.sidebar,
          host: action.payload,
        },
      };
    }

    case TYPES.SET_STATE_PSEUDO_CLASS: {
      return {
        ...state,
        pseudoClass: action.payload,
      };
    }

    case TYPES.LOGOUT: {
      return {
        ...initialUi,
      };
    }

    case TYPES.SET_VALUE_CHECK_ROBOTS: {
      return {
        ...state,
        isCanImportSite: action.payload,
      };
    }
    default:
      return state;
  }
}

export default uiReducer;
