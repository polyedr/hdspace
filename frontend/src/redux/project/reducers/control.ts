import { initialControl } from '$redux/project/initial';
import * as T from '../types';
import * as R from 'ramda';

// To create undoable feature for the editor you have to implement action with "meta" field extends type HistoryMeta,
// that will call correspondent saga, which should:
// 1. accept that action
// 2. put "updateElementsTree" action or call "updateElementsTree" function with the "sourceAction" as a second argument.
// It will be used to redo undid changes. Often this source action is the same as initial action of this saga. But in
// case of creating elements it is not.
// 3. put "setUndoActions" action, with an array of actions that will lead to previous state as an argument,
// so you will be able to undo your changes.

export const controlReducer = (state: T.ProjectControlState = initialControl, action: T.Action): T.ProjectControlState => {
  switch (action.type) {
    case 'PROJECTS:UPDATE_ELEMENTS_TREE': {
      const newState = {
        ...state,
        rootElement: action.payload.root,
      };

      if (!action.meta.redo && !action.meta.undo) {
        newState.redoActions = [];
      }

      if (action.payload.sourceAction && !action.meta.undo) {
        newState.history = state.multi
          ? [
              ...state.history.slice(0, -1),
              [
                state.history[state.history.length - 1],
                action.payload.sourceAction
              ],
            ] : [
              ...state.history,
              action.payload.sourceAction,
            ];
      }

      return newState
    }

    case 'PROJECTS:SET_UNDO_ACTIONS': {
      return {
        ...state,
        // @ts-ignore
        undoActions: state.remoteMove
          ? [
            ...state.undoActions.slice(0, -1),
            [
              state.undoActions[state.undoActions.length - 1],
              action.payload,
            ]
          ] : [
          ...state.undoActions,
          action.payload,
        ],
      }
    }

    case 'PROJECTS:POP_UNDO_ACTION': {
      return {
        ...state,
        undoActions: state.undoActions.slice(0, -1),
      }
    }

    case 'PROJECTS:SET_ADD_ACTION': {
      return {
        ...state,
        remoteMove: action.payload
      }
    }

    case 'PROJECTS:SET_REDO_ACTIONS': {
      return {
        ...state,
        redoActions: action.payload,
      }
    }

    case 'PROJECTS:CLEAR_HISTORY': {
      return  {
        ...state,
        undoActions: [],
        redoActions: [],
        history: [],
        sourceAction: null,
        remoteMove: false,
      }
    }

    case 'PROJECTS:POP_HISTORY': {
      return {
        ...state,
        history: state.history.slice(0, -1),
      }
    }

    case 'PROJECTS:SET_MULTI': {
      return {
        ...state,
        multi: action.payload,
      }
    }

    default:
      return state;
  }
};
