/* eslint-disable import/prefer-default-export */
import { put } from 'redux-saga/effects';
import { logInFail, logInSuccess } from './actions';

export function* authUser({ payload }: any): Generator<any, any, any> {
  try {
    const { username, password, realm } = payload;

    yield put(logInSuccess({ id: 1, username, password }));
    localStorage.setItem(
      'login',
      JSON.stringify({ realm, username, password }),
    );
  } catch (error) {
    yield put(logInFail(error));
  }
}
