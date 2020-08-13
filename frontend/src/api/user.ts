/* eslint-disable camelcase */

import { AxiosError } from 'axios';
import { myAxios } from '$config/settings';
import { onError, parseResult } from '$api/project';
import { IApiResponseError, LoginFormData, UserData } from '$redux/user/types';

export interface ISignUpData {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
}

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
      };
    case 401:
      return {
        errorStatus: response.status,
        errorText:
          'Authorisation error. Check your username/email and password.',
      };
    case 404:
      return {
        errorStatus: response.status,
        errorText: 'User not found!',
      };
    case response.status >= 500:
      return {
        errorStatus: response.status,
        errorText: 'It seems something went wrong. Please, try later.',
      };
    default:
      return {
        errorStatus: response.status,
        errorText: response.statusText,
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

export const apiSetNewUser = ({
  username,
  password,
  email,
  first_name,
  last_name,
}: ISignUpData) =>
  myAxios({
    data: {
      username,
      email,
      first_name,
      last_name,
      password,
      date_joined: new Date(),
      is_active: true,
    },
    method: 'POST',
    url: '/accounts/users/',
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

export const apiSetNewPassword = (
  id: number,
  password: string,
): Promise<string | IApiResponseError> =>
  myAxios({
    data: {
      password,
    },
    method: 'PATCH',
    url: `/accounts/users/${id}/`,
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

export const apiChangeProfileData = (id: number, data: Partial<UserData>) =>
  myAxios({
    data,
    method: 'PATCH',
    url: `/accounts/profiles/${id}/`,
  })
    .then(parseResult)
    .catch(onError);
