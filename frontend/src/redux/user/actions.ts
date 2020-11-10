import TYPES from '../actionTypes';
import {
  ITokenPair,
  LoginFormData,
  ProfileData,
  TotalUserData,
  UserData,
} from '../../types';

export const changeMinLPanel = () => ({ type: TYPES.CHANGE_L_PANEL });

export const toggleUserLoading = (isLoading: boolean) => ({
  type: TYPES.TOGGLE_USER_LOADING,
  isLoading,
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

export const sendActivationMail = (
  username: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
) => ({
  type: TYPES.SEND_ACTIVATION_MAIL,
  payload: {
    username,
    email,
    password,
    firstName,
    lastName,
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

export const setConfirmMessage = (confirmMessage: string) => ({
  type: TYPES.SET_CONFIRM_MESSAGE,
  payload: {
    confirmMessage,
  },
});

export const activateUser = (uid: string, token: string) => ({
  type: TYPES.ACTIVATE_USER,
  payload: {
    uid,
    token,
  },
});

export const setAuthError = (error: Error) => ({
  type: TYPES.SET_AUTH_ERROR,
  payload: error,
});

export const setLoadedToken = (isLoadedToken: boolean) => ({
  type: TYPES.SET_LOADED_TOKEN,
  isLoadedToken,
});

export const setRestorePasswordEmail = (restorePasswordEmail: string) => ({
  type: TYPES.SET_RESTORE_PASSWORD_EMAIL,
  restorePasswordEmail,
});

export const resetPasswordConfirmation = (
  uid: string,
  token: string,
  newPassword: string,
  reNewPassword: string,
) => ({
  type: TYPES.RESET_PASSWORD_CONFIRMATION,
  payload: {
    uid,
    token,
    newPassword,
    reNewPassword,
  },
});

export const setRestoreUserId = (restoreUserId: number) => ({
  type: TYPES.SET_RESTORE_USER_ID,
  restoreUserId,
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
