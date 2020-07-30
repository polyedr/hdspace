import { initialControl } from '$redux/project/initial';
import * as T from '../types';
import * as R from 'ramda';
import undoable, { combineFilters, includeAction, StateWithHistory } from 'redux-undo';

// To create undoable feature for the editor you have to implement action with "meta" field extends type HistoryMeta,
// that will call correspondent saga, which should:
// 1. accept that action
// 2. put "updateElementsTree" action or call "updateElementsTree" function with the skip as a second argument. skip
// should be true in case of you are redoing or undoing actions (or it is initial elements tree loading).
// 3. put "setUndoActions" action, with an array of actions that will lead to previous state as an argument,
// so you will be able to undo your changes.
// 4. as a third argument updateElementsTree should have action(sourceAction), that will be used to redo undid changes.
// Often this source action is the same as initial action of this saga. But in case of creating elements it is not.

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