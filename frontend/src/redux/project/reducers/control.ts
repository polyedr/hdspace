import { initialControl } from '$redux/project/initial';
import * as R from 'ramda';
import * as T from '../types';
import undoable, { combineFilters, StateWithHistory, excludeAction } from 'redux-undo';

export const reducer = (state: T.ProjectControlState = initialControl, action: T.Action): T.ProjectControlState => {
  switch (action.type) {
    case 'PROJECTS:UPDATE_ELEMENTS_TREE': {
      return {
        ...state,
        rootElement: action.payload.root,
      };
    }

    case 'PROJECTS:SET_UNDO_ACTIONS': {
      return {
        ...state,
        undoActions: action.payload,
      }
    }

    case 'PROJECTS:ADD_UNDO_ACTIONS': {
      const copy = [...state.undoActions];
      copy.unshift(action.payload);

      return {
        ...state,
        undoActions: copy,
      }
    }

    default:
      return state;
  }
};

const isSameState = (
  action: T.Action,
  currentState: T.ProjectControlState,
  previousHistory: StateWithHistory<T.ProjectControlState>
) => !R.equals(previousHistory.present.rootElement, currentState.rootElement);

const isUndo = (action: any) => !action.payload.undo;

export const controlReducer = undoable(reducer, {
  filter: combineFilters(
    isSameState,
    isUndo,
    excludeAction(['PROJECTS:ADD_UNDO_ACTIONS', 'PROJECTS:SET_UNDO_ACTIONS'])
  )
});