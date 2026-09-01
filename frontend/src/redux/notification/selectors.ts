import { AppReduxState } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const selectNotifications = ({ notification }: AppReduxState) =>
  notification.notifications;
