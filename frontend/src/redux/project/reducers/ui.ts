import * as R from 'ramda';
import { initial } from '../initial';
import * as T from '../types';

export function uiReducer(state: T.ReduxState['ui'] = initial.ui, action: T.Action): T.ReduxState['ui'] {
  switch (action.type) {
    case 'PROJECTS:SET_ACTIVE_ITEM': {
      return { ...state, activeItem: action.payload.activeItem };
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
        ...R.pick(
          ['activeItem'],
          initial.ui,
        ),
        itemToCopyInfo: state.itemToCopyInfo,
      };
    }

    case 'PROJECTS:SET_IS_ADD_ELEMENTS_MODAL_OPENED': {
      return { ...state, isAddElementsModalOpened: action.payload.isOpened };
    }

    case 'PROJECTS:UPDATE_SAVED_ELEMENTS_VALUES': {
      const { elementsValues } = action.payload;

      return { ...state, savedElementsValues: { ...state.savedElementsValues, ...elementsValues } };
    }

    case 'PROJECTS:UPDATE_SAVED_ELEMENT_VALUES': {
      const { itemID, savedValue } = action.payload;

      return { ...state, savedElementsValues: {
        ...state.savedElementsValues,
        [itemID]: {
          ...state.savedElementsValues[itemID],
          savedValue,
        }
      }};
    }

    default: return state;
  }
}
