import ChatApi from '@Api/pmtools/chatApi';
import TYPES from '@Redux/actionTypes';
import { call, put, takeLatest } from 'redux-saga/effects';
import { logInFail, logInSuccess } from './actions';

function* authUser({ payload }: any): Generator<any, any, any> {
  try {
    const { username, password, realm } = payload;

    const client = yield call(ChatApi.authenticateUser, {
      realm,
      username,
      password,
    });

    if (client && client.config) {
      yield put(logInSuccess(client));
      localStorage.setItem(
        'login',
        JSON.stringify({ realm, username, password }),
      );
    }
  } catch (error) {
    yield put(logInFail(error));
  }
}

export default function* chatSaga() {
  yield takeLatest(TYPES.LOGIN_REQUEST, authUser);
}
