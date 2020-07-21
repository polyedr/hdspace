import { initialControl } from '$redux/project/initial';
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

    default:
      return state;
  }
};

export const controlReducer = undoable(reducer);