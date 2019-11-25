import { TYPES } from '$constants/actions';
import { ITokenPair, IApiResponseError, ISignInData } from '$redux/user/reducer';

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

export const getTokenPair = (username: string, password: string) => ({
  type: TYPES.GET_TOKEN_PAIR,
  payload: {
    username,
    password,
  },
});

export const setTokenPair = (tokenPair: ITokenPair) => ({
  type: TYPES.SET_TOKEN_PAIR,
  tokenPair,
});

export const setUserData = (data: ISignInData) => ({
  type: TYPES.SET_USER_DATA,
  data,
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

export const onConfirmModal = (status: any) => ({
  // type: TYPES.ON_CONFIRM_MODAL,
  // status,
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
