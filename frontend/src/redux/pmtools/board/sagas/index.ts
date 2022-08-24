import TYPES from '@Redux/actionTypes';
import { takeLatest } from 'redux-saga/effects';
import { fetchBoard, updateColumnsOrderSaga } from './columns';
import { updateTasksOrderSaga } from './tasks';

export default function* boardSaga() {
  yield takeLatest(TYPES.BOARD_FETCH, fetchBoard);
  yield takeLatest(TYPES.BOARD_UPDATE_COLUMNS_ORDER, updateColumnsOrderSaga);
  yield takeLatest(TYPES.BOARD_UPDATE_TASKS_ORDER, updateTasksOrderSaga);
}
