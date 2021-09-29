/* eslint-disable import/prefer-default-export */
import { panelErrorMsg } from '@Redux/actions';
import { put } from 'redux-saga/effects';
import { logInSuccess } from './actions';

export function* authUser({ payload }: any): Generator<any, any, any> {
  try {
    const { username, password, realm } = payload;

    yield put(logInSuccess({ id: 1, username, password }));
    localStorage.setItem(
      'login',
      JSON.stringify({ realm, username, password }),
    );
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}
