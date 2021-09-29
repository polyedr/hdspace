/* eslint-disable import/prefer-default-export */
import { panelErrorMsg } from '@Redux/actions';
import TYPES from '@Redux/actionTypes';
import { put, takeLatest } from 'redux-saga/effects';
import { logInSuccess } from './actions';

export function* authUser({ payload }: any) {
  try {
    const { username, password, realm } = payload;
    yield put(logInSuccess({ username, password }));
    localStorage.setItem(
      'login',
      JSON.stringify({ realm, username, password }),
    );
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export default function* chatSaga() {
  yield takeLatest(TYPES.LOGIN_REQUEST, authUser);
}
