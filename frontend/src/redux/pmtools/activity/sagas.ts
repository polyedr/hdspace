import {
  apiAddActions,
  apiClearHistory,
  apiGetActions,
} from '@Api/pmtools/activityApi';
import { panelErrorMsg } from '@Redux/actions';
import TYPES from '@Redux/actionTypes';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { RequestAction } from '@Src/types/pmtools/actions';
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

function* getActionSaga({ payload }: ReturnType<typeof requestGetAction>) {
  try {
    const { project_data_activity_json: actions } = yield call(
      reqWrapper,
      apiGetActions,
      {
        project: payload,
      },
    );
    yield put(successGetAction(JSON.parse(actions)));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

function* clearHistorySaga({
  payload: project,
}: ReturnType<typeof clearHistoryAction>): ActionSagaGenerator {
  try {
    const data: ServerProject = yield call(reqWrapper, apiGetActions, {
      project,
    });
    data.project_data_activity_json = '[]';
    yield call(reqWrapper, apiClearHistory, {
      data,
      project,
    });
    yield put(successClearHistoryAction());
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* addActionSaga({
  project,
  action,
}: RequestAction): ActionSagaGenerator {
  try {
    const data: ServerProject = yield call(reqWrapper, apiGetActions, {
      project,
    });
    const projectDataActivity = JSON.parse(
      data.project_data_activity_json || '{}',
    );
    const actionCorrectly = {
      action,
      platform: 'PM-TOOLS',
      priority: 'high',
    };
    projectDataActivity.push(actionCorrectly);
    data.project_data_activity_json = JSON.stringify(projectDataActivity);
    yield call(reqWrapper, apiAddActions, { data, project });
    yield put(successAction(actionCorrectly));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export default function* activitySaga() {
  yield takeLatest(TYPES.GET_ACTION, getActionSaga);
  yield takeLatest(TYPES.CLEAR_HISTORY, clearHistorySaga);
}
