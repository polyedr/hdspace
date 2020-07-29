import { initialControl } from '$redux/project/initial';
import * as T from '../types';
import * as R from 'ramda';
import undoable, { combineFilters, includeAction, StateWithHistory } from 'redux-undo';

export const reducer = (state: T.ProjectControlState = initialControl, action: T.Action): T.ProjectControlState => {
  switch (action.type) {
    case 'PROJECTS:UPDATE_ELEMENTS_TREE': {
      return {
        ...state,
        rootElement: action.payload.root,
        sourceAction: action.payload.sourceAction,
        redoActions: action.payload.skip ? state.redoActions : [],
      };
    }

    case 'PROJECTS:SET_UNDO_ACTIONS': {
      const undoActions = [ ...action.payload ];

      return {
        ...state,
        undoActions,
      }
    }

    case 'PROJECTS:ADD_UNDO_ACTION': {
      const copy = [...state.undoActions];
      copy.unshift(action.payload);

      return {
        ...state,
        undoActions: copy,
      }
    }

    case 'PROJECTS:SET_ADD_ACTION': {
      return {
        ...state,
        add: action.payload
      }
    }

    case 'PROJECTS:SET_REDO_ACTIONS': {
      return {
        ...state,
        redoActions: action.payload,
      }
    }

    default:
      return state;
  }
};

const skip = (action: any) => !action.payload?.skip;

const isSameState = (
  action: T.Action,
  currentState: T.ProjectControlState,
  previousHistory: StateWithHistory<T.ProjectControlState>
) => !R.equals(previousHistory.present.rootElement, currentState.rootElement);

export const controlReducer = undoable(reducer, {
  filter: combineFilters(
    includeAction(['PROJECTS:UPDATE_ELEMENTS_TREE']),
    skip,
    isSameState
  ),
  clearHistoryType: 'PROJECTS:CLEAR_HISTORY',
});