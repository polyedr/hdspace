import { createReducer, Handlers } from 'reduxsauce';

import * as ACTIONS from '$redux/user/actions';
import { TYPES } from '$constants/actions';

export interface ITokenPair {
  access: string,
  refresh: string,
}

export interface ISignInData {
  username?: string,
  password?: string,
}

export interface IApiResponseError {
  errorStatus: number,
  errorText: string,
}

export type IRootState = Readonly<{
  isLPanelMinimized: boolean,
  isNavPanelMinimized: boolean,
  isPrototypeMode: boolean,
  tokenPair: ITokenPair,
  isLoadedToken: boolean,
  apiResponseError: IApiResponseError,
  userData: ISignInData,
  restorePasswordEmail?: string,
  restoreUserId?: number,
  isSignLoader: boolean,
}>;

type UnsafeReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

interface ActionHandler<T> {
    (state: IRootState, payload: UnsafeReturnType<T>): IRootState;
}

const changeMinLPanel: ActionHandler<ReturnType<typeof ACTIONS.changeMinLPanel>> = state => ({
  ...state,
  isLPanelMinimized: !state.isLPanelMinimized,
});

const changeMinNavPanel: ActionHandler<typeof ACTIONS.changeMinNavPanel> = state => ({
  ...state,
  isNavPanelMinimized: !state.isNavPanelMinimized,
});

const changeSignLoader: ActionHandler<typeof ACTIONS.changeSignLoader> = (state, { isSignLoader }) => ({
  ...state,
  isSignLoader,
});

const setApiResponseError: ActionHandler<typeof ACTIONS.setApiResponseError> = (state, { apiResponseError }) => ({
  ...state,
  apiResponseError,
});

const changePrototypeMode: ActionHandler<typeof ACTIONS.changePrototypeMode> = (
  state, { isPrototypeMode },
) => ({
  ...state,
  isPrototypeMode,
});

const setTokenPair: ActionHandler<typeof ACTIONS.setTokenPair> = (
  state, { tokenPair },
) => ({
  ...state,
  tokenPair,
});

const setUserData: ActionHandler<typeof ACTIONS.setUserData> = (
  state, { data },
) => ({
  ...state,
  userData: {
    ...state.userData,
    ...data,
  },
});

const setLoadedToken: ActionHandler<typeof ACTIONS.setLoadedToken> = (
  state, { isLoadedToken },
) => ({
  ...state,
  isLoadedToken,
});

const setRestorePasswordEmail: ActionHandler<typeof ACTIONS.setRestorePasswordEmail> = (
  state, { restorePasswordEmail },
) => ({
  ...state,
  restorePasswordEmail,
});

const setRestoreUserId: ActionHandler<typeof ACTIONS.setRestoreUserId> = (
  state, { restoreUserId },
) => ({
  ...state,
  restoreUserId,
});

// TODO: type Action in Handlers
const HANDLERS: Handlers<IRootState, any> = {
  [TYPES.CHANGE_L_PANEL]: changeMinLPanel,
  [TYPES.CHANGE_NAV_PANEL]: changeMinNavPanel,
  [TYPES.CHANGE_PROTOTYPE_MODE]: changePrototypeMode,
  [TYPES.CHANGE_SIGN_LOADER]: changeSignLoader,
  [TYPES.SET_TOKEN_PAIR]: setTokenPair,
  [TYPES.SET_USER_DATA]: setUserData,
  [TYPES.SET_LOADED_TOKEN]: setLoadedToken,
  [TYPES.SET_API_ERROR]: setApiResponseError,
  [TYPES.SET_RESTORE_PASSWORD_EMAIL]: setRestorePasswordEmail,
  [TYPES.SET_RESTORE_USER_ID]: setRestoreUserId,
} as const;

const INITIAL_STATE: IRootState = {
  isLPanelMinimized: false,
  isNavPanelMinimized: false,
  isPrototypeMode: false,
  userData: {
    username: '',
    password: '',
  },
  tokenPair: {
    access: '',
    refresh: '',
  },
  isLoadedToken: true,
  apiResponseError: {
    errorStatus: -1,
    errorText: '',
  },
  isSignLoader: false,
};

export default createReducer(INITIAL_STATE, HANDLERS);
