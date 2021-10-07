import * as Board from '@Api/pmtools/boardApi';
import { panelErrorMsg } from '@Redux/actions';
import { addActionSaga } from '@Redux/pmtools/activity/sagas';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { RequestColumn } from '@Src/types/pmtools/actions';
import {
  ColumnDeletSagaGenerator,
  ColumnSagaGenerator,
} from '@Src/types/pmtools/generators';
import { call, fork, put } from 'redux-saga/effects';
import * as actions from '../actions/columns';
import { tasksFetch } from './tasks';

export function* columnsFetch({ project }) {
  try {
    const columns = yield call(reqWrapper, Board.fetchColumns, { project });
    yield put(actions.successFetchColumn(columns));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* columnAdd(payload: RequestColumn): ColumnSagaGenerator {
  try {
    const column = yield call(reqWrapper, Board.createColumn, {
      data: payload,
    });
    yield put(actions.successAddColumn(column));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* columnEdit(payload): ColumnSagaGenerator {
  try {
    const data = yield call(reqWrapper, Board.updateColumn, { data: payload });
    yield put(actions.successEditColumn(data));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* columnDelete({ columnId }): ColumnDeletSagaGenerator {
  try {
    yield call(reqWrapper, Board.deleteColumn, { columnId });
    yield put(actions.successDeleteColumn(columnId));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* columnsFetchSaga({
  payload,
}: ReturnType<typeof actions.requestFetchBoard>) {
  yield fork(columnsFetch, payload);
  yield fork(tasksFetch);
}

export function* columnDeleteSaga({
  payload,
}: ReturnType<typeof actions.requestDeleteColumn>) {
  yield fork(columnDelete, payload);
  yield fork(addActionSaga, payload);
}

export function* columnAddSaga({
  payload,
}: ReturnType<typeof actions.requestAddColumn>) {
  yield fork(columnAdd, payload);
  yield fork(addActionSaga, payload);
}

export function* columnEditSaga({
  payload,
}: ReturnType<typeof actions.requestEditColumn>) {
  yield fork(columnEdit, payload);
  yield fork(addActionSaga, payload);
}
