import produce, { Draft } from 'immer';
import { initialUi } from '../initial';
import * as T from '../types';
import TYPES from '../../../constants/actions';

/* function uiReducer(
  state: T.ProjectUiState = initialUi,
  action: T.Action,
): T.ProjectUiState { */

const uiReducer = produce(
  (draft: Draft<T.ProjectUiState> = initialUi, action: T.Action) => {
    switch (action.type) {
      case TYPES.SET_EDITABLE_STYLES: {
        draft.editableStyles = action.payload.className;
        break;
      }

      case TYPES.TOGGLE_CONTAINERS_BORDERS: {
        draft.showContainersBorders = !draft.showContainersBorders;
        break;
      }

      case TYPES.SET_ITEM_TO_COPY: {
        draft.itemToCopyInfo = action.payload;
        break;
      }

      case TYPES.SET_IS_ADD_ELEMENTS_MODAL_OPENED: {
        draft.isAddElementsModalOpened = action.payload.isOpened;
        break;
      }

      case TYPES.UPDATE_SAVED_ELEMENTS_VALUES: {
        draft.savedElementsValues = {
          ...draft.savedElementsValues,
          ...action.payload.elementsValues,
        };
        break;
      }

      case TYPES.UPDATE_SAVED_ELEMENT_VALUES: {
        const { itemID, savedValue } = action.payload;
        draft.savedElementsValues[itemID] = {
          ...draft.savedElementsValues[itemID],
          savedValue,
        };
        break;
      }

      case TYPES.UPDATE_CUSTOM_ELEMENTS_LOADING:
        draft.customElementsData.loading = action.payload.loading;
        break;

      case TYPES.ADD_CUSTOM_ELEMENTS_PAGE:
        draft.customElementsData.next = action.payload.next;
        draft.customElementsData.previous = action.payload.previous;
        draft.customElementsData.results.push(...action.payload.results);
        draft.customElementsData.loading = false;
        break;

      case TYPES.ADD_CUSTOM_ELEMENT:
        draft.customElementsData.results.push(action.payload.element);
        break;

      // case TYPES.ADD_BORDERED_ELEMENT_REF: {
      //   return {
      //     ...state,
      //     borderedElementsRef: {
      //       ...state.borderedElementsRef,
      //       [action.payload.id]: action.payload.ref,
      //     },
      //   };
      // }

      // case TYPES.REMOVE_BORDERED_ELEMENT_REF: {
      //   const newBorderedElementsRef = { ...state.borderedElementsRef };
      //   delete newBorderedElementsRef[action.payload.id];
      //   return {
      //     ...state,
      //     borderedElementsRef: newBorderedElementsRef,
      //   };
      // }

      case TYPES.SET_CURRENT_DROP_TARGET_PARAMS:
        draft.currentDropTargetParams =
          action.payload.id === null ? null : action.payload;
        break;
      case TYPES.LOGOUT: {
        return {
          ...initialUi,
        };
      }

      default:
        return draft;
    }
    return draft;
  },
);

export default uiReducer;
