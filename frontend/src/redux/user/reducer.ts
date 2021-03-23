import { createReducer, Handlers } from 'reduxsauce';
import { EXPERIENCE, UnsafeReturnType } from '@Src/types';
import TYPES from '../actionTypes';
import * as Actions from './actions';
import { UserState } from '../types';

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
    dateJoined: null,
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    id: 0,
    profile: {
      hourlyRate: 0,
      approved: false,
      avatar: null,
      id: 0,
      role: '',
      experienced: EXPERIENCE.BEGINNER,
    },
  },
  isLoggedIn: false,
  tokenPair: {
    access: '',
    refresh: '',
  },
  isTokenLoaded: true,
  error: null,
  isLoading: false,
  confirmMessage: '',
  userGuide: {
    active: false,
  },
};

const changeMinLPanel: ActionHandler<
  ReturnType<typeof Actions.changeMinLPanel>
> = (state) => ({
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

const setAuthError: ActionHandler<typeof Actions.setUserError> = (
  state,
  { payload },
) => ({
  ...state,
  authError: payload,
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

const setProfileData: ActionHandler<typeof Actions.setProfileData> = (
  state,
  { payload },
) => ({
  ...state,
  userData: {
    ...state.userData,
    profile: {
      ...state.userData.profile,
      ...payload,
    },
  },
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

const setRestorePasswordEmail: ActionHandler<
  typeof Actions.setRestorePasswordEmail
> = (state, { restorePasswordEmail }) => ({
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

const setUserExperience: ActionHandler<typeof Actions.setUserExperience> = (
  state,
  { payload },
) => ({
  ...state,
  userData: {
    ...state.userData,
    profile: {
      ...state.userData.profile,
      experienced: payload,
    },
  },
});

const setUserGuideActive: ActionHandler<typeof Actions.setUserGuideActive> = (
  state,
  { payload },
) => ({
  ...state,
  userGuide: {
    ...state.userGuide,
    active: payload,
  },
});

const logout: ActionHandler<typeof Actions.logout> = () => ({
  ...initialUserState,
});

// TODO: type Action in Handlers
const handlers: Handlers<UserState> = {
  [TYPES.CHANGE_L_PANEL]: changeMinLPanel,
  [TYPES.CHANGE_PROTOTYPE_MODE]: changePrototypeMode,
  [TYPES.TOGGLE_USER_LOADING]: changeSignLoader,
  [TYPES.SET_TOKEN_PAIR]: setTokenPair,
  [TYPES.SET_USER_DATA]: setUserData,
  [TYPES.SET_PROFILE_DATA]: setProfileData,
  [TYPES.SET_LOADED_TOKEN]: setLoadedToken,
  [TYPES.SET_USER_ERROR]: setAuthError,
  [TYPES.SET_RESTORE_PASSWORD_EMAIL]: setRestorePasswordEmail,
  [TYPES.SET_RESTORE_USER_ID]: setRestoreUserId,
  [TYPES.LOGOUT]: logout,
  [TYPES.SET_CONFIRM_MESSAGE]: setConfirmMessage,
  [TYPES.SET_USER_EXPERIENCE]: setUserExperience,
  [TYPES.SET_USER_GUIDE_ACTIVE]: setUserGuideActive,
} as const;

export default createReducer(initialUserState, handlers);
