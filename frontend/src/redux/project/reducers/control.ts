import TYPES from '../../actionTypes';
import { initialControl } from '../initial';
import { Action, HistoryRecord, ProjectControlState } from '../../types';

// To create undoable feature for the editor you have to implement action with "meta" field extends type HistoryMeta,
// that will call correspondent saga, which should:
// 1. accept that action
// 2. put "updateElementsTree" action or call "updateElementsTree" function with the "sourceAction" as a second argument.
// It will be used to redo undid changes. Often this source action is the same as initial action of this saga. But in
// case of creating elements it is not.
// 3. put "setUndoActions" action, with an array of actions that will lead to previous state as an argument,
// so you will be able to undo your changes.

const controlReducer = (
  state: ProjectControlState = initialControl,
  action: Action,
) => {
  switch (action.type) {
    case TYPES.START_HISTORY_RECORD: {
      const newHistoryRecord: HistoryRecord = {
        action: action.payload.source,
        undo: [],
        redo: [],
      };
      const recordNumber = ++state.currentHistoryRecord;
      return {
        ...state,
        historyInProgress: true,
        currentHistoryRecord: recordNumber,
        history: [...state.history.slice(0, recordNumber), newHistoryRecord],
      };
    }
    case TYPES.CLOSE_HISTORY_RECORD: {
      if (!state.historyInProgress) {
        return state;
      }
      return { ...state, historyInProgress: false };
    }
    case TYPES.ADD_STATE_UNDO_ACTIONS: {
      const currentRecord = state.history[state.currentHistoryRecord];
      const updatedRecord: HistoryRecord = {
        ...currentRecord,
        undo: [...currentRecord.undo, ...action.payload.actions],
      };
      const updatedHistoryRecords = [...state.history];
      updatedHistoryRecords.splice(
        state.currentHistoryRecord,
        1,
        updatedRecord,
      );
      return { ...state, history: updatedHistoryRecords };
    }

    case TYPES.ADD_STATE_REDO_ACTIONS: {
      const currentRecord = state.history[state.currentHistoryRecord];
      const updatedRecord: HistoryRecord = {
        ...currentRecord,
        redo: [...currentRecord.redo, ...action.payload.actions],
      };
      const updatedHistoryRecords = [...state.history];
      updatedHistoryRecords.splice(
        state.currentHistoryRecord,
        1,
        updatedRecord,
      );
      return { ...state, history: updatedHistoryRecords };
    }

    case TYPES.RESET_SCREEN_STATE: {
      return {
        ...state,
        history: [],
        currentHistoryRecord: -1,
        historyInProgress: false,
      };
    }

    case TYPES.MOVE_HISTORY_FORWARD: {
      const nextHistoryRecord = ++state.currentHistoryRecord;
      if (nextHistoryRecord === state.history.length) {
        return state;
      }
      return { ...state, currentHistoryRecord: nextHistoryRecord };
    }

    case TYPES.MOVE_HISTORY_BACKWARD: {
      if (state.currentHistoryRecord < 0) {
        return state;
      }
      return { ...state, currentHistoryRecord: --state.currentHistoryRecord };
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

export default controlReducer;
