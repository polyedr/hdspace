import * as R from 'ramda';
import { initial } from '../initial';
import * as T from '../types';

export function uiReducer(state: T.ReduxState['ui'] = initial.ui, action: T.Action): T.ReduxState['ui'] {
  switch (action.type) {
    case 'PROJECTS:SET_ACTIVE_ITEM': {
      return { ...state, activeItem: action.payload.activeItem };
    }

    case 'PROJECTS:CLEAN_AFTER_PREV_SCREEN': {
      return {
        ...state,
        ...R.pick(
          ['activeItem'],
          initial.ui,
        ),
      };
    }

    case 'PROJECTS:SET_IS_ADD_ELEMENTS_MODAL_OPENED': {
      return { ...state, isAddElementsModalOpened: action.payload.isOpened };
    }

    default: return state;
  }
}
