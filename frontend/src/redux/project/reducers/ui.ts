import * as R from 'ramda';
import { initialUi } from '../initial';
import * as T from '../types';
import TYPES from '../../../constants/actions';

function uiReducer(
  state: T.ProjectUiState = initialUi,
  action: T.Action,
): T.ProjectUiState {
  switch (action.type) {
    case TYPES.SET_EDITABLE_STYLES: {
      return { ...state, editableStyles: action.payload.className };
    }

    case TYPES.TOGGLE_CONTAINERS_BORDERS: {
      return { ...state, showContainersBorders: !state.showContainersBorders };
    }

    case TYPES.SET_ITEM_TO_COPY: {
      return { ...state, itemToCopyInfo: action.payload };
    }

    case TYPES.CLEAN_AFTER_PREV_SCREEN: {
      return {
        ...state,
        ...R.pick(['activeItem'], initialUi),
        itemToCopyInfo: state.itemToCopyInfo,
      };
    }

    case TYPES.SET_IS_ADD_ELEMENTS_MODAL_OPENED: {
      return { ...state, isAddElementsModalOpened: action.payload.isOpened };
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

    case TYPES.SAVE_LIBRARY_ELEMENT_TO_STATE: {
      return {
        ...state,
        customLibraryElements: {
          ...state.customLibraryElements,
          [action.payload.name]: action.payload,
        },
      };
    }

    case TYPES.ADD_BORDERED_ELEMENT_RECT: {
      return {
        ...state,
        borderedElementsRect: {
          ...state.borderedElementsRect,
          [action.payload.id]: action.payload.rect,
        },
      };
    }

    case TYPES.REMOVE_BORDERED_ELEMENT_RECT: {
      const newBorderedElementsRect = { ...state.borderedElementsRect };
      delete newBorderedElementsRect[action.payload.id];
      return {
        ...state,
        borderedElementsRect: newBorderedElementsRect,
      };
    }

    case TYPES.SET_CURRENT_DROP_TARGET_ID:
      return {
        ...state,
        currentDropTargetId: action.payload.id,
      };
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
