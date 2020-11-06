import React from 'react';
import { connect } from 'react-redux';
import { Snackbar, SnackbarCloseReason, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { NOTIFICATION_AUTO_HIDE_DURATION } from './constants';
import { removeNotification } from '../../redux/project/actions';
import { selectNotification } from '../../redux/project/selectors';
import { AppReduxState, Notification as NotificationType } from '../../types';

type StateProps = {
  notification: NotificationType | null;
};

function mapState(state: AppReduxState): StateProps {
  return {
    notification: selectNotification(state),
  };
}

const mapDispatch = {
  removeNotification,
};

type Props = StateProps & typeof mapDispatch;

const Notification: React.FC<Props> = ({
  notification,
  removeNotification,
}) => {
  const handleSnackbarClose = (
    _event: React.SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason,
  ) => {
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
};

export default connect(mapState, mapDispatch)(Notification);
