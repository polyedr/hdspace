import Activity from '@Api/pmtools/activityApi';
import TYPES from '@Redux/actionTypes';
import { GetActionSagaGenerator } from '@Src/types/activity/generators';
import { takeLatest, put, call } from 'redux-saga/effects';

export function* getActionSaga({
  payload,
}: {
  type: string;
  payload: number;
}): GetActionSagaGenerator {
  try {
    const data = yield call(Activity.getActions, payload);
    yield put({ type: TYPES.GET_ACTION, payload: data });
  } catch (e) {
    yield put({ type: TYPES.ERROR, e });
  }
}

export default function* activitySaga() {
  yield takeLatest(TYPES.REQUEST_GET_ACTION, getActionSaga);
}
