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
    case TYPES.ADD_UNDO_ACTIONS: {
      const { actions } = action.payload;
      const newStateHistory = state.history.map((historyRecord, index) => {
        const recordActions = actions.filter(
          (action) => action.meta?.historyRecordIndex === index,
        );
        if (!recordActions.length) {
          return historyRecord;
        }
        return {
          ...historyRecord,
          undo: [...historyRecord.undo, ...recordActions],
        };
      });
      return { ...state, history: newStateHistory };
    }

    case TYPES.ADD_REDO_ACTIONS: {
      const { actions } = action.payload;
      const newStateHistory = state.history.map((historyRecord, index) => {
        const recordActions = actions.filter(
          (action) => action.meta?.historyRecordIndex === index,
        );
        if (!recordActions.length) {
          return historyRecord;
        }
        return {
          ...historyRecord,
          redo: [...historyRecord.redo, ...recordActions],
        };
      });
      return { ...state, history: newStateHistory };
    }

    case TYPES.RESET_SCREEN_STATE: {
      return {
        ...state,
        history: [],
        currentHistoryRecord: -1,
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
