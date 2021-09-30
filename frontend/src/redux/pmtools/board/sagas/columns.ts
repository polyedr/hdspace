import Board from '@Api/pmtools/boardApi';
import { panelErrorMsg } from '@Redux/actions';
import TYPES from '@Redux/actionTypes';
import { addActionSaga } from '@Redux/pmtools/activity/sagas';
import {
  ColumnDeletSagaGenerator,
  ColumnSagaGenerator,
} from '@Src/types/pmtools/generators';
import { ColumnData } from '@Src/types/pmtools/types';
import { call, fork, put } from 'redux-saga/effects';
import {
  requestAddColumn,
  requestDeleteColumn,
  requestEditColumn,
  requestFetchBoard,
  requestLoaderBoard,
} from '../actions/columns';
import { tasksFetch } from './tasks';

export function* columnsFetch({ project, access }) {
  try {
    const columns: Array<ColumnData> = yield call(
      Board.fetchColumns,
      project,
      access,
    );
    yield put({ type: TYPES.SUCCESS_FETCH_COLUMNS, payload: columns });
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* columnAdd(payload): ColumnSagaGenerator {
  try {
    const column = yield call(Board.createColumn, payload);
    yield put({ type: TYPES.SUCCESS_ADD_COLUMN, payload: column });
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* columnEdit(payload): ColumnSagaGenerator {
  try {
    const data = yield call(Board.updateColumn, payload);
    yield put({ type: TYPES.SUCCESS_EDIT_COLUMN, payload: data });
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* columnDelete({ columnId, access }): ColumnDeletSagaGenerator {
  try {
    yield call(Board.deleteColumn, columnId, access);
    yield put({ type: TYPES.SUCCESS_DELETE_COLUMN, payload: columnId });
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* columnsFetchSaga({
  payload,
}: ReturnType<typeof requestFetchBoard>) {
  yield put(requestLoaderBoard(true));
  yield fork(columnsFetch, payload);
  yield fork(tasksFetch, payload);
  yield put(requestLoaderBoard(false));
}

export function* columnDeleteSaga({
  payload,
}: ReturnType<typeof requestDeleteColumn>) {
  yield fork(columnDelete, payload);
  yield fork(addActionSaga, payload);
}

export function* columnAddSaga({
  payload,
}: ReturnType<typeof requestAddColumn>) {
  yield fork(columnAdd, payload);
  yield fork(addActionSaga, payload);
}

export function* columnEditSaga({
  payload,
}: ReturnType<typeof requestEditColumn>) {
  yield fork(columnEdit, payload);
  yield fork(addActionSaga, payload);
}
