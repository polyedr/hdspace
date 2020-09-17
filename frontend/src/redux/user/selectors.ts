/* eslint-disable import/prefer-default-export */

import { AppReduxState } from '../../shared/types/app';

export const selectUserData = ({ user }: AppReduxState) => user.userData;

export const selectIsLeftPanelMinimized = ({ user }: AppReduxState) =>
  user.isLPanelMinimized;

export const selectIsPrototypeMode = ({ user }: AppReduxState) =>
  user.isPrototypeMode;
