import Activity from '@Api/pmtools/activityApi';
import TYPES from '@Redux/actionTypes';
import {
  AddActionSagaGenerator,
  ClearHistorySagaGenerator,
  GetActionSagaGenerator,
} from '@Src/pm-types/activity/generators';
import { put, call } from 'redux-saga/effects';

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

export function* addActionSaga({
  payload,
}: {
  type: string;
  payload: {
    projectId: number;
    action: string;
  };
}): AddActionSagaGenerator {
  try {
    const { projectId, action } = payload;
    const projectData = yield call(Activity.getActions, projectId);
    yield call(Activity.addActions, {
      projectId,
      action,
      projectData,
    });
    yield put({ type: TYPES.ADD_ACTION, payload });
  } catch (e) {
    yield put({ type: TYPES.ERROR, e });
  }
}

export function* clearHistorySaga({
  payload,
}: {
  type: string;
  payload: number;
}): ClearHistorySagaGenerator {
  try {
    const result = yield call(Activity.clearHistory, payload);
    if (!result) {
      yield put({ type: TYPES.CLEAR_HISTORY_SUCCESS });
    }
  } catch (e) {
    yield put({ type: TYPES.ERROR, e });
  }
}
