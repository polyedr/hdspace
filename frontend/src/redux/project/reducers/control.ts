import TYPES from '../../actionTypes';
import { initialControl } from '../initial';
import { Action, HistoryRecord, ProjectControlState } from '../../types';

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
      const recordNumber = state.currentHistoryRecord + 1;
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
      const nextHistoryRecord = state.currentHistoryRecord + 1;
      if (nextHistoryRecord === state.history.length) {
        return state;
      }
      return { ...state, currentHistoryRecord: nextHistoryRecord };
    }

    case TYPES.MOVE_HISTORY_BACKWARD: {
      if (state.currentHistoryRecord < 0) {
        return state;
      }
      return { ...state, currentHistoryRecord: state.currentHistoryRecord - 1 };
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
