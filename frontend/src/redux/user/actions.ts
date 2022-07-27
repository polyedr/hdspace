import { FORM_ERROR } from 'final-form';
import {
  TokenPair,
  LoginFormData,
  ProfileData,
  UserData,
  SignupFormData,
  Experience,
  ChatCredentials,
  UserSubscriptionsData,
} from '@Src/types';
import TYPES from '@Redux/actionTypes';

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
  type: TYPES.LOGIN_CHAT_USER,
  payload: data,
});

export const loginComplete = (
  errors?: { detail: string } | { [FORM_ERROR]: string },
) => ({
  type: TYPES.LOGIN_COMPLETE,
  payload: errors,
});

export const loginFailure = (errors: any) => ({
  type: TYPES.LOGIN_FAILURE,
  payload: errors,
});

export const logoutStart = () => ({
  type: TYPES.LOGOUT_START,
});

export const logout = () => ({
  type: TYPES.LOGOUT,
});

export const setTokenPair = (tokenPair: TokenPair) => ({
  type: TYPES.SET_TOKEN_PAIR,
  tokenPair,
});
export const setProjectViewStart = () => ({
  type: TYPES.PROJECT_VIEW_START,
});
export const setProjectViewEnd = (viewTokenPair: TokenPair) => ({
  type: TYPES.PROJECT_VIEW_END,
  viewTokenPair,
});

export const setSubscriptionData = (
  subscriptionData: Partial<UserSubscriptionsData>,
) => ({
  type: TYPES.SET_SUBSCRIPTION_DATA,
  subscriptionData,
});

export const setUserData = (data: Partial<UserData>) => ({
  type: TYPES.SET_USER_DATA,
  payload: data,
});

export const resetUserData = () => ({
  type: TYPES.RESET_USER_DATA,
});

export const setProfileData = (data: Partial<ProfileData>) => ({
  type: TYPES.SET_PROFILE_DATA,
  payload: data,
});

export const register = (data: SignupFormData) => ({
  type: TYPES.REGISTER,
  payload: data,
});

export const registerComplete = (
  errors?: { [key in keyof SignupFormData]: string } | { [FORM_ERROR]: string },
) => ({
  type: TYPES.REGISTER_COMPLETE,
  payload: errors,
});

export const registerFailure = (error: any) => ({
  type: TYPES.REGISTER_FAILURE,
  payload: error,
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

export const loadUser = (uid: string, tokenPair: TokenPair) => ({
  type: TYPES.LOAD_USER_DATA,
  payload: { uid, tokenPair },
});

export const setUserError = (error: Error | null) => ({
  type: TYPES.SET_USER_ERROR,
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

export const changeUserData = (data: Partial<UserData>) => ({
  type: TYPES.CHANGE_USER_DATA,
  payload: data,
});

export const changeUserDataComplete = (
  errors?: { [key in keyof UserData]: string } | { [FORM_ERROR]: string },
) => ({
  type: TYPES.CHANGE_USER_DATA_COMPLETE,
  payload: errors,
});

export const changeUserDataFailure = (error: any) => ({
  type: TYPES.CHANGE_USER_DATA_FAILURE,
  payload: error,
});

export const changeProfileData = (data: Partial<ProfileData>) => ({
  type: TYPES.CHANGE_PROFILE_DATA,
  payload: data,
});

export const changeProfileDataComplete = (
  errors?: { [key in keyof ProfileData]: string } | { [FORM_ERROR]: string },
) => ({
  type: TYPES.CHANGE_PROFILE_DATA_COMPLETE,
  payload: errors,
});

export const changeProfileDataFailure = (error: any) => ({
  type: TYPES.CHANGE_PROFILE_DATA_FAILURE,
  payload: error,
});

export const setUserExperience = (experience: Experience) => ({
  type: TYPES.SET_USER_EXPERIENCE,
  payload: experience,
});

export const setUserGuideActive = (active: boolean) => ({
  type: TYPES.SET_USER_GUIDE_ACTIVE,
  payload: active,
});

export const setChatCredentials = (data: ChatCredentials) => ({
  type: TYPES.SET_CHAT_CREDENTIALS,
  payload: data,
});

export const chatLogout = () => ({
  type: TYPES.CHAT_LOGOUT,
});
