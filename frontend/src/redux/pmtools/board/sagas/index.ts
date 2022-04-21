import { takeLatest } from 'redux-saga/effects';
import TYPES from '@Redux/actionTypes';
import * as columnSaga from './columns';
import * as taskSaga from './tasks';

export default function* boardSaga() {
  yield takeLatest(TYPES.UPDATE_CARD_INDEX, taskSaga.moveCardToList);
  yield takeLatest(TYPES.REQUEST_FETCH_BOARD, columnSaga.columnsFetchSaga);
  yield takeLatest(TYPES.UPDATE_COLUMN_INDEX, columnSaga.moveColumnToList);
  yield takeLatest(TYPES.EDIT_TASK, taskSaga.taskEditSaga);
  yield takeLatest(TYPES.ADD_TASK, taskSaga.taskAddSaga);
  yield takeLatest(TYPES.DELETE_TASK, taskSaga.taskDeleteSaga);
  yield takeLatest(TYPES.EDIT_COLUMN, columnSaga.columnEditSaga);
  yield takeLatest(TYPES.ADD_COLUMN, columnSaga.columnAddSaga);
  yield takeLatest(TYPES.DELETE_MEMBER_TASK, taskSaga.taskDeleteMemberSaga);
  yield takeLatest(TYPES.DELETE_COLUMN, columnSaga.columnDeleteSaga);
}
