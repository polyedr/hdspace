import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SnackbarKey, useSnackbar } from 'notistack';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import {
  closeSnackbarAction,
  removeSnackbarAction,
} from '../redux/notification/actions';
import { selectNotifications } from '../redux/notification/selectors';

let displayed: SnackbarKey[] = [];

const Notifier: React.FC = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const storeDisplayed = (id: SnackbarKey) => {
    displayed = [...displayed, id];
  };

  const removeDisplayed = (id: SnackbarKey) => {
    displayed = [...displayed.filter((key) => id !== key)];
  };

  useEffect(() => {
    notifications.forEach(
      ({ key, message, options = {}, dismissed = false }) => {
        if (dismissed) {
          // dismiss snackbar using notistack
          closeSnackbar(key);
          return;
        }

        // do nothing if snackbar is already displayed
        if (displayed.includes(key)) return;

        // display snackbar using notistack
        enqueueSnackbar(message, {
          key,
          ...options,
          onClose: (event, reason, myKey) => {
            if (options.onClose) {
              options.onClose(event, reason, myKey);
            }
          },
          onExited: (event, myKey) => {
            // remove this snackbar from redux store
            dispatch(removeSnackbarAction(myKey));
            removeDisplayed(myKey);
          },
          action: () => (
            <IconButton
              title="Close"
              size="small"
              color="inherit"
              onClick={() => dispatch(closeSnackbarAction(key))}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          ),
        });

        // keep track of snackbars that we've displayed
        storeDisplayed(key);
      },
    );
  }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);

  return null;
};

export default Notifier;
