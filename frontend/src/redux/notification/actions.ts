import { SnackbarKey } from 'notistack';
import logger from 'loglevel';
import TYPES from '../actionTypes';
import { Notification } from '../types';

export const enqueueSnackbar = (
  notification: Omit<Notification, 'key'>,
  error?: Error,
) => {
  if (error) {
    logger.error(error);
  }
  return {
    type: TYPES.ENQUEUE_SNACKBAR,
    notification: {
      ...notification,
      key: new Date().getTime() + Math.random(),
    },
  };
};

export const closeSnackbarAction = (key: SnackbarKey) => ({
  type: TYPES.CLOSE_SNACKBAR,
  key,
});

export const removeSnackbarAction = (key: SnackbarKey) => ({
  type: TYPES.REMOVE_SNACKBAR,
  key,
});

export type NotificationActions = ReturnType<
  | typeof enqueueSnackbar
  | typeof closeSnackbarAction
  | typeof removeSnackbarAction
>;
