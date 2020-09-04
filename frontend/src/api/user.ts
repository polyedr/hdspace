/* eslint-disable camelcase */

import { AxiosError } from 'axios';
import {
  IApiResponseError,
  LoginFormData,
  ProfileData,
  UserData,
} from '../redux/user/types';
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

export const onAuthorisationError = ({
  response: r,
}: AxiosError): IApiResponseError => {
  const response = r as any;
  switch (response.status) {
    case 400:
      return {
        errorStatus: response.status,
        errorText:
          'Entered data is incorrect or this login allready exist. Please, check fields data.',
        data: response.data,
      };
    case 401:
      return {
        errorStatus: response.status,
        errorText:
          'Authorisation error. Check your username/email and password.',
        data: response.data,
      };
    case 404:
      return {
        errorStatus: response.status,
        errorText: 'User not found!',
        data: response.data,
      };
    case response.status >= 500:
      return {
        errorStatus: response.status,
        errorText: 'It seems something went wrong. Please, try later.',
        data: response.data,
      };
    default:
      return {
        errorStatus: response.status,
        errorText: response.statusText,
        data: response.data,
      };
  }
};

export const apiGetToken = (data: LoginFormData) =>
  myAxios({
    data,
    method: 'POST',
    url: '/djauth/jwt/create/',
  })
    .then(parseResult)
    .catch(onAuthorisationError);

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
    .catch(onAuthorisationError);

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
    .catch(onAuthorisationError);

export const apiRegisterWithGoogle = () =>
  myAxios({
    method: 'GET',
    url: '/djauth/o/google-oauth2/',
    params: {
      redirect_uri: 'http://localhost:8080/projects',
    },
  })
    .then(parseResult)
    .catch(onAuthorisationError);

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
    .catch(onAuthorisationError);

export const apiRestorePassword = (email: string) =>
  myAxios({
    data: { email },
    method: 'POST',
    url: '/djauth/users/reset_password/',
  })
    .then(parseResult)
    .catch(onError);

export const apiGetUsers = (): Promise<
  { email: string; id: number }[] | IApiResponseError
> =>
  myAxios({
    method: 'GET',
    url: '/accounts/users/',
  })
    .then(parseResult)
    .catch(onAuthorisationError);

export const apiGetProfile = (id: number) =>
  myAxios({
    method: 'GET',
    url: `/accounts/profiles/${id}/`,
  })
    .then(parseResult)
    .catch(onError);

export const apiChangeUserData = (id: number, data: Partial<UserData>) =>
  myAxios({
    data,
    method: 'PATCH',
    url: `/accounts/users/${id}/`,
  })
    .then(parseResult)
    .catch(onError);

export const apiChangeProfileData = (id: number, data: Partial<ProfileData>) =>
  myAxios({
    data,
    method: 'PATCH',
    url: `/accounts/profiles/${id}/`,
  })
    .then(parseResult)
    .catch(onError);
