/* eslint-disable camelcase */

import { AxiosError } from 'axios';
import { AuthError, LoginFormData } from '../redux/user/types';
import { onError, parseResult } from './project';
import { myAxios } from '../../config/settings';

export interface ISignUpData {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
}

type SendActivationMailData = {
  username: string;
  password: string;
  email: string;
};

type activateUserData = {
  uid: string;
  token: string;
};

type ResetPasswordConfirmationData = {
  uid: string;
  token: string;
  newPassword: string;
  reNewPassword: string;
};

// const generateId = () => {
//   return `5cda${getRandomInt(10, 99)}b${getRandomInt(10, 99)}a5d3${getRandomInt(10, 99)}e72${getRandomInt(10, 99)}3b11`;
// };

export const onAuthorizationError = ({ response }: AxiosError): AuthError => {
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

export const apiGetToken = (data: LoginFormData) =>
  myAxios({
    data,
    method: 'POST',
    url: '/djauth/jwt/create/',
  })
    .then(parseResult)
    .catch(onAuthorizationError);

export const apiRefreshToken = (refresh: string) =>
  myAxios({
    data: { refresh },
    method: 'POST',
    url: '/djauth/jwt/refresh/',
  })
    .then(parseResult)
    .catch(onError);

export const apiSendActivationMail = ({
  username,
  password,
  email,
}: SendActivationMailData) =>
  myAxios({
    data: {
      username,
      email,
      password,
    },
    method: 'POST',
    url: '/djauth/users/',
  })
    .then(parseResult)
    .catch(onAuthorizationError);

export const apiResetPasswordConfirmation = ({
  uid,
  token,
  newPassword,
  reNewPassword,
}: ResetPasswordConfirmationData) =>
  myAxios({
    data: {
      uid,
      token,
      new_password: newPassword,
      re_new_password: reNewPassword,
    },
    method: 'POST',
    url: '/djauth/users/reset_password_confirm/',
  })
    .then(parseResult)
    .catch(onAuthorizationError);

export const apiRegisterWithGoogle = () =>
  myAxios({
    method: 'GET',
    url: '/djauth/o/google-oauth2/',
    params: {
      redirect_uri: 'http://localhost:8080/projects',
    },
  })
    .then(parseResult)
    .catch(onAuthorizationError);

export const apiActivateUser = ({ uid, token }: activateUserData) =>
  myAxios({
    data: {
      uid,
      token,
    },
    method: 'POST',
    url: '/djauth/users/activation/',
  })
    .then(parseResult)
    .catch(onAuthorizationError);

export const apiRestorePassword = (email: string) =>
  myAxios({
    data: { email },
    method: 'POST',
    url: '/djauth/users/reset_password/',
  })
    .then(parseResult)
    .catch(onError);

export const apiGetUsers = (): Promise<
  { email: string; id: number }[] | AuthError
> =>
  myAxios({
    method: 'GET',
    params: {
      page_size: 1000,
    },
    url: '/accounts/users/',
  })
    .then((res) => parseResult(res).results)
    .catch(onAuthorizationError);

export const apiGetProfile = ({ id, ...props }) =>
  myAxios({
    ...props,
    method: 'GET',
    url: `/accounts/profiles/${id}/`,
  })
    .then(parseResult)
    .catch(onAuthorizationError);

export const apiGetUser = ({ id, ...props }) =>
  myAxios({
    ...props,
    method: 'GET',
    url: `/accounts/users/${id}/`,
  })
    .then(parseResult)
    .catch(onAuthorizationError);

export const apiChangeUserData = ({ id, ...props }) =>
  myAxios({
    ...props,
    method: 'PATCH',
    url: `/accounts/users/${id}/`,
  })
    .then(parseResult)
    .catch(onAuthorizationError);

export const apiChangeProfileData = ({ id, ...props }) =>
  myAxios({
    ...props,
    method: 'PATCH',
    url: `/accounts/profiles/${id}/`,
  })
    .then(parseResult)
    .catch(onAuthorizationError);

export const apiIdentifyUser = (props) =>
  myAxios({
    ...props,
    method: 'GET',
    url: '/djauth/users/me/',
  })
    .then(parseResult)
    .catch(onAuthorizationError);
