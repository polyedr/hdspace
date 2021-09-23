import { takeLatest } from 'redux-saga/effects';
import TYPES from '@Redux/actionTypes';
import {
  columnAddSaga,
  columnDeleteSaga,
  columnEditSaga,
  columnsFetchSaga,
} from './columns';
import {
  taskAddSaga,
  taskDeleteSaga,
  taskEditSaga,
  tasksFetchSaga,
} from './tasks';

export default function* boardSaga() {
  //   BOARD ->
  yield takeLatest(TYPES.REQUEST_FETCH_BOARD, columnsFetchSaga);
  yield takeLatest(TYPES.REQUEST_FETCH_TASKS, tasksFetchSaga);
  // BOARD -> Task
  yield takeLatest(TYPES.REQUEST_EDIT_TASK, taskEditSaga);
  yield takeLatest(TYPES.REQUEST_ADD_TASK, taskAddSaga);
  yield takeLatest(TYPES.REQUEST_DELETE_TASK, taskDeleteSaga);
  // BOARD -> Column
  yield takeLatest(TYPES.REQUEST_EDIT_COLUMN, columnEditSaga);
  yield takeLatest(TYPES.REQUEST_ADD_COLUMN, columnAddSaga);
  yield takeLatest(TYPES.REQUEST_DELETE_COLUMN, columnDeleteSaga);
}
