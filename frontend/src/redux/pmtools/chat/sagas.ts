/* eslint-disable import/prefer-default-export */
import { panelErrorMsg } from '@Redux/actions';
import TYPES from '@Redux/actionTypes';
import { put, takeLatest } from 'redux-saga/effects';
import { successLoginChatUser, successLogoutChatUser } from './actions';

export function* authUser({
  payload,
}: ReturnType<typeof successLoginChatUser>) {
  try {
    const { realm, email, password } = payload;
    yield put(successLoginChatUser({ realm, email, password }));
    localStorage.setItem('login', JSON.stringify({ realm, email, password }));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* logoutUser() {
  try {
    localStorage.removeItem('login');
    yield put(successLogoutChatUser());
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export default function* chatSaga() {
  yield takeLatest(TYPES.LOGIN_PMTOOLS, authUser);
  yield takeLatest(TYPES.LOGOUT_PMTOOLS, logoutUser);
}
