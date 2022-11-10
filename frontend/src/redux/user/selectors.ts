import { Experience } from '@Src/types';
import { AppReduxState } from '../types';

export const selectUserData = ({ user }: AppReduxState) => user.userData;

export const selectUserProfileDataParameters = ({ user }: AppReduxState) =>
  user.userData.profile.parameters.profileDataParameters;

export const selectSubscriptionData = ({ user }: AppReduxState) =>
  user?.subscriptionData;

export const selectProfileData = ({ user }: AppReduxState) =>
  user.userData.profile;

export const selectIsLeftPanelMinimized = ({ user }: AppReduxState) =>
  user.isLPanelMinimized;

export const selectIsPrototypeMode = ({ user }: AppReduxState) =>
  user.isPrototypeMode;

export const selectAuthError = ({ user }: AppReduxState) => user.error;

export const selectTokenPair = ({ user }: AppReduxState) => user.tokenPair;

export const selectProjectViewTokenPair = ({ user }: AppReduxState) =>
  user?.viewTokenPair;

export const selectIsUserLoading = ({ user }: AppReduxState) => user.isLoading;

export const selectConfirmMessage = ({ user }: AppReduxState) =>
  user.confirmMessage;

export const selectIsLoggedIn = ({ user }: AppReduxState) => user.isLoggedIn;

export const selectIsTokenLoaded = ({ user }: AppReduxState) =>
  user.isTokenLoaded;

export const selectUserGuideWatched = ({ user }: AppReduxState) =>
  user.userData.profile.experienced !== Experience.BEGINNER;

export const selectUserGuideActive = ({ user }: AppReduxState) =>
  user.userGuide.active;

export const selectChatCredentials = ({ user }: AppReduxState) => user.chat;
