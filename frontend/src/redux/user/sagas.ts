/* eslint-disable no-console */
import { SagaIterator } from 'redux-saga';
import { takeLatest, call, put, select } from 'redux-saga/effects';
import {
  apiGetToken,
  apiSetNewUser,
  apiRefreshToken,
  apiGetUsers,
  apiSetNewPassword,
} from '$api/user';
import { TYPES } from '$constants/actions';
import * as Actions from '$redux/user/actions';
import {
  openProjects,
  openPasswordRestore,
  openSignScreen,
} from '$utils/history';
import { DEFAULT_RESPONSE_ERROR } from '$constants/defaultParams';
import { AppReduxState } from '$shared/types/app';
import { ReturnPromisedType } from '$shared/types';

export function* getTokenPairSaga({
  payload: { username, password },
}: ReturnType<typeof Actions.getTokenPair>): SagaIterator {
  const {
    user: { apiResponseError },
  }: AppReduxState = yield select();

  yield put(Actions.changeSignLoader(true));
  const authorisationData = yield call(apiGetToken, { username, password });
  yield put(Actions.changeSignLoader(false));

  if (authorisationData && authorisationData.access) {
    if (apiResponseError.errorStatus !== -1) {
      yield put(Actions.setApiResponseError(DEFAULT_RESPONSE_ERROR));
    }

    yield put(Actions.setTokenPair(authorisationData));
    yield put(Actions.setUserData({ username }));
    yield call(openProjects);
  } else {
    yield put(Actions.setApiResponseError(authorisationData));
  }
}

function* setNewUserSaga(action: ReturnType<typeof Actions.setNewUser>) {
  const {
    payload: { username, email, firstName, lastName, password },
  } = action;
  yield put(Actions.changeSignLoader(true));
  const newUserData = yield call(apiSetNewUser, {
    username,
    password,
    email,
    first_name: firstName,
    last_name: lastName,
  });

  if (newUserData && newUserData.username && newUserData.password) {
    yield call(getTokenPairSaga, Actions.getTokenPair(username, password));
  } else {
    yield put(Actions.setApiResponseError(newUserData));
  }
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

export function* restorePasswordSaga({
  email,
}: ReturnType<typeof Actions.restorePassword>): SagaIterator {
  const {
    user: { apiResponseError },
  }: AppReduxState = yield select();

  if (apiResponseError.errorStatus !== -1) {
    yield put(Actions.setApiResponseError(DEFAULT_RESPONSE_ERROR));
  }

  // yield call(apiRestorePassword, email);
  yield put(Actions.setRestorePasswordEmail(email));

  yield put(Actions.changeSignLoader(true));
  const usersList: ReturnPromisedType<typeof apiGetUsers> = yield call(
    apiGetUsers,
  );
  yield put(Actions.changeSignLoader(false));

  // TODO: research what is errorStatus
  if (Array.isArray(usersList)) {
    const user = usersList.find((currentEmail) => currentEmail.email === email);

    if (user !== undefined) {
      yield put(Actions.setApiResponseError(DEFAULT_RESPONSE_ERROR));
      yield put(Actions.setRestoreUserId(user.id));
      yield call(openPasswordRestore);
    } else {
      yield put(
        Actions.setApiResponseError({
          errorStatus: 404,
          errorText: 'User not found.',
        }),
      );
    }
  } else {
    yield put(Actions.setApiResponseError(usersList));
  }
}

export function* setNewPasswordSaga({
  password,
}: ReturnType<typeof Actions.setNewPassword>): SagaIterator {
  const {
    user: { restoreUserId },
  }: AppReduxState = yield select();

  if (restoreUserId === undefined) {
    console.error('restoreUserId is undefined!');
    return;
  }

  yield put(Actions.changeSignLoader(true));
  const newPassword: ReturnPromisedType<typeof apiSetNewPassword> = yield call(
    apiSetNewPassword,
    restoreUserId,
    password,
  );
  yield put(Actions.changeSignLoader(false));

  if (typeof newPassword === 'string') {
    yield call(openSignScreen, 'signin');
  } else {
    yield put(Actions.setApiResponseError(newPassword));
  }
}

export default function* userSaga() {
  yield takeLatest(TYPES.GET_TOKEN_PAIR, getTokenPairSaga);
  yield takeLatest(TYPES.SET_NEW_USER, setNewUserSaga);
  yield takeLatest(TYPES.RESTORE_PASSWORD, restorePasswordSaga);
  yield takeLatest(TYPES.SET_NEW_PASSWORD, setNewPasswordSaga);
}
