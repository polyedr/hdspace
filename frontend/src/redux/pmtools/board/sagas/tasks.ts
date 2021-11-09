import * as Board from '@Api/pmtools/board/tasksApi';
import { panelErrorMsg } from '@Redux/actions';
import TYPES from '@Redux/actionTypes';
import { requestAddHistory } from '@Redux/pmtools/activity/actions';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import {
  TasksAddSagaGenerator,
  TasksEditSagaGenerator,
} from '@Src/types/pmtools/generators';
import { call, put, select } from 'redux-saga/effects';
import {
  requestAddTask,
  requestDeleteTask,
  requestEditTask,
} from '../actions/tasks';

export function* taskAddSaga({
  payload: { project, action, ...payload },
}: ReturnType<typeof requestAddTask>): TasksAddSagaGenerator {
  try {
    const task = yield call(reqWrapper, Board.createTask, {
      data: payload,
    });
    yield put({ type: TYPES.ADD_TASK_SUCCESS, payload: task });
    yield put(requestAddHistory({ project, ...action }));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* taskEditSaga({
  payload: { project, action, ...payload },
}: ReturnType<typeof requestEditTask>): TasksEditSagaGenerator {
  try {
    const project = yield select(selectCurrentProjectId);
    const selectedTask = yield call(reqWrapper, Board.updateTask, {
      data: payload,
    });
    yield put({ type: TYPES.EDIT_TASK_SUCCESS, payload: selectedTask });
    yield put(requestAddHistory({ project, ...action }));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* taskDeleteSaga({
  payload: { taskId, action },
}: ReturnType<typeof requestDeleteTask>) {
  try {
    const project: number = yield select(selectCurrentProjectId);
    yield call(reqWrapper, Board.deleteTask, { taskId });
    yield put({ type: TYPES.DELETE_TASK_SUCCESS, payload: taskId });
    yield put(requestAddHistory({ project, ...action }));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}
