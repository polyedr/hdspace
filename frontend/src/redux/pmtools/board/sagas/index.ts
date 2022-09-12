import TYPES from '@Redux/actionTypes';
import { takeEvery, takeLatest } from 'redux-saga/effects';
import {
  createColumnSaga,
  deleteColumnSaga,
  fetchBoard,
  updateColumnSaga,
  updateColumnsOrderSaga,
} from './columns';
import {
  createTaskSaga,
  fetchTaskSaga,
  updateTaskSags,
  updateTasksOrderSaga,
} from './tasks';

export default function* boardSaga() {
  yield takeLatest(TYPES.BOARD_FETCH, fetchBoard);
  yield takeLatest(TYPES.BOARD_UPDATE_COLUMNS_ORDER, updateColumnsOrderSaga);
  yield takeLatest(TYPES.BOARD_CREATE_COLUMN, createColumnSaga);
  yield takeLatest(TYPES.BOARD_DELETE_COLUMN, deleteColumnSaga);
  yield takeLatest(TYPES.BOARD_UPDATE_COLUMN, updateColumnSaga);

  yield takeLatest(TYPES.BOARD_FETCH_TASK, fetchTaskSaga);
  yield takeLatest(TYPES.BOARD_UPDATE_TASKS_ORDER, updateTasksOrderSaga);
  yield takeLatest(TYPES.BOARD_CREATE_TASK, createTaskSaga);
  yield takeEvery(TYPES.BOARD_UPDATE_TASK, updateTaskSags);
}
