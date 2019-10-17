import { client } from '$config/settings';
import { onError, parseResult } from '$api/project';
import { ISignInData } from '$redux/user/reducer';

interface ISignUpData {
  username: string,
  password: string,
  email: string,
  first_name: string,
  last_name: string,
}

// const generateId = () => {
//   return `5cda${getRandomInt(10, 99)}b${getRandomInt(10, 99)}a5d3${getRandomInt(10, 99)}e72${getRandomInt(10, 99)}3b11`;
// };

export const onAuthorisationError = ({ response }) => {
  switch (response.status) {
    case 400:
      return {
        errorStatus: response.status,
        errorText: 'Entered data is incorrect or this login allready exist. Please, check fields data.',
      };
    case 401:
      return {
        errorStatus: response.status,
        errorText: 'Authorisation error. Check your username/email and password.',
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

export const apiGetToken = (data: ISignInData) => (
  client.post('djauth/jwt/create/', {
    ...data,
  })
    .then(parseResult)
    .catch(onAuthorisationError)
);

export const apiRefreshToken = (refresh: string) => (
  client.post('djauth/jwt/refresh/', {
    refresh,
  })
    .then(parseResult)
    .catch(onError)
);

export const apiSetNewUser = ({
  username,
  password,
  email,
  first_name,
  last_name,
} : ISignUpData) => (
  client.post('/accounts/users/', {
    username,
    email,
    first_name,
    last_name,
    password,
    date_joined: new Date(),
    is_active: true,
  })
    .then(parseResult)
    .catch(onAuthorisationError)
);

export const apiRestorePassword = (email: string) => (
  client.post('djauth/users/reset_password/', {
    email,
  })
    .then(parseResult)
    .catch(onError)
);

export const apiGetUsers = () => (
  client.get('accounts/users/')
    .then(parseResult)
    .catch(onAuthorisationError)
);

export const apiSetNewPassword = (id: number, password: string) => (
  client.patch(`accounts/users/${id}/`, {
    password,
  })
    .then(parseResult)
    .catch(onAuthorisationError)
);
