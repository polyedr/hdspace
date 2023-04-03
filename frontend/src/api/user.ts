import { AxiosError, AxiosResponse } from 'axios';
import { myAxios } from '../config/settings';
import {
  LoginFormData,
  MyAxiosProps,
  PaginatedResponse,
  ServerUserData,
} from '../types';
import { convertUserDataFromResponse } from './converters/fromResponse';
import { handleError, parseCursor, parseData, parseResult } from './helper';

interface SendActivationMailData {
  username: string;
  password: string;
  email: string;
}

interface activateUserData {
  uid: string;
  token: string;
}

interface ResetPasswordConfirmationData {
  uid: string;
  token: string;
  newPassword: string;
  reNewPassword: string;
}

const onAuthorizationError = ({ response }: AxiosError): Error => {
  let message = '';

  if (!response) {
    throw new Error('Network Error');
  }
  switch (response.status) {
    case 400:
      message =
        'Entered data is incorrect or this login already exist. Please, check fields data.';
      break;
    case 401:
      message = 'Authorization error. Check your username/email and password.';
      break;
    case 404:
      message = 'User not found!';
      break;
    case 500:
      message = 'It seems something went wrong. Please, try later.';
      break;
    default:
      message = response.statusText;
  }
  throw new Error(message);
};

export const apiGetToken = async (data: LoginFormData) =>
  await myAxios({
    data,
    method: 'POST',
    url: '/djauth/jwt/create/',
  }).then(parseResult);

export const apiRefreshToken = async (refresh: string) =>
  await myAxios({
    data: { refresh },
    method: 'POST',
    url: '/djauth/jwt/refresh/',
  }).then(parseResult);

export const registerUser = async (data: SendActivationMailData) =>
  await myAxios({
    data,
    method: 'POST',
    url: '/djauth/users/',
  }).then(parseResult);

export const apiResetPasswordConfirmation = async ({
  uid,
  token,
  newPassword,
  reNewPassword,
}: ResetPasswordConfirmationData) =>
  await myAxios({
    data: {
      uid,
      token,
      new_password: newPassword,
      re_new_password: reNewPassword,
    },
    method: 'POST',
    url: '/djauth/users/reset_password_confirm/',
  }).then(parseResult);

export const apiRegisterWithGoogle = async () =>
  await myAxios({
    method: 'GET',
    url: '/djauth/o/google-oauth2/',
    params: {
      redirect_uri: 'http://localhost:8080/projects',
    },
  })
    .then(parseResult)
    .catch(onAuthorizationError);

export const apiActivateUser = async ({ uid, token }: activateUserData) =>
  await myAxios({
    data: {
      uid,
      token,
    },
    method: 'POST',
    url: '/djauth/users/activation/',
  }).then(parseResult);

export const apiRestorePassword = async (email: string) =>
  await myAxios({
    data: { email },
    method: 'POST',
    url: '/djauth/users/reset_password/',
  }).then(parseResult);

export const apiGetUsers = async (props: MyAxiosProps & { search: string }) => {
  const { search, ...axiosProps } = props;
  return await myAxios({
    ...axiosProps,
    method: 'GET',
    url: '/accounts/users/',
    params: {
      ...axiosProps.params,
      search,
    },
  })
    .then((result: AxiosResponse<PaginatedResponse<ServerUserData>>) => ({
      result: {
        next: parseCursor(result.data.next),
        previous: parseCursor(result.data.previous),
        results: result.data.results.map(convertUserDataFromResponse),
      },
    }))
    .catch(handleError);
};

export const apiGetUser = async ({ id, ...props }) =>
  await myAxios({
    ...props,
    method: 'GET',
    url: `/accounts/users/${id}/`,
  }).then(parseResult);

export const apiChangeUserData = async ({ id, ...props }) =>
  await myAxios({
    ...props,
    method: 'PATCH',
    url: `/accounts/users/${id}/`,
  }).then(parseResult);

export const apiChangeProfileData = async ({ id, ...props }) =>
  await myAxios({
    ...props,
    method: 'PATCH',
    url: `/accounts/profiles/${id}/`,
  })
    .then(parseResult)
    .catch(handleError);

export const apiChangeProfileAAvatar = async ({ id, data }) =>
  await myAxios({
    method: 'PATCH',
    url: `/accounts/profiles/${id}/`,
    data,
  })
    .then(parseResult)
    .catch(handleError);

export const apiIdentifyUser = async (props) =>
  await myAxios({
    ...props,
    method: 'GET',
    url: '/djauth/users/me/',
  }).then(parseResult);

export const apiGetSubscriptionData = async (props) =>
  await myAxios({
    ...props,
    method: 'GET',
    url: '/stripe/my-subscription-items/',
  }).then(parseData);
