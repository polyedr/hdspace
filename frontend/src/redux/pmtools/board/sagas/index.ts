import { takeLatest } from 'redux-saga/effects';
import TYPES from '@Redux/actionTypes';
import {
  columnAddSaga,
  columnDeleteSaga,
  columnEditSaga,
  columnsFetchSaga,
} from './columns';
import { taskAddSaga, taskDeleteSaga, taskEditSaga } from './tasks';

export default function* boardSaga() {
  yield takeLatest(TYPES.REQUEST_FETCH_BOARD, columnsFetchSaga);
  yield takeLatest(TYPES.EDIT_TASK, taskEditSaga);
  yield takeLatest(TYPES.ADD_TASK, taskAddSaga);
  yield takeLatest(TYPES.DELETE_TASK, taskDeleteSaga);
  yield takeLatest(TYPES.EDIT_COLUMN, columnEditSaga);
  yield takeLatest(TYPES.ADD_COLUMN, columnAddSaga);
  yield takeLatest(TYPES.DELETE_COLUMN, columnDeleteSaga);
}
