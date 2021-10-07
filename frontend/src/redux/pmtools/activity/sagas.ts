import {
  apiAddActions,
  apiClearHistory,
  apiGetActions,
} from '@Api/pmtools/activityApi';
import { panelErrorMsg } from '@Redux/actions';
import TYPES from '@Redux/actionTypes';
import { reqWrapper } from '@Redux/project/sagas/shared';
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
    const { project_data_text: actions } = yield call(
      reqWrapper,
      apiGetActions,
      {
        project: payload,
      },
    );
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
    const data: ServerProject = yield call(reqWrapper, apiGetActions, {
      project: payload,
    });
    data.project_data_text = '';
    yield call(reqWrapper, apiClearHistory, {
      data,
      project: payload,
    });
    yield put(successClearHistoryAction());
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* addActionSaga({ project, action }: any): ActionSagaGenerator {
  try {
    const data: ServerProject = yield call(reqWrapper, apiGetActions, {
      project,
    });
    data.project_data_text += `/${action}`;
    yield call(reqWrapper, apiAddActions, { data, project });
    yield put(successAction({ project, action }));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export default function* activitySaga() {
  yield takeLatest(TYPES.GET_ACTION, getActionSaga);
  yield takeLatest(TYPES.CLEAR_HISTORY, clearHistorySaga);
}
