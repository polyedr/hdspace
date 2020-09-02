import TYPES from '../../constants/actions';
import {
  IApiResponseError,
  ITokenPair,
  LoginFormData,
  ProfileData,
  TotalUserData,
  UserData,
} from './types';

export const changeMinLPanel = () => ({ type: TYPES.CHANGE_L_PANEL });
export const changeMinNavPanel = () => ({ type: TYPES.CHANGE_NAV_PANEL });

export const changeSignLoader = (isSignLoader: boolean) => ({
  type: TYPES.CHANGE_SIGN_LOADER,
  isSignLoader,
});

export const changePrototypeMode = (isPrototypeMode: boolean) => ({
  type: TYPES.CHANGE_PROTOTYPE_MODE,
  isPrototypeMode,
});

export const login = (data: LoginFormData) => ({
  type: TYPES.LOGIN,
  payload: data,
});

export const logout = () => ({
  type: TYPES.LOGOUT,
});

export const setTokenPair = (tokenPair: ITokenPair) => ({
  type: TYPES.SET_TOKEN_PAIR,
  tokenPair,
});

export const setUserData = (data: Partial<TotalUserData>) => ({
  type: TYPES.SET_USER_DATA,
  payload: data,
});

export const setNewUser = (
  username: string,
  email: string,
  firstName: string,
  lastName: string,
  password: string,
) => ({
  type: TYPES.SET_NEW_USER,
  payload: {
    username,
    email,
    firstName,
    lastName,
    password,
  },
});

export const setApiResponseError = (apiResponseError: IApiResponseError) => ({
  type: TYPES.SET_API_ERROR,
  apiResponseError,
});

export const setLoadedToken = (isLoadedToken: boolean) => ({
  type: TYPES.SET_LOADED_TOKEN,
  isLoadedToken,
});

export const restorePassword = (email: string) => ({
  type: TYPES.RESTORE_PASSWORD,
  email,
});

export const setRestorePasswordEmail = (restorePasswordEmail: string) => ({
  type: TYPES.SET_RESTORE_PASSWORD_EMAIL,
  restorePasswordEmail,
});

export const setRestoreUserId = (restoreUserId: number) => ({
  type: TYPES.SET_RESTORE_USER_ID,
  restoreUserId,
});

export const setNewPassword = (password: string) => ({
  type: TYPES.SET_NEW_PASSWORD,
  password,
});

export const changeUserData = (id: number, data: Partial<UserData>) => ({
  type: TYPES.CHANGE_USER_DATA,
  payload: {
    id,
    data,
  },
});

export const changeProfileData = (id: number, data: Partial<ProfileData>) => ({
  type: TYPES.CHANGE_PROFILE_DATA,
  payload: {
    id,
    data,
  },
});
