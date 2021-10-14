import * as Board from '@Api/pmtools/boardApi';
import { panelErrorMsg } from '@Redux/actions';
import TYPES from '@Redux/actionTypes';
import { addActionSaga } from '@Redux/pmtools/activity/sagas';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { RequestDeleteTask, RequestTask } from '@Src/types/pmtools/actions';
import {
  TasksAddSagaGenerator,
  TasksEditSagaGenerator,
} from '@Src/types/pmtools/generators';
import { call, fork, put } from 'redux-saga/effects';
import {
  requestAddTask,
  requestDeleteTask,
  requestEditTask,
} from '../actions/tasks';

export function* tasksFetch() {
  try {
    const tasks = yield call(reqWrapper, Board.fetchTasks);
    yield put({ type: TYPES.FETCH_TASKS_SUCCESS, payload: tasks });
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* taskAdd(payload: RequestTask): TasksAddSagaGenerator {
  try {
    const task = yield call(reqWrapper, Board.createTask, { data: payload });
    yield put({ type: TYPES.ADD_TASK_SUCCESS, payload: task });
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* taskEdit(payload: RequestTask): TasksEditSagaGenerator {
  try {
    const selectedTask = yield call(reqWrapper, Board.updateTask, {
      data: payload,
    });
    yield put({ type: TYPES.EDIT_TASK_SUCCESS, payload: selectedTask });
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* taskDelete({ taskId }: RequestDeleteTask) {
  try {
    yield call(reqWrapper, Board.deleteTask, { taskId });
    yield put({ type: TYPES.DELETE_TASK_SUCCESS, payload: taskId });
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* taskAddSaga({ payload }: ReturnType<typeof requestAddTask>) {
  console.log(payload);
  yield fork(taskAdd, payload);
  yield fork(addActionSaga, payload);
}

export function* taskEditSaga({ payload }: ReturnType<typeof requestEditTask>) {
  yield fork(taskEdit, payload);
  yield fork(addActionSaga, payload);
}

export function* taskDeleteSaga({
  payload,
}: ReturnType<typeof requestDeleteTask>) {
  yield fork(taskDelete, payload);
  yield fork(addActionSaga, payload);
}
