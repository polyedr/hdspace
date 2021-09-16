import Board from '@Api/pmtools/boardApi';
import TYPES from '@Redux/actionTypes';
import {
  ColumnDeletSagaGenerator,
  ColumnSagaGenerator,
  ColumnsFetchSagaGenerator,
} from '@Src/pm-types/board/generators';
import { IColumn } from '@Src/pm-types/board/types';
import { call, put } from 'redux-saga/effects';
import { requestAction } from '../../activity/actions';
import { errorBoard, requestLoaderBoard } from '../actions/columns';
import { requestFetchTask } from '../actions/tasks';

export function* columnsFetchSaga(): ColumnsFetchSagaGenerator {
  try {
    yield put(requestLoaderBoard(true));
    const receivedData: Array<any> = yield call(Board.fetchColumns);
    const data: IColumn[] = receivedData.map((item: any) => ({
      ...item,
      tasks: [],
    }));
    yield put({ type: TYPES.SUCCESS_FETCH_COLUMNS, payload: data });
    yield put(requestFetchTask());
    yield put(requestLoaderBoard(false));
  } catch (e) {
    yield put(errorBoard('Error fetch column'));
  }
}

export function* columnAddSaga({ payload }: any): ColumnSagaGenerator {
  try {
    const { title, description, projectId, action } = payload;
    const data = yield call(Board.createColumn, {
      title,
      description,
      project: projectId,
    });
    yield put({ type: TYPES.SUCCESS_ADD_COLUMN, payload: data });
    yield put(requestAction({ projectId, action }));
  } catch (e) {
    yield put(errorBoard('Error add column'));
  }
}

export function* columnEditSaga({ payload }: any): ColumnSagaGenerator {
  try {
    const { id, title, description, projectId, action } = payload;
    const data = yield call(Board.updateColumn, { id, title, description });
    yield put({ type: TYPES.SUCCESS_EDIT_COLUMN, payload: data });
    yield put(requestAction({ projectId, action }));
  } catch (e) {
    yield put(errorBoard('Error edit column'));
  }
}

export function* columnDeleteSaga({ payload }: any): ColumnDeletSagaGenerator {
  try {
    const { columnId, projectId, action } = payload;
    yield call(Board.deleteColumn, columnId);
    yield put({ type: TYPES.SUCCESS_DELETE_COLUMN, payload: columnId });
    yield put(requestAction({ projectId, action }));
  } catch (e) {
    yield put(errorBoard('Error delete column'));
  }
}
