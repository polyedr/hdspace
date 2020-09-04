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
  apiGetUsers,
  apiRefreshToken,
  apiResetPasswordConfirmation,
  apiRestorePassword,
  apiSendActivationMail,
} from '../../api/user';
import { openProjects, openSignScreen } from '../../utils/history';
import { DEFAULT_RESPONSE_ERROR } from '../../constants/defaultParams';
import TYPES from '../../constants/actions';
import { AppReduxState } from '../../shared/types/app';
import { convertUserDataToRequest } from '../../api/converters/toRequest';
import { ServerUserData } from './types';
import { reqWrapper } from '../project/sagas';

export function* getTokenPairSaga(username: string, password: string) {
  const {
    user: { apiResponseError },
  }: AppReduxState = yield select();

  const authorisationData = yield call(apiGetToken, { username, password });

  if (authorisationData && authorisationData.access) {
    if (apiResponseError.errorStatus !== -1) {
      yield put(Actions.setApiResponseError(DEFAULT_RESPONSE_ERROR));
    }

    yield put(Actions.setTokenPair(authorisationData));
  } else {
    yield put(Actions.setApiResponseError(authorisationData));
  }
}

export function* loginSaga({
  payload: { username, password },
}: ReturnType<typeof Actions.login>) {
  yield put(Actions.changeSignLoader(true));

  yield call(getTokenPairSaga, username, password);

  const {
    user: { apiResponseError },
  }: AppReduxState = yield select();

  if (apiResponseError.errorStatus !== -1) {
    yield put(Actions.changeSignLoader(false));
    return;
  }

  const users = yield call(reqWrapper, apiGetUsers);

  if (!users) {
    console.error('Login error while fetching users');
    return;
  }

  const userData = users.find(
    (user: ServerUserData) => username === user.username,
  );

  const profileData = yield call(apiGetProfile, userData.id);

  if (!profileData) {
    console.error('Login error while fetching users');
    return;
  }

  yield put(
    Actions.setUserData({
      ...convertUserDataFromResponse(userData),
      ...convertProfileDataFromResponse(profileData),
    }),
  );

  yield put(Actions.changeSignLoader(false));

  yield call(openProjects);
}

export function* changeUserDataSaga({
  payload: { id, data },
}: ReturnType<typeof Actions.changeUserData>) {
  const newUserData = yield call(
    apiChangeUserData,
    id,
    convertUserDataToRequest(data),
  );

  if (!newUserData) {
    console.error('Error while patching user data');
    return;
  }
  yield put(Actions.setUserData(convertUserDataFromResponse(newUserData)));
}

export function* changeProfileDataSaga({
  payload: { id, data },
}: ReturnType<typeof Actions.changeProfileData>) {
  const newProfileData = yield call(apiChangeProfileData, id, data);

  if (!newProfileData) {
    console.error('Error while patching profile data');
    return;
  }
  yield put(
    Actions.setUserData(convertProfileDataFromResponse(newProfileData)),
  );
}

function* sendActivationMailSaga(
  action: ReturnType<typeof Actions.sendActivationMail>,
) {
  const {
    payload: { username, email, password, firstName, lastName },
  } = action;
  yield put(Actions.changeSignLoader(true));

  const response = yield call(apiSendActivationMail, {
    username,
    email,
    password,
  });

  const userData = convertUserDataToRequest({ firstName, lastName });

  yield call(apiChangeUserData, response.id, userData);

  if (response.errorStatus) {
    yield put(Actions.setApiResponseError(response));
  }

  const {
    user: { apiResponseError },
  }: AppReduxState = yield select();

  yield put(Actions.changeSignLoader(false));

  if (apiResponseError.errorStatus === -1) {
    openSignScreen('signin');
    yield put(
      Actions.setConfirmMessage(
        'Please, check your mail and confirm registration',
      ),
    );
  }
}

function* sendResetPasswordMailSaga(
  action: ReturnType<typeof Actions.sendResetPasswordMail>,
) {
  const {
    payload: { email },
  } = action;
  yield put(Actions.changeSignLoader(true));

  const response = yield call(apiRestorePassword, email);

  if (response.errorStatus) {
    yield put(Actions.setApiResponseError(response));
  }

  const {
    user: { apiResponseError },
  }: AppReduxState = yield select();

  yield put(Actions.changeSignLoader(false));

  if (apiResponseError.errorStatus === -1) {
    yield put(
      Actions.setConfirmMessage('Please, check your mail and set new password'),
    );
  }
}

function* resetPasswordConfirmationSaga(
  action: ReturnType<typeof Actions.resetPasswordConfirmation>,
) {
  const {
    payload: { uid, token, newPassword, reNewPassword },
  } = action;
  yield put(Actions.changeSignLoader(true));

  yield call(apiResetPasswordConfirmation, {
    uid,
    token,
    newPassword,
    reNewPassword,
  });

  yield put(Actions.setTokenPair({ access: token, refresh: '' }));
  openSignScreen('signin');
  yield put(Actions.changeSignLoader(false));
}

function* activateUserSaga(action: ReturnType<typeof Actions.activateUser>) {
  const {
    payload: { uid, token },
  } = action;
  yield put(Actions.changeSignLoader(true));

  yield call(apiActivateUser, { uid, token });

  yield put(Actions.setTokenPair({ access: token, refresh: '' }));

  yield put(Actions.changeSignLoader(false));
}

export function* refreshUserTokenPair() {
  const {
    user: {
      tokenPair: { refresh },
    },
  }: AppReduxState = yield select();

  const accessResult = refresh && (yield call(apiRefreshToken, refresh));

  if (accessResult && accessResult.access) {
    return { refresh, access: accessResult.access };
  }

  return accessResult;
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
