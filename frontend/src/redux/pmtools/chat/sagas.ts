import { convertUserDataFromResponse } from '@Api/converters/fromResponse';
import { apiAuthUser, apiRegisterUser } from '@Api/pmtools/chatApi';
import { apiChangeProfileData, apiGetUser } from '@Api/user';
import { panelErrorMsg } from '@Redux/actions';
import TYPES from '@Redux/actionTypes';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { setUserData } from '@Redux/user/actions';
import { selectUserData } from '@Redux/user/selectors';
import generator from 'generate-password';
import { ServerUserData } from '@Src/types/types';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { configAdmin } from '@Constants/pmtools/zulipChatLoginData';
import { AuthParams } from '@Src/types/pmtools/types';
import { successLoginChatUser, successLogoutChatUser } from './actions';

export function* loginUser({
  payload: password,
}: {
  payload: AuthParams['password'];
  type: string;
}) {
  try {
    const { email: username } = yield select(selectUserData);
    const client = yield call(apiAuthUser, {
      realm: configAdmin.realm,
      username,
      password,
    });
    if (client && client.config) {
      yield put(successLoginChatUser(client));
      localStorage.setItem('login', JSON.stringify({ password }));
    }
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* registerZulipUser(): any {
  try {
    const { id, email, username }: ServerUserData = yield select(
      selectUserData,
    );
    const password = generator.generate();

    const res = yield call(apiRegisterUser, configAdmin, {
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
        realm: configAdmin.realm,
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
