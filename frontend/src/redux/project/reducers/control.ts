import { initialControl } from '$redux/project/initial';
import * as T from '../types';
import { TYPES } from '$constants/actions';

// To create undoable feature for the editor you have to implement action with "meta" field extends type HistoryMeta,
// that will call correspondent saga, which should:
// 1. accept that action
// 2. put "updateElementsTree" action or call "updateElementsTree" function with the "sourceAction" as a second argument.
// It will be used to redo undid changes. Often this source action is the same as initial action of this saga. But in
// case of creating elements it is not.
// 3. put "setUndoActions" action, with an array of actions that will lead to previous state as an argument,
// so you will be able to undo your changes.

export const controlReducer = (
  state: T.ProjectControlState = initialControl,
  action: T.Action,
): T.ProjectControlState => {
  switch (action.type) {
    case TYPES.UPDATE_ELEMENTS_TREE: {
      const {
        meta: { undo, redo },
        payload: { sourceAction },
      } = action;

      const { groupActionsUp, history } = state;

      const newState = { ...state };

      if (sourceAction && !redo && !undo) {
        newState.redoActions = [];
      }

      if (sourceAction && !undo) {
        newState.history = groupActionsUp
          ? [
              ...history.slice(0, -1),
              [history[history.length - 1], sourceAction],
            ]
          : [...history, sourceAction];
      }

      return newState;
    }

    case TYPES.DELETE_SCREEN: {
      const newState = { ...state };

      if (!action.meta?.undo) {
        newState.history = [...state.history, action];
      }
      if (!action.meta?.undo && !action.meta?.redo) {
        newState.redoActions = [];
      }

      return newState;
    }

    case TYPES.RESET_SCREEN_STATE: {
      return {
        ...state,
        undoActions: [],
        redoActions: [],
        history: [],
        sourceAction: null,
        remoteMove: false,
      };
    }

    case TYPES.SET_UNDO_ACTIONS: {
      return {
        ...state,
        // @ts-ignore
        undoActions: state.remoteMove
          ? [
              ...state.undoActions.slice(0, -1),
              [state.undoActions[state.undoActions.length - 1], action.payload],
            ]
          : [...state.undoActions, action.payload],
      };
    }

    case TYPES.POP_UNDO_ACTION: {
      return {
        ...state,
        undoActions: state.undoActions.slice(0, -1),
      };
    }

    case TYPES.SET_REMOTE_MOVE: {
      return {
        ...state,
        remoteMove: action.payload,
      };
    }

    case TYPES.SET_REDO_ACTIONS: {
      return {
        ...state,
        redoActions: action.payload,
      };
    }

    case TYPES.CLEAR_HISTORY: {
      return {
        ...state,
        undoActions: [],
        redoActions: [],
        history: [],
        sourceAction: null,
        remoteMove: false,
      };
    }

    case TYPES.POP_HISTORY: {
      return {
        ...state,
        history: state.history.slice(0, -1),
      };
    }

    case TYPES.SET_GROUP_UP: {
      return {
        ...state,
        groupActionsUp: action.payload,
      };
    }

    case TYPES.LOGOUT: {
      return {
        ...initialControl,
      };
    }

    default:
      return state;
  }
};
