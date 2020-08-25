import { TYPES } from '$constants/actions';
import {
  ITokenPair,
  IApiResponseError,
  UserData,
  LoginFormData,
  ProfileData,
  TotalUserData,
} from '$redux/user/types';

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

export const sendActivationMail = (
  username: string,
  email: string,
  password: string,
) => ({
  type: TYPES.SEND_ACTIVATION_MAIL,
  payload: {
    username,
    email,
    password,
  },
});

export const sendResetPasswordMail = (email: string) => ({
  type: TYPES.SEND_RESET_PASSWORD_MAIL,
  payload: {
    email,
  },
});

export const registerWithGoogle = () => ({
  type: TYPES.REGISTER_WITH_GOOGLE,
});

export const setConfirmMessage = (showMessage: boolean) => ({
  type: TYPES.SET_CONFIRM_MESSAGE,
  payload: {
    showMessage,
  },
});

export const activateUser = (uid: string, token: string) => ({
  type: TYPES.ACTIVATE_USER,
  payload: {
    uid,
    token,
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
