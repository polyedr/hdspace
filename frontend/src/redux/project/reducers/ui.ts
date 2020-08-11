import * as R from 'ramda';
import { initialUi } from '../initial';
import * as T from '../types';

export function uiReducer(
  state: T.ProjectUiState = initialUi,
  action: T.Action,
): T.ProjectUiState {
  switch (action.type) {
    case 'PROJECTS:SET_ACTIVE_ITEM': {
      return { ...state, activeItem: action.payload.activeItem };
    }

    case 'PROJECTS:SET_EDITABLE_STYLES': {
      return { ...state, editableStyles: action.payload.className };
    }

    case 'PROJECTS:TOGGLE_CONTAINERS_BORDERS': {
      return { ...state, showContainersBorders: !state.showContainersBorders };
    }

    case 'PROJECTS:SET_ITEM_TO_COPY': {
      return { ...state, itemToCopyInfo: action.payload };
    }

    case 'PROJECTS:CLEAN_AFTER_PREV_SCREEN': {
      return {
        ...state,
        ...R.pick(['activeItem'], initialUi),
        itemToCopyInfo: state.itemToCopyInfo,
      };
    }

    case 'PROJECTS:SET_IS_ADD_ELEMENTS_MODAL_OPENED': {
      return { ...state, isAddElementsModalOpened: action.payload.isOpened };
    }

    case 'PROJECTS:UPDATE_SAVED_ELEMENTS_VALUES': {
      const { elementsValues } = action.payload;

      return {
        ...state,
        savedElementsValues: {
          ...state.savedElementsValues,
          ...elementsValues,
        },
      };
    }

    case 'PROJECTS:UPDATE_SAVED_ELEMENT_VALUES': {
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

    default:
      return state;
  }
}
