import { initial, ReduxState } from './initial';
import TYPES from '../../constants/actions';
import { Action } from '../project/types';

function uiReducer(state: ReduxState = initial, action: Action): ReduxState {
  switch (action.type) {
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

    default:
      return state;
  }
}

export default uiReducer;
