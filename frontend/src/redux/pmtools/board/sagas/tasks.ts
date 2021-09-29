import Board from '@Api/pmtools/boardApi';
import TYPES from '@Redux/actionTypes';
import {
  TasksAddSagaGenerator,
  TasksEditSagaGenerator,
} from '@Src/pm-types/board/generators';
import { call, put } from 'redux-saga/effects';
import { requestAction } from '../../activity/actions';
import { errorBoard } from '../actions/columns';

export function* taskAddSaga({ payload }: any): TasksAddSagaGenerator {
  try {
    const data = {
      access: payload.access,
      title: payload.title,
      description: payload.description,
      status: payload.status,
      column: payload.column,
      creator: payload.creator,
      owner: payload.owner,
    };
    const task = yield call(Board.createTask, data);
    yield put({ type: TYPES.SUCCESS_ADD_TASK, payload: task });
    yield put(
      requestAction({ projectId: payload.projectId, action: payload.action }),
    );
  } catch (e) {
    yield put(errorBoard('Error add task'));
  }
}

export function* taskEditSaga({ payload }: any): TasksEditSagaGenerator {
  try {
    const data = {
      access: payload.access,
      id: payload.id,
      title: payload.title,
      description: payload.description,
      status: payload.status,
      column: payload.column,
      creator: payload.creator,
      owner: payload.owner,
    };
    const selectedTask = yield call(Board.updateTask, data);
    yield put({ type: TYPES.SUCCESS_EDIT_TASK, payload: selectedTask });
    yield put(
      requestAction({ projectId: payload.projectId, action: payload.action }),
    );
  } catch (e) {
    yield put(errorBoard('Error edit task'));
  }
}

export function* taskDeleteSaga({ payload }: any) {
  try {
    const { taskId, projectId, action, access } = payload;
    yield call(Board.deleteTask, taskId, access);
    yield put({ type: TYPES.SUCCESS_DELETE_TASK, payload: taskId });
    yield put(requestAction({ projectId, action }));
  } catch (e) {
    yield put(errorBoard('Error delete task'));
  }
}
