import { initial } from '../initial';
import * as T from '../types';

export function uiReducer(state: T.ReduxState['ui'] = initial.ui, action: T.Action): T.ReduxState['ui'] {
  switch (action.type) {
    case 'PROJECTS:SET_ACTIVE_ITEM': {
      return { ...state, activeItem: action.payload.activeItem };
    }

    default: return state;
  }
}
