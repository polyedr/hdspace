import TYPES from '@Redux/actionTypes';

export const logIn = (realm: string, username: string, password: string) => ({
  type: TYPES.LOGIN_REQUEST,
  payload: { realm, username, password },
});

export const logInSuccess = (client: any) => ({
  type: TYPES.LOGIN_SUCCESS,
  payload: client,
});

export const logInFail = (error: any) => ({
  type: TYPES.LOGIN_ERROR,
  payload: error,
});

export default {
  logIn,
  logInSuccess,
  logInFail,
};
