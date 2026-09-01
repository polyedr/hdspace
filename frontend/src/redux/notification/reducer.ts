import produce from 'immer';
import TYPES from '../actionTypes';
import { Notification, NotificationState } from '../types';
import { NotificationActions } from './actions';

const initialNotificationState: NotificationState = {
  notifications: [],
};

export default produce(
  // eslint-disable-next-line consistent-return
  (draft: NotificationState, action: NotificationActions) => {
    switch (action.type) {
      case TYPES.ENQUEUE_SNACKBAR:
        draft.notifications.push(action.notification);
        break;

      case TYPES.CLOSE_SNACKBAR:
        draft.notifications = draft.notifications.map((item: Notification) =>
          item.key === action.key
            ? {
                ...item,
                dismissed: true,
              }
            : { ...item },
        );
        break;

      case TYPES.REMOVE_SNACKBAR:
        draft.notifications = draft.notifications.filter(
          (item) => item.key !== action.key,
        );
        break;

      default:
        return draft;
    }
  },
  initialNotificationState,
);
