import { initialUi } from '../initial';
import TYPES from '../../actionTypes';
import { Action, ProjectUiState } from '../../types';

function uiReducer(
  state: ProjectUiState = initialUi,
  action: Action,
): ProjectUiState {
  switch (action.type) {
    case TYPES.SET_EDITABLE_STYLES: {
      return { ...state, editableStyles: action.payload.className };
    }

    case TYPES.TOGGLE_CONTAINERS_BORDERS: {
      return { ...state, showContainersBorders: !state.showContainersBorders };
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

    case TYPES.ADD_BORDERED_ELEMENT_REF: {
      return {
        ...state,
        borderedElementsRef: {
          ...state.borderedElementsRef,
          [action.payload.id]: action.payload.ref,
        },
      };
    }

    case TYPES.REMOVE_BORDERED_ELEMENT_REF: {
      const newBorderedElementsRef = { ...state.borderedElementsRef };
      delete newBorderedElementsRef[action.payload.id];
      return {
        ...state,
        borderedElementsRef: newBorderedElementsRef,
      };
    }

    case TYPES.SET_CURRENT_DROP_TARGET_PARAMS:
      return {
        ...state,
        currentDropTargetParams:
          action.payload.id === null ? null : action.payload,
      };

    case TYPES.CHANGE_SCREEN_FORMAT: {
      return {
        ...state,
        screenFormat: {
          ...state.screenFormat,
          format: action.payload,
        },
      };
    }

    case TYPES.ROTATE_SCREEN_FORMAT: {
      return {
        ...state,
        screenFormat: {
          ...state.screenFormat,
          rotated: action.payload,
        },
      };
    }

    case TYPES.SET_ELEMENT_CAN_BE_EDITED: {
      return { ...state, elementCanBeEdited: action.payload };
    }

    case TYPES.SET_ELEMENT_BEING_EDITED: {
      return {
        ...state,
        elementCanBeEdited: false,
        elementBeingEdited: action.payload,
      };
    }

    case TYPES.RESET_ELEMENT_EDIT_STATE: {
      return { ...state, elementBeingEdited: false, elementCanBeEdited: false };
    }

    case TYPES.SET_RIGHT_PANEL_ACTIVE_TAB: {
      return {
        ...state,
        rightPanel: {
          ...state.rightPanel,
          activeTab: action.payload,
        },
      };
    }

    case TYPES.LOGOUT: {
      return {
        ...initialUi,
      };
    }

    default:
      return state;
  }
}

export default uiReducer;
