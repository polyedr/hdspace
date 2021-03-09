import { call, put, select } from 'redux-saga/effects';
import { Action } from '@Redux/types';
import * as Actions from '@Redux/project/actions';
import {
  selectCurrentHistoryRecord,
  selectHistoryInProgress,
} from '../selectors/control';

export default function withActionsHistory(fn: any) {
  return function* (action: Action) {
    const useHistory = action.meta && action.meta.useHistory;
    const historyInProgress = yield select(selectHistoryInProgress);
    const currentHistoryRecord = yield select(selectCurrentHistoryRecord);
    if (historyInProgress && currentHistoryRecord.action.type === action.type) {
      return null;
    }
    if (!useHistory) {
      yield put(Actions.startHistoryRecord(action));
    }
    const result = yield call(fn, action);
    if (!useHistory) {
      yield put(Actions.closeHistoryRecord());
    }
    return result;
  };
}
