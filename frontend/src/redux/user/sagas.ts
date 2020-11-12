/* eslint-disable no-console */
import { takeLatest, call, put, takeEvery, select } from 'redux-saga/effects';
import { FORM_ERROR } from 'final-form';
import * as Actions from './actions';
import {
  convertProfileDataFromResponse,
  convertUserDataFromResponse,
} from '../../api/converters/fromResponse';
import {
  apiActivateUser,
  apiChangeProfileData,
  apiChangeUserData,
  apiGetToken,
  apiIdentifyUser,
  apiResetPasswordConfirmation,
  apiRestorePassword,
  registerUser,
  apiGetUser,
} from '../../api/user';
import TYPES from '../actionTypes';
import { convertUserDataToRequest } from '../../api/converters/toRequest';
import { ServerProfileData, ServerUserData, TokenPair } from '../../types';
import { reqWrapper } from '../project/sagas/shared';
import { openProjects, openSignScreen } from '../history';
import { loginComplete } from './actions';
import { selectUserData } from './selectors';

// eslint-disable-next-line consistent-return
export function* getTokenPairSaga(username: string, password: string) {
  try {
    const tokens: TokenPair = yield call(apiGetToken, { username, password });

    yield put(Actions.setTokenPair(tokens));
    return tokens;
  } catch (e) {
    if (e.response?.data) {
      yield put(Actions.loginComplete(e.response.data));
    } else {
      yield put(Actions.loginComplete({ [FORM_ERROR]: e.message }));
    }
  }
}

export function* loginSaga({
  payload: { username, password },
}: ReturnType<typeof Actions.login>) {
  try {
    const tokenPair = yield call(getTokenPairSaga, username, password);
    if (!tokenPair) return;

    const { id } = yield call(reqWrapper, apiIdentifyUser);

    const userData: ServerUserData = yield call(reqWrapper, apiGetUser, {
      id,
    });

    yield put(
      Actions.setUserData({
        ...convertUserDataFromResponse(userData),
        ...convertProfileDataFromResponse(userData.profile),
      }),
    );

    yield put(loginComplete());
    yield call(openProjects);
  } catch (e) {
    if (typeof e.response?.data === 'object') {
      yield put(Actions.loginComplete(e.response.data));
    } else {
      yield put(Actions.loginComplete({ [FORM_ERROR]: e.message }));
    }
  }
}

export function* changeUserDataSaga({
  payload,
}: ReturnType<typeof Actions.changeUserData>) {
  try {
    const { id } = yield select(selectUserData);

    const newUserData: ServerUserData = yield call(
      reqWrapper,
      apiChangeUserData,
      {
        id,
        data: payload,
      },
    );

    yield put(Actions.setUserData(convertUserDataFromResponse(newUserData)));
    yield put(Actions.changeUserDataComplete());
  } catch (e) {
    if (typeof e.response?.data === 'object') {
      yield put(Actions.changeUserDataComplete(e.response.data));
    } else {
      yield put(Actions.changeUserDataComplete({ [FORM_ERROR]: e.message }));
    }
  }
}

export function* changeProfileDataSaga({
  payload,
}: ReturnType<typeof Actions.changeProfileData>) {
  try {
    const { id } = yield select(selectUserData);

    const newProfileData: ServerProfileData = yield call(
      reqWrapper,
      apiChangeProfileData,
      { id, data: payload },
    );

    yield put(
      Actions.setUserData(convertProfileDataFromResponse(newProfileData)),
    );
    yield put(Actions.changeProfileDataComplete());
  } catch (e) {
    if (typeof e.response?.data === 'object') {
      yield put(Actions.changeProfileDataComplete(e.response.data));
    } else {
      yield put(Actions.changeProfileDataComplete({ [FORM_ERROR]: e.message }));
    }
  }
}

function* registerSaga({
  payload: { username, email, password, firstName, lastName },
}: ReturnType<typeof Actions.register>) {
  try {
    const response = yield call(registerUser, {
      username,
      email,
      password,
    });

    yield call(apiChangeUserData, {
      id: response.id,
      data: convertUserDataToRequest({ firstName, lastName }),
    });

    yield put(
      Actions.setConfirmMessage(
        'Please, check your mail and confirm registration',
      ),
    );

    yield put(Actions.registerComplete());

    openSignScreen('signin');
  } catch (e) {
    if (typeof e.response?.data === 'object') {
      yield put(Actions.registerComplete(e.response.data));
    } else {
      yield put(Actions.registerComplete({ [FORM_ERROR]: e.message }));
    }
  }
}

function* sendResetPasswordMailSaga(
  action: ReturnType<typeof Actions.sendResetPasswordMail>,
) {
  try {
    const {
      payload: { email },
    } = action;
    yield put(Actions.toggleUserLoading(true));

    yield call(apiRestorePassword, email);

    yield put(
      Actions.setConfirmMessage('Please, check your mail and set new password'),
    );
  } catch (e) {
    yield put(Actions.setUserError(e));
  } finally {
    yield put(Actions.toggleUserLoading(false));
  }
}

function* resetPasswordConfirmationSaga(
  action: ReturnType<typeof Actions.resetPasswordConfirmation>,
) {
  try {
    const {
      payload: { uid, token, newPassword, reNewPassword },
    } = action;
    yield put(Actions.toggleUserLoading(true));

    yield call(apiResetPasswordConfirmation, {
      uid,
      token,
      newPassword,
      reNewPassword,
    });

    yield put(Actions.setTokenPair({ access: token, refresh: '' }));
    openSignScreen('signin');
  } catch (e) {
    yield put(Actions.setUserError(e));
  } finally {
    yield put(Actions.toggleUserLoading(false));
  }
}

function* activateUserSaga(action: ReturnType<typeof Actions.activateUser>) {
  try {
    const {
      payload: { uid, token },
    } = action;
    yield put(Actions.toggleUserLoading(true));

    yield call(apiActivateUser, { uid, token });

    yield put(Actions.setTokenPair({ access: token, refresh: '' }));
  } catch (e) {
    yield put(Actions.setUserError(e));
  } finally {
    yield put(Actions.toggleUserLoading(false));
  }
}

// eslint-disable-next-line consistent-return

export function* registerWithGoogleSaga() {
  // TODO Write when the backend will register new users using google token
}

export default function* userSaga() {
  yield takeLatest(TYPES.LOGIN, loginSaga);
  yield takeLatest(TYPES.REGISTER, registerSaga);
  yield takeLatest(TYPES.SEND_RESET_PASSWORD_MAIL, sendResetPasswordMailSaga);
  yield takeLatest(
    TYPES.RESET_PASSWORD_CONFIRMATION,
    resetPasswordConfirmationSaga,
  );
  yield takeLatest(TYPES.ACTIVATE_USER, activateUserSaga);
  yield takeLatest(TYPES.REGISTER_WITH_GOOGLE, registerWithGoogleSaga);
  yield takeEvery(TYPES.CHANGE_USER_DATA, changeUserDataSaga);
  yield takeEvery(TYPES.CHANGE_PROFILE_DATA, changeProfileDataSaga);
}
