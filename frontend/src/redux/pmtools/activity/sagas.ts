import Activity from '@Api/pmtools/activityApi';
import TYPES from '@Redux/actionTypes';
import {
  AddActionSagaGenerator,
  ClearHistorySagaGenerator,
} from '@Src/types/pmtools/generators';
import { ServerProject } from '@Src/types/types';
import { put, call, takeLatest } from 'redux-saga/effects';
import sideError from '../actions';
import { addAction, getActions } from './actions';

function* getActionSaga(action: ReturnType<typeof getActions>) {
  try {
    const { project, access } = action.payload;
    const { project_data_text: data } = yield call(
      Activity.getActions,
      project,
      access,
    );
    yield put(getActions(data ? data.split('/') : []));
  } catch (e) {
    yield put(sideError(e));
  }
}

export function* addActionSaga({
  project,
  action,
  access,
}): AddActionSagaGenerator {
  try {
    const projectData: ServerProject = yield call(
      Activity.getActions,
      project,
      access,
    );
    projectData.project_data_text += `/${action}`;

    yield call(Activity.addActions, {
      project: projectData,
      access,
      projectId: project,
    });
    yield put(addAction({ project, action, access }));
  } catch (e) {
    yield put(sideError(e));
  }
}

function* clearHistorySaga({
  project,
  access,
}: any): ClearHistorySagaGenerator {
  try {
    const projectData: any = yield call(Activity.getActions, project, access);
    projectData.project_data_text = '';

    yield call(Activity.clearHistory, {
      project: projectData,
      access,
      projectId: project,
    });
    yield put({ type: TYPES.CLEAR_HISTORY_SUCCESS });
  } catch (e) {
    yield put(sideError(e));
  }
}

export default function* activitySaga() {
  // ACTIONS
  yield takeLatest(TYPES.REQUEST_GET_ACTION, getActionSaga);
  yield takeLatest(TYPES.CLEAR_HISTORY, clearHistorySaga);
}
