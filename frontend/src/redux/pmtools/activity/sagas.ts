import Activity from '@Api/pmtools/activityApi';
import { panelErrorMsg } from '@Redux/actions';
import TYPES from '@Redux/actionTypes';
import { ActionSagaGenerator } from '@Src/types/pmtools/generators';
import { ServerProject } from '@Src/types/types';
import { put, call, takeLatest } from 'redux-saga/effects';
import {
  clearHistoryAction,
  requestGetAction,
  successAction,
  successClearHistoryAction,
  successGetAction,
} from './actions';

function* getActionSaga({
  payload: { project, access },
}: ReturnType<typeof requestGetAction>) {
  try {
    const { project_data_text: actions } = yield call(Activity.getActions, {
      project,
      access,
    });
    const data = actions ? actions.split('/').reverse() : [];
    yield put(successGetAction(data));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

function* clearHistorySaga({
  payload,
}: ReturnType<typeof clearHistoryAction>): ActionSagaGenerator {
  try {
    const { project, access } = payload;
    const data: ServerProject = yield call(Activity.getActions, {
      project,
      access,
    });
    data.project_data_text = '';
    yield call(Activity.clearHistory, { data, access, project });
    yield put(successClearHistoryAction());
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* addActionSaga({
  project,
  action,
  access,
}: any): ActionSagaGenerator {
  try {
    const data: ServerProject = yield call(Activity.getActions, {
      project,
      access,
    });
    data.project_data_text += `/${action}`;
    yield call(Activity.addActions, { data, access, project });
    yield put(successAction({ project, action, access }));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export default function* activitySaga() {
  yield takeLatest(TYPES.GET_ACTION, getActionSaga);
  yield takeLatest(TYPES.CLEAR_HISTORY, clearHistorySaga);
}
