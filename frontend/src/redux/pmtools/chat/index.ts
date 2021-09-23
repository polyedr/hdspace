import TYPES from '@Redux/actionTypes';
import { takeLatest } from 'redux-saga/effects';
import { authUser } from './sagas';

export default function* chatSaga() {
  // CHAT -> Chat
  yield takeLatest(TYPES.LOGIN_REQUEST, authUser);
}
