import { convertUserDataFromResponse } from '@Api/converters/fromResponse';
import { apiAuthUser, apiRegisterUser } from '@Api/pmtools/chatApi';
import { apiChangeProfileData, apiGetUser } from '@Api/user';
import { panelErrorMsg } from '@Redux/actions';
import TYPES from '@Redux/actionTypes';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { setUserData } from '@Redux/user/actions';
import { selectUserData } from '@Redux/user/selectors';
import { ServerUserData } from '@Src/types/types';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { successLoginChatUser, successLogoutChatUser } from './actions';

const config = {
  realm: 'https://zulip.adevi.info/',
  username: 'ivan@intelligentprofitsolutions.com',
  apiKey: 'VBV7IeQogwWRjhJHyubg0Z1m3gGuzrS0',
  password: 'E52$*&(W]*j<Q%Wu',
};

export function* loginUser({ payload: password }: any) {
  try {
    const { email: username } = yield select(selectUserData);
    const realm = `https://zulip.adevi.info/`;
    const client = yield call(apiAuthUser, { realm, username, password });
    if (client && client.config) {
      yield put(successLoginChatUser(client));
      localStorage.setItem('login', JSON.stringify({ password }));
    }
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* registerZulipUser() {
  try {
    const { id, email, username } = yield select(selectUserData);
    const realm = `https://zulip.adevi.info/`;
    const password = 'genty123HRT';

    const res = yield call(apiRegisterUser, config, {
      email,
      password,
      full_name: `${username}-adevi-${id}`,
      short_name: `${username}-${id}`,
    });
    if (res.result === 'success') {
      yield call(apiChangeProfileData, {
        id,
        data: {
          parameters: { passwordZulip: password },
        },
      });
      const userData: ServerUserData = yield call(reqWrapper, apiGetUser, {
        id,
      });

      yield put(
        setUserData({
          ...convertUserDataFromResponse(userData),
        }),
      );

      const client = yield call(apiAuthUser, {
        realm,
        username: email,
        password,
      });
      if (client && client.config) {
        yield put(successLoginChatUser(client));
        localStorage.setItem('login', JSON.stringify({ password }));
      }
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
  yield takeLatest(TYPES.REGISTER_PMTOOLS, registerZulipUser);
}
