import { call, put, select } from 'redux-saga/effects';
import { Action } from '@Redux/types';
import * as Actions from '@Redux/project/actions';
import { selectCurrentHistoryRecordIndex } from '../selectors/control';

export default function withActionsHistory(fn: any) {
  return function* (action: Action) {
    const useHistory = action.meta && action.meta.useHistory;
    const actionHistoryRecord = action.meta && action.meta.historyRecordIndex;
    if (!useHistory && !actionHistoryRecord) {
      yield put(Actions.startHistoryRecord(action));
    }
    const historyRecordIndex = yield select(selectCurrentHistoryRecordIndex);
    const result = yield call(fn, {
      ...action,
      meta: {
        ...(action.meta || {}),
        historyRecordIndex: actionHistoryRecord || historyRecordIndex,
      },
    });
    return result;
  };
}
