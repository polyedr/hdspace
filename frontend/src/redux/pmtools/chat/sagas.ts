import { convertUserDataFromResponse } from '@Api/converters/fromResponse';
import {
  apiAuthUser,
  apiGetMessages,
  apiRegisterUser,
  apiSendMessage,
} from '@Api/pmtools/chatApi';
import { apiChangeProfileData, apiGetUser } from '@Api/user';
import { panelErrorMsg } from '@Redux/actions';
import TYPES from '@Redux/actionTypes';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { setUserData } from '@Redux/user/actions';
import { selectUserData } from '@Redux/user/selectors';
import generator from 'generate-password';
import { ServerUserData } from '@Src/types';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { configAdmin, configUser } from '@Constants/pmtools/zulipChatLoginData';
import { AuthParams } from '@Src/types/pmtools/types';
import * as action from './actions';

export function* projectStreamMessagesSaga({ payload }: any): any {
  try {
    const { stream } = payload;
    const { email, profile } = yield select(selectUserData);
    const config = configUser(email, profile.parameters.passwordZulip);
    const { messages } = yield call(apiGetMessages, stream, config);
    yield put(action.successProjectStreamMessages(messages));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* projectSendMessageSaga({
  payload: { message, stream },
}: any): any {
  try {
    const { email, profile } = yield select(selectUserData);
    const config = configUser(email, profile.parameters.passwordZulip);
    yield call(apiSendMessage, stream, config, message);
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* loginUserSaga({
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
      yield put(action.successLoginChatUser(client));
      localStorage.setItem('login', JSON.stringify({ password }));
    }
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* registerZulipUserSaga(): any {
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
        yield put(action.successLoginChatUser(client));
        localStorage.setItem('login', JSON.stringify({ password }));
      }
    }
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* logoutUserSaga() {
  try {
    localStorage.removeItem('login');
    yield put(action.successLogoutChatUser());
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export default function* chatSaga() {
  yield takeLatest(TYPES.LOGIN_PMTOOLS, loginUserSaga);
  yield takeLatest(TYPES.LOGOUT_PMTOOLS, logoutUserSaga);
  yield takeLatest(TYPES.GET_STREAM_MESSAGES, projectStreamMessagesSaga);
  yield takeLatest(TYPES.SEND_MESSAGE_ZULIP, projectSendMessageSaga);
  yield takeLatest(TYPES.REGISTER_PMTOOLS, registerZulipUserSaga);
}
