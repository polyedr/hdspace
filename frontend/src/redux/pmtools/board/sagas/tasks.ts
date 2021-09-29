import Board from '@Api/pmtools/boardApi';
import { panelErrorMsg } from '@Redux/actions';
import TYPES from '@Redux/actionTypes';
import { addActionSaga } from '@Redux/pmtools/activity/sagas';
import { RequestDeleteTask, RequestTask } from '@Src/types/pmtools/actions';
import {
  TasksAddSagaGenerator,
  TasksEditSagaGenerator,
} from '@Src/types/pmtools/generators';
import { call, fork, put } from 'redux-saga/effects';
import { requestAction } from '../../activity/actions';

export function* taskAdd(payload: RequestTask): TasksAddSagaGenerator {
  try {
    const task = yield call(Board.createTask, payload);
    yield put({ type: TYPES.SUCCESS_ADD_TASK, payload: task });
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* taskEdit(payload: RequestTask): TasksEditSagaGenerator {
  try {
    const selectedTask = yield call(Board.updateTask, payload);
    yield put({ type: TYPES.SUCCESS_EDIT_TASK, payload: selectedTask });
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* taskDelete(payload: RequestDeleteTask) {
  try {
    const { taskId, project: projectId, action, access } = payload;
    yield call(Board.deleteTask, taskId, access);
    yield put({ type: TYPES.SUCCESS_DELETE_TASK, payload: taskId });
    yield put(requestAction({ projectId, action }));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* taskAddSaga({ payload }: any) {
  yield fork(taskAdd, payload);
  yield fork(addActionSaga, payload);
}

export function* taskEditSaga({ payload }: any) {
  yield fork(taskEdit, payload);
  yield fork(addActionSaga, payload);
}

export function* taskDeleteSaga({ payload }: any) {
  yield fork(taskDelete, payload);
  yield fork(addActionSaga, payload);
}
