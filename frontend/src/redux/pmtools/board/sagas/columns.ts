import Board from '@Api/pmtools/boardApi';
import { panelErrorMsg } from '@Redux/actions';
import TYPES from '@Redux/actionTypes';
import {
  ColumnDeletSagaGenerator,
  ColumnSagaGenerator,
} from '@Src/types/pmtools/generators';
import { ColumnData } from '@Src/types/pmtools/types';
import { call, put } from 'redux-saga/effects';
import { requestAction } from '../../activity/actions';
import { requestLoaderBoard } from '../actions/columns';

export function* columnsFetchSaga({ payload }: any): any {
  try {
    yield put(requestLoaderBoard(true));
    const receivedData: Array<any> = yield call(
      Board.fetchColumns,
      payload.projectId,
      payload.access,
    );
    console.log(receivedData);
    const tasks = yield call(Board.fetchTasks, payload.access);
    yield put({ type: TYPES.SUCCESS_FETCH_TASKS, payload: tasks });

    const data: ColumnData[] = receivedData.map((item: any) => ({
      ...item,
      tasks: [],
    }));
    yield put({ type: TYPES.SUCCESS_FETCH_COLUMNS, payload: data });
    yield put(requestLoaderBoard(false));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* columnAddSaga({ payload }: any): ColumnSagaGenerator {
  try {
    const { title, description, projectId, action, access } = payload;
    const data = yield call(Board.createColumn, {
      access,
      title,
      description,
      project: projectId,
    });
    yield put({ type: TYPES.SUCCESS_ADD_COLUMN, payload: data });
    yield put(requestAction({ projectId, action }));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* columnEditSaga({ payload }: any): ColumnSagaGenerator {
  try {
    const { id, title, description, projectId, action, access } = payload;
    const data = yield call(Board.updateColumn, {
      id,
      title,
      description,
      access,
    });
    yield put({ type: TYPES.SUCCESS_EDIT_COLUMN, payload: data });
    yield put(requestAction({ projectId, action }));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* columnDeleteSaga({ payload }: any): ColumnDeletSagaGenerator {
  try {
    const { columnId, projectId, action, access } = payload;
    yield call(Board.deleteColumn, columnId, access);
    yield put({ type: TYPES.SUCCESS_DELETE_COLUMN, payload: columnId });
    yield put(requestAction({ projectId, action }));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}
