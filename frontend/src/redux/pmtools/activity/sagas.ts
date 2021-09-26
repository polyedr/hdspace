import Activity from '@Api/pmtools/activityApi';
import TYPES from '@Redux/actionTypes';
import {
  AddActionSagaGenerator,
  ClearHistorySagaGenerator,
  GetActionSagaGenerator,
} from '@Src/pm-types/activity/generators';
import { put, call, takeLatest } from 'redux-saga/effects';

function* getActionSaga({ payload }: any): GetActionSagaGenerator {
  try {
    const { project, access } = payload;
    const data: any = yield call(Activity.getActions, project, access);

    const result = data.project_data_text
      ? data.project_data_text.split('/')
      : [];
    yield put({
      type: TYPES.GET_ACTION,
      payload: result,
    });
  } catch (e) {
    yield put({ type: TYPES.ERROR, e });
  }
}

export function* addActionSaga(payload): AddActionSagaGenerator {
  try {
    const { project, action, access } = payload;

    const projectData: any = yield call(Activity.getActions, project, access);
    projectData.project_data_text += `/${action}`;

    yield call(Activity.addActions, {
      project: projectData,
      access,
      projectId: project,
    });
    yield put({ type: TYPES.ADD_ACTION, payload });
  } catch (e) {
    yield put({ type: TYPES.ERROR, e });
  }
}

function* clearHistorySaga({ payload }: any): ClearHistorySagaGenerator {
  try {
    const { project, access } = payload;
    const projectData: any = yield call(Activity.getActions, project, access);
    projectData.project_data_text = '';

    yield call(Activity.clearHistory, {
      project: projectData,
      access,
      projectId: project,
    });
    yield put({ type: TYPES.CLEAR_HISTORY_SUCCESS });
  } catch (e) {
    yield put({ type: TYPES.ERROR, e });
  }
}

export default function* activitySaga() {
  // ACTIONS
  yield takeLatest(TYPES.REQUEST_GET_ACTION, getActionSaga);
  yield takeLatest(TYPES.CLEAR_HISTORY, clearHistorySaga);
}
