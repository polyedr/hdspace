import { createReducer, Handlers } from 'reduxsauce';
import TYPES from '../../constants/actions';
import { UserState, UnsafeReturnType } from './types';
import * as Actions from './actions';

interface ActionHandler<T> {
  (state: UserState, payload: UnsafeReturnType<T>): UserState;
}

export const initialUserState: UserState = {
  isLPanelMinimized: false,
  isPrototypeMode: false,
  freeCanvasMode: {
    enabled: false,
  },
  userData: {
    isActive: false,
    hourlyRate: 0,
    approved: false,
    avatar: null,
    dateJoined: null,
    role: '',
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    id: 0,
  },
  isLoggedIn: false,
  tokenPair: {
    access: '',
    refresh: '',
  },
  isLoadedToken: true,
  authError: null,
  isLoading: false,
  confirmMessage: '',
};

const changeMinLPanel: ActionHandler<ReturnType<
  typeof Actions.changeMinLPanel
>> = (state) => ({
  ...state,
  isLPanelMinimized: !state.isLPanelMinimized,
});

const changeSignLoader: ActionHandler<typeof Actions.toggleUserLoading> = (
  state,
  { isLoading },
) => ({
  ...state,
  isLoading,
});

const setAuthError: ActionHandler<typeof Actions.setAuthError> = (
  state,
  { payload },
) => ({
  ...state,
  authError: payload,
  isLoggedIn: false,
});

const changePrototypeMode: ActionHandler<typeof Actions.changePrototypeMode> = (
  state,
  { isPrototypeMode },
) => ({
  ...state,
  isPrototypeMode,
});

const setTokenPair: ActionHandler<typeof Actions.setTokenPair> = (
  state,
  { tokenPair },
) => ({
  ...state,
  tokenPair,
  authError: null,
});

const setUserData: ActionHandler<typeof Actions.setUserData> = (
  state,
  { payload },
) => ({
  ...state,
  userData: {
    ...state.userData,
    ...payload,
  },
  isLoggedIn: true,
  authError: null,
});

const setLoadedToken: ActionHandler<typeof Actions.setLoadedToken> = (
  state,
  { isLoadedToken },
) => ({
  ...state,
  isLoadedToken,
});

const setConfirmMessage: ActionHandler<typeof Actions.setConfirmMessage> = (
  state,
  { payload },
) => ({
  ...state,
  confirmMessage: payload.confirmMessage,
});

const setRestorePasswordEmail: ActionHandler<typeof Actions.setRestorePasswordEmail> = (
  state,
  { restorePasswordEmail },
) => ({
  ...state,
  restorePasswordEmail,
});

const setRestoreUserId: ActionHandler<typeof Actions.setRestoreUserId> = (
  state,
  { restoreUserId },
) => ({
  ...state,
  restoreUserId,
});

const changeFreeCanvasMode: ActionHandler<typeof Actions.changeFreeCanvasMode> = (
  state,
  { enabled },
) => ({
  ...state,
  freeCanvasMode: {
    ...state.freeCanvasMode,
    enabled,
  },
});

const logout: ActionHandler<typeof Actions.logout> = () => ({
  ...initialUserState,
});

// TODO: type Action in Handlers
const handlers: Handlers<UserState> = {
  [TYPES.CHANGE_L_PANEL]: changeMinLPanel,
  [TYPES.CHANGE_PROTOTYPE_MODE]: changePrototypeMode,
  [TYPES.CHANGE_FREE_CANVAS_MODE]: changeFreeCanvasMode,
  [TYPES.TOGGLE_USER_LOADING]: changeSignLoader,
  [TYPES.SET_TOKEN_PAIR]: setTokenPair,
  [TYPES.SET_USER_DATA]: setUserData,
  [TYPES.SET_LOADED_TOKEN]: setLoadedToken,
  [TYPES.SET_AUTH_ERROR]: setAuthError,
  [TYPES.SET_RESTORE_PASSWORD_EMAIL]: setRestorePasswordEmail,
  [TYPES.SET_RESTORE_USER_ID]: setRestoreUserId,
  [TYPES.LOGOUT]: logout,
  [TYPES.SET_CONFIRM_MESSAGE]: setConfirmMessage,
} as const;

export default createReducer(initialUserState, handlers);
