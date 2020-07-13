import React from 'react';
import { connect } from 'react-redux';
import { Snackbar, SnackbarCloseReason, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { AppReduxState } from '$shared/types/app';
import { NotificationType } from '$redux/project/types';
import { selectors, actionsCreators } from '$redux/project';
import { NOTIFICATION_AUTO_HIDE_DURATION } from '$constants/notifications';

type StateProps = {
  notifications:  NotificationType | null,
}

function mapState(state: AppReduxState): StateProps {
  return {
    notifications: selectors.selectNotification(state),
  };
}

const mapDispatch = {
  removeNotification: actionsCreators.removeNotification,
};

type Props = StateProps & typeof mapDispatch;

const NotificationsComponent = (props: Props) => {
  const { notifications, removeNotification } = props;

  const handleSnackbarClose = (_event: React.SyntheticEvent<any, Event>, reason: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }

    removeNotification();
  };

  const handleIconButtonClick = () => {
    removeNotification();
  };

  return notifications ? (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(notifications)}
      autoHideDuration={NOTIFICATION_AUTO_HIDE_DURATION}
      onClose={handleSnackbarClose}
      message={notifications.text}
      action={
        <React.Fragment>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleIconButtonClick}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
    />
  ) : (
    <></>
  );
}

export const Notifications = connect(mapState, mapDispatch)(NotificationsComponent);
