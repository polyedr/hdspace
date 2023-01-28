import { takeLatest, call, put, takeEvery, select } from 'redux-saga/effects';
import { FORM_ERROR } from 'final-form';
import {
  convertProfileDataFromResponse,
  convertUserDataFromResponse,
} from '@Api/converters/fromResponse';
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
  apiGetUsers,
  apiGetSubscriptionData,
  apiChangeProfileAAvatar,
} from '@Api/user';
import { convertUserDataToRequest } from '@Api/converters/toRequest';
import {
  ServerProfileData,
  ServerUserData,
  TokenPair,
  ViewTokenPair,
  PaginatedResponse,
  Result,
  Data,
  UserData,
  UserSubscriptionsData,
} from '@Src/types';
import { enqueueSnackbar } from '@Redux/notification/actions';
import { updateUISettingsParameters } from '@Redux/project/actions';
import _ from 'lodash';
import { USERNAME_VIEW, PASSWORD_VIEW } from '@Constants/defaultParams';
import TYPES from '../actionTypes';
import * as Actions from './actions';
import { reqWrapper } from '../project/sagas/shared';
import { openProjects, openSignScreen } from '../history';
import { loginComplete } from './actions';
import { selectProfileData, selectUserData } from './selectors';

// eslint-disable-next-line consistent-return
export function* getTokenPairSaga(username: string, password: string) {
  try {
    const tokens: TokenPair = yield call(apiGetToken, { username, password });

    yield put(Actions.setTokenPair(tokens));
    return tokens;
  } catch (e: any) {
    if (e.response?.data) {
      yield put(Actions.loginComplete(e.response.data));
    } else {
      yield put(Actions.loginComplete({ [FORM_ERROR]: e.message }));
    }
  }
}
export function* getTokenPairSagaProjectView() {
  try {
    const username = USERNAME_VIEW;
    const password = PASSWORD_VIEW;
    const tokens: ViewTokenPair = yield call(apiGetToken, {
      username,
      password,
    });

    yield put(Actions.setProjectViewEnd(tokens));
  } catch (e: any) {
    yield put(
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
}

export function* getSubscriptionSaga() {
  try {
    const { data, error }: Data<Partial<UserSubscriptionsData>> = yield call(
      reqWrapper,
      apiGetSubscriptionData,
    );
    if (data) {
      yield put(Actions.setSubscriptionData(data));
    }
    if (error) {
      throw new Error(error);
    }
  } catch (e) {
    if (e instanceof Error) {
      yield put(
        enqueueSnackbar(
          {
            message: e.message,
            options: {
              variant: 'error',
            },
          },
          e,
        ),
      );
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
      }),
    );

    yield put(loginComplete());
    yield call(openProjects);
  } catch (e: any) {
    if (typeof e.response?.data === 'object') {
      yield put(Actions.loginComplete(e.response.data));
    } else {
      yield put(Actions.loginComplete({ [FORM_ERROR]: e.message }));
    }
  }
}

export function* logoutSaga() {
  try {
    yield put(Actions.logout());
    openSignScreen('signin');
  } catch (e: any) {
    yield put(
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
    );
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
  } catch (e: any) {
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
    const { id, ...rest } = yield select(selectProfileData);

    const newProfileData: ServerProfileData = yield call(
      reqWrapper,
      apiChangeProfileData,
      {
        id,
        data: _.merge(rest, payload),
      },
    );
    if (payload.avatar === null) {
      newProfileData.parameters.avatarCrop = '';
    }
    yield put(
      Actions.setProfileData(convertProfileDataFromResponse(newProfileData)),
    );
    yield put(Actions.changeProfileDataComplete());
  } catch (e: any) {
    if (typeof e.response?.data === 'object') {
      yield put(Actions.changeProfileDataComplete(e.response.data));
    } else {
      yield put(Actions.changeProfileDataComplete({ [FORM_ERROR]: e.message }));
    }
  }
}

export function* uploadProfileAvatarSaga({
  payload,
}: ReturnType<typeof Actions.changeProfileAvatar>) {
  try {
    const { id } = yield select(selectProfileData);

    const data = new FormData();
    data.append('avatar', payload, payload?.name);

    const newProfileData: ServerProfileData = yield call(
      reqWrapper,
      apiChangeProfileAAvatar,
      {
        id,
        data,
      },
    );

    yield put(
      Actions.setProfileData(convertProfileDataFromResponse(newProfileData)),
    );
  } catch (e: any) {
    if (typeof e.response?.data === 'object') {
      yield put(Actions.changeProfileDataComplete(e.response.data));
    }
  }
}

export const updateUISettingsParametersSaga = function* ({
  payload,
}: ReturnType<typeof updateUISettingsParameters>) {
  try {
    const {
      id,
      parameters: { profileDataParameters },
    } = yield select(selectProfileData);
    const newUIParameters = { ...profileDataParameters, ...payload };
    const newProfileData = yield call(reqWrapper, apiChangeProfileData, {
      id,
      data: {
        parameters: {
          profileDataParameters: newUIParameters,
        },
      },
    });
    yield put(
      Actions.setProfileData(convertProfileDataFromResponse(newProfileData)),
    );
  } catch (e: any) {
    yield put(
      enqueueSnackbar(
        {
          message: e.message,
          options: {
            variant: 'error',
          },
        },
        e,
      ),
    );
  }
};

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
        'Please, check your mail and follow the activation link',
      ),
    );

    yield put(Actions.registerComplete());

    openSignScreen('signin');
  } catch (e: any) {
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
    const { result }: Result<PaginatedResponse<UserData>> = yield call(
      reqWrapper,
      apiGetUsers,
      {
        search: email || '',
      },
    );
    if (result) {
      if (result?.results.length > 0) {
        yield call(apiRestorePassword, email);
        yield put(
          enqueueSnackbar({
            message: 'Please check your mail and follow the instructions.',
            options: {
              variant: 'info',
            },
          }),
        );
      } else {
        yield put(
          enqueueSnackbar({
            message: "This email doesn't exist in the system",
            options: {
              variant: 'error',
            },
          }),
        );
      }
    }

    openSignScreen('signin');
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
  } catch (e: any) {
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
    yield put(
      Actions.setConfirmMessage(
        'Your account has been activated successfully. You can now login',
      ),
    );

    yield put(Actions.setTokenPair({ access: token, refresh: '' }));
  } catch (e: any) {
    yield put(Actions.setUserError(e));
  } finally {
    yield put(Actions.toggleUserLoading(false));
  }
}

// eslint-disable-next-line consistent-return

export function* registerWithGoogleSaga() {
  // TODO Write when the backend will register new users using google token
}

export function* loadUserDataSaga(action: ReturnType<typeof Actions.loadUser>) {
  try {
    const { uid, tokenPair } = action.payload;
    yield put(Actions.resetUserData());
    yield put(Actions.setTokenPair(tokenPair));
    const userData: ServerUserData = yield call(reqWrapper, apiGetUser, {
      id: uid,
    });
    yield put(
      Actions.setUserData({
        ...convertUserDataFromResponse(userData),
      }),
    );
  } catch (e: any) {
    yield put(
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
}

export default function* userSaga() {
  yield takeLatest(TYPES.LOGIN_CHAT_USER, loginSaga);
  yield takeEvery(TYPES.LOGOUT_START, logoutSaga);
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
  yield takeEvery(TYPES.CHANGE_PROFILE_AVATAR, uploadProfileAvatarSaga);
  yield takeEvery(TYPES.LOAD_USER_DATA, loadUserDataSaga);
  yield takeEvery(TYPES.PROJECT_VIEW_START, getTokenPairSagaProjectView);
  yield takeEvery(TYPES.SUBSCRIPTION_DATA, getSubscriptionSaga);
}
