import { AppReduxState } from '../../types';

export const selectUserData = ({ user }: AppReduxState) => user.userData;

export const selectIsLeftPanelMinimized = ({ user }: AppReduxState) =>
  user.isLPanelMinimized;

export const selectIsPrototypeMode = ({ user }: AppReduxState) =>
  user.isPrototypeMode;

export const selectAuthError = ({ user }: AppReduxState) => user.authError;

export const selectTokenPair = ({ user }: AppReduxState) => user.tokenPair;

export const selectIsUserLoading = ({ user }: AppReduxState) => user.isLoading;

export const selectConfirmMessage = ({ user }: AppReduxState) =>
  user.confirmMessage;

export const selectIsLoggedIn = ({ user }: AppReduxState) => user.isLoggedIn;

export const selectRightPanelActiveTab = ({ project }: AppReduxState) =>
  project.ui.rightPanel.activeTab;
