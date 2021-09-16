import TYPES from '@Redux/actionTypes';
import { put, takeLatest } from 'redux-saga/effects';
import { logInFail, logInSuccess } from './actions';

function* authUser({ payload }: any): Generator<any, any, any> {
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

export default function* chatSaga() {
  yield takeLatest(TYPES.LOGIN_REQUEST, authUser);
}
