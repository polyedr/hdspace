import { initialControl } from '$redux/project/initial';
import * as R from 'ramda';
import * as T from '../types';
import undoable from 'redux-undo';

export const reducer = (state: T.ProjectControlState = initialControl, action: T.Action): T.ProjectControlState => {
  switch (action.type) {
    case 'PROJECTS:UPDATE_ELEMENTS_TREE': {
      return {
        ...state,
        rootElement: action.payload.root,
      };
    }

    case 'PROJECTS:SET_UNDO_ACTION': {
      return {
        ...state,
        undoAction: action.payload,
      }
    }

    default:
      return state;
  }
};

export const controlReducer = undoable(reducer, {
  filter: (action, currentState, previousHistory) => {
    return !R.equals(previousHistory.present.rootElement, currentState.rootElement);
  }
});