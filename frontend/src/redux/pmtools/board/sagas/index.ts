import TYPES from '@Redux/actionTypes';
import { takeLatest } from 'redux-saga/effects';
import { fetchBoard } from './columns';

export default function* boardSaga() {
  yield takeLatest(TYPES.BOARD_FETCH, fetchBoard);
}
