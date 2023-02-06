import { put, call, takeLatest } from 'redux-saga/effects';
import {
  apiAddActions,
  apiClearHistory,
  apiGetActions,
} from '@Api/pmtools/activityApi';
import { panelErrorMsg } from '@Redux/actions';
import TYPES from '@Redux/actionTypes';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { ActionSagaGenerator } from '@Src/types/pmtools/generators';
import { ActionTypePM } from '@Src/types/pmtools/types';
import { ServerProject } from '@Src/types';
import * as actions from './actions';

function* getActionSaga({
  payload,
}: ReturnType<typeof actions.requestGetAction>) {
  try {
    const { project_data_activity_json } = yield call(
      reqWrapper,
      apiGetActions,
      {
        project: payload,
      },
    );
    yield put(
      actions.successGetAction(
        JSON.parse(project_data_activity_json).reverse(),
      ),
    );
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

function* clearHistorySaga({
  payload: project,
}: ReturnType<typeof actions.clearHistoryAction>): ActionSagaGenerator {
  try {
    const data: ServerProject = yield call(reqWrapper, apiGetActions, {
      project,
    });
    data.project_data_activity_json = '[]';
    yield call(reqWrapper, apiClearHistory, {
      data,
      project,
    });
    yield put(actions.successClearHistoryAction());
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* addActionSaga({
  payload: { project, action, platform, priority },
}: ReturnType<typeof actions.requestAddHistory>): ActionSagaGenerator {
  try {
    const data: ServerProject = yield call(reqWrapper, apiGetActions, {
      project,
    });
    const projectDataActivity = JSON.parse(
      data.project_data_activity_json || '{}',
    );
    const actionCorrectly: ActionTypePM = {
      action,
      platform: platform || 'PM-TOOLS',
      priority: priority || 'low',
    };
    projectDataActivity.push(actionCorrectly);
    data.project_data_activity_json = JSON.stringify(projectDataActivity);
    yield call(reqWrapper, apiAddActions, { data, project });
    yield put(actions.successAction(actionCorrectly));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export default function* activitySaga() {
  yield takeLatest(TYPES.GET_ACTION, getActionSaga);
  yield takeLatest(TYPES.CLEAR_HISTORY, clearHistorySaga);
  yield takeLatest(TYPES.ADD_ACTION, addActionSaga);
}
