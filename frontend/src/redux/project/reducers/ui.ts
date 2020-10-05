import * as R from 'ramda';
import { NormalizedLibraryElements } from '../types';
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

    case TYPES.SET_CUSTOM_LIBRARY_ELEMENTS:
      return {
        ...state,
        customLibraryElements: action.payload.elements.reduce(
          (accumulator: NormalizedLibraryElements, element) => {
            accumulator[element.id] = element;
            return accumulator;
          },
          {} as NormalizedLibraryElements,
        ),
      };

    case TYPES.ADD_CUSTOM_LIBRARY_ELEMENT:
      return {
        ...state,
        customLibraryElements: {
          ...state.customLibraryElements,
          [action.payload.element.id || -1]: action.payload.element,
        },
      };

    case TYPES.REMOVE_CUSTOM_LIBRARY_ELEMENT:
      // eslint-disable-next-line no-case-declarations
      const newCustomLibraryElements = { ...state.customLibraryElements };
      delete newCustomLibraryElements[action.payload.id];
      return {
        ...state,
        customLibraryElements: newCustomLibraryElements,
      };

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
