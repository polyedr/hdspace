import Activity from '@Api/pmtools/activityApi';
import { panelErrorMsg } from '@Redux/actions';
import TYPES from '@Redux/actionTypes';
import { ActionSagaGenerator } from '@Src/types/pmtools/generators';
import { ServerProject } from '@Src/types/types';
import { put, call, takeLatest } from 'redux-saga/effects';
import { addAction, clearHistoryAction, getActions } from './actions';

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
    yield put(panelErrorMsg(e));
  }
}

export function* addActionSaga({
  project,
  action,
  access,
}): ActionSagaGenerator {
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
    yield put(panelErrorMsg(e));
  }
}

function* clearHistorySaga({
  payload,
}: ReturnType<typeof clearHistoryAction>): ActionSagaGenerator {
  try {
    const { project, access } = payload;
    const projectData: ServerProject = yield call(
      Activity.getActions,
      project,
      access,
    );
    projectData.project_data_text = '';
    yield call(Activity.clearHistory, {
      project: projectData,
      access,
      projectId: project,
    });
    yield put({ type: TYPES.CLEAR_HISTORY_SUCCESS });
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export default function* activitySaga() {
  yield takeLatest(TYPES.REQUEST_GET_ACTION, getActionSaga);
  yield takeLatest(TYPES.CLEAR_HISTORY, clearHistorySaga);
}
