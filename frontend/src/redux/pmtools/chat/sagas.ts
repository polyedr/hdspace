import apiAuthUser from '@Api/pmtools/chatApi';
import { panelErrorMsg } from '@Redux/actions';
import TYPES from '@Redux/actionTypes';
import { selectUserData } from '@Redux/user/selectors';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { successLoginChatUser, successLogoutChatUser } from './actions';

export function* loginUser({ payload: { password } }: any) {
  try {
    const { email: username } = yield select(selectUserData);
    const realm = `https://adevi-testing.zulipchat.com`;
    const client = yield call(apiAuthUser, {
      realm,
      username,
      password,
    });
    if (client && client.config) {
      yield put(successLoginChatUser(client));
      localStorage.setItem(
        'login',
        JSON.stringify({ realm, username, password }),
      );
    }
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
  yield takeLatest(TYPES.LOGIN_PMTOOLS, loginUser);
  yield takeLatest(TYPES.LOGOUT_PMTOOLS, logoutUser);
}
