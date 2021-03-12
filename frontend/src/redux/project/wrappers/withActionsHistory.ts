import { call, put, select } from 'redux-saga/effects';
import { Action } from '@Redux/types';
import * as Actions from '@Redux/project/actions';
import {
  selectCurrentHistoryRecordIndex,
  // selectHistoryInProgress,
} from '../selectors/control';

export default function withActionsHistory(fn: any) {
  return function* (action: Action) {
    const useHistory = action.meta && action.meta.useHistory;
    // const historyInProgress = yield select(selectHistoryInProgress);

    /* if (historyInProgress && currentHistoryRecord.action.type === action.type) {
      return null;
    } */
    if (!useHistory) {
      yield put(Actions.startHistoryRecord(action));
    }
    const historyRecordIndex = yield select(selectCurrentHistoryRecordIndex);
    const result = yield call(fn, {
      ...action,
      meta: {
        ...(action.meta || {}),
        historyRecordIndex,
      },
    });
    /* if (!useHistory) {
      yield put(Actions.closeHistoryRecord());
    } */
    return result;
  };
}
