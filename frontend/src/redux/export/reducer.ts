import { initial, ReduxState } from './initial';
import { Action } from '$redux/project/types';

export function uiReducer(state: ReduxState = initial, action: Action): ReduxState {
  switch (action.type) {
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
