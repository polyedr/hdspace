import React from 'react';
import { connect } from 'react-redux';
import { Snackbar, SnackbarCloseReason, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { AppReduxState } from '$shared/types/app';
import { Notification as NotificationType } from '$redux/project/types';
import { selectors, actionsCreators } from '$redux/project';
import { NOTIFICATION_AUTO_HIDE_DURATION } from '$features/notification/types';

type StateProps = {
  notification:  NotificationType | null,
}

function mapState(state: AppReduxState): StateProps {
  return {
    notification: selectors.selectNotification(state),
  };
}

const mapDispatch = {
  removeNotification: actionsCreators.removeNotification,
};

type Props = StateProps & typeof mapDispatch;

const NotificationComponent = (props: Props) => {
  const { notification, removeNotification } = props;

  const handleSnackbarClose = (_event: React.SyntheticEvent<any, Event>, reason: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }

    removeNotification();
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(notification)}
      autoHideDuration={NOTIFICATION_AUTO_HIDE_DURATION}
      onClose={handleSnackbarClose}
      message={notification?.text}
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={removeNotification}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  );
}

export const Notification = connect(mapState, mapDispatch)(NotificationComponent);
