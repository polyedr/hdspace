/* eslint-disable no-console */
import { takeLatest, call, put, select, takeEvery } from 'redux-saga/effects';
import * as Actions from './actions';
import {
  convertProfileDataFromResponse,
  convertUserDataFromResponse,
} from '../../api/converters/fromResponse';
import {
  apiActivateUser,
  apiChangeProfileData,
  apiChangeUserData,
  apiGetProfile,
  apiGetToken,
  apiIdentifyUser,
  apiRefreshToken,
  apiResetPasswordConfirmation,
  apiRestorePassword,
  apiSendActivationMail,
  apiGetUser,
} from '../../api/user';
import { openProjects, openSignScreen } from '../../utils/history';
import TYPES from '../../constants/actions';
import { convertUserDataToRequest } from '../../api/converters/toRequest';
import {
  AuthError,
  ITokenPair,
  ServerProfileData,
  ServerUserData,
} from './types';
import { reqWrapper } from '../project/sagas';
import { selectAuthError, selectTokenPair } from './selectors';

export function* getTokenPairSaga(username: string, password: string) {
  try {
    const tokens: ITokenPair = yield call(apiGetToken, { username, password });

    yield put(Actions.setTokenPair(tokens));
    return tokens;
  } catch (e) {
    yield put(Actions.setAuthError(e.message, e.data));
  }
}

export function* loginSaga({
  payload: { username, password },
}: ReturnType<typeof Actions.login>) {
  try {
    yield put(Actions.toggleUserLoading(true));

    const tokenPair = yield call(getTokenPairSaga, username, password);
    if (!tokenPair) return;

    const { id } = yield call(reqWrapper, apiIdentifyUser);

    const userData: ServerUserData = yield call(reqWrapper, apiGetUser, {
      id,
    });
    const profileData: ServerProfileData = yield call(
      reqWrapper,
      apiGetProfile,
      { id },
    );

    yield put(
      Actions.setUserData({
        ...convertUserDataFromResponse(userData),
        ...convertProfileDataFromResponse(profileData),
      }),
    );

    yield call(openProjects);
  } catch (e) {
    yield put(Actions.setAuthError(e.message));
  } finally {
    yield put(Actions.toggleUserLoading(false));
  }
}

export function* changeUserDataSaga({
  payload: { id, data },
}: ReturnType<typeof Actions.changeUserData>) {
  try {
    const newUserData: ServerUserData = yield call(
      reqWrapper,
      apiChangeUserData,
      {
        id,
        data: convertUserDataToRequest(data),
      },
    );

    yield put(Actions.setUserData(convertUserDataFromResponse(newUserData)));
  } catch (e) {
    yield put(Actions.setAuthError(e.message));
  }
}

export function* changeProfileDataSaga({
  payload: { id, data },
}: ReturnType<typeof Actions.changeProfileData>) {
  try {
    const newProfileData: ServerProfileData = yield call(
      reqWrapper,
      apiChangeProfileData,
      { id, data },
    );

    yield put(
      Actions.setUserData(convertProfileDataFromResponse(newProfileData)),
    );
  } catch (e) {
    yield put(Actions.setAuthError(e.message));
  }
}

function* sendActivationMailSaga(
  action: ReturnType<typeof Actions.sendActivationMail>,
) {
  try {
    const {
      payload: { username, email, password, firstName, lastName },
    } = action;
    yield put(Actions.toggleUserLoading(true));

    const response = yield call(apiSendActivationMail, {
      username,
      email,
      password,
    });

    yield call(apiChangeUserData, {
      id: response.id,
      data: convertUserDataToRequest({ firstName, lastName }),
    });

    const authError: AuthError = yield select(selectAuthError);

    if (authError.data?.errorStatus === -1) {
      openSignScreen('signin');
      yield put(
        Actions.setConfirmMessage(
          'Please, check your mail and confirm registration',
        ),
      );
    }
  } catch (e) {
    yield put(Actions.setAuthError(e.message));
  } finally {
    yield put(Actions.toggleUserLoading(false));
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

    const authError: AuthError = yield select(selectAuthError);

    if (authError.data?.errorStatus === -1) {
      yield put(
        Actions.setConfirmMessage(
          'Please, check your mail and set new password',
        ),
      );
    }
  } catch (e) {
    yield put(Actions.setAuthError(e.message));
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
    yield put(Actions.setAuthError(e.message));
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
    yield put(Actions.setAuthError(e.message));
  } finally {
    yield put(Actions.toggleUserLoading(false));
  }
}

export function* refreshUserTokenPair() {
  try {
    const { refresh } = yield select(selectTokenPair);

    const accessResult = refresh && (yield call(apiRefreshToken, refresh));

    if (accessResult && accessResult.access) {
      return { refresh, access: accessResult.access };
    }

    return accessResult;
  } catch (e) {
    yield put(Actions.setAuthError(e.message));
  }
}

export function* registerWithGoogleSaga() {
  // TODO Write when the backend will register new users using google token
}

export default function* userSaga() {
  yield takeLatest(TYPES.LOGIN, loginSaga);
  yield takeLatest(TYPES.SEND_ACTIVATION_MAIL, sendActivationMailSaga);
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
