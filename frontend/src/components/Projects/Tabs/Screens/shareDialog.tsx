import React, { FC, useState, useCallback, MouseEvent } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Grid,
  IconButton,
  FormControlLabel,
  Checkbox,
  Typography,
} from '@material-ui/core';
import { Close, FileCopyOutlined } from '@material-ui/icons';
import { makeStyles, createStyles, withStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import { enqueueSnackbar } from '@Redux/notification/actions';
import {
  selectTokenPair,
  selectUserData,
  selectProjectViewTokenPair,
} from '@Redux/user/selectors';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { selectActiveElementId } from '@Redux/project/selectors/element';
import { setProjectViewStart } from '@Redux/user/actions';
import { shorten_url_api_key, SHARING_USER_ID } from '@Constants/defaultParams';
import * as Actions from '@Redux/permissions/actions';
import { UserProjectPermission } from '@Src/types';

const useStyles = makeStyles(({ spacing, palette }) =>
  createStyles({
    closeBtn: {
      position: 'absolute',
      right: spacing(1),
      top: spacing(1),
      color: palette.grey[500],
    },
    dialog: {
      '& .MuiDialogTitle-root': {
        paddingBottom: 0,
      },
      '& .MuiDialogContent-root': {
        paddingBottom: 24,
      },
    },
  }),
);

type Props = {
  open: boolean;
  onClose: () => void;
  onInvite: (e) => void;
};

const ShareDialog: React.FC<Props> = ({ open, onInvite, onClose }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(selectUserData);
  const { access, refresh } = useSelector(selectTokenPair);
  const projectId = useSelector(selectCurrentProjectId);
  const screenId = useSelector(selectCurrentScreenId);
  const activeElementId = useSelector(selectActiveElementId);
  const viewToken = useSelector(selectProjectViewTokenPair);

  const handleCopyLink = useCallback(
    (includeElement = false) => {
      const { origin } = window.location;
      const token = localStorage.getItem('viewToken');
      let jsonToken;
      if (typeof token === 'string') {
        jsonToken = JSON.parse(token);
      }

      const url = `${origin}/share/?user=${SHARING_USER_ID}&project=${projectId}&screen=${screenId}${
        activeElementId && includeElement ? `&element=${activeElementId}` : ''
      }&token=${jsonToken.access}&refresh=${jsonToken.refresh}`;
      const headers = {
        apikey: shorten_url_api_key,
      };

      axios
        .post('https://api.apilayer.com/short_url/hash', url, { headers })
        .then((response) =>
          navigator.clipboard.writeText(response.data.short_url),
        );

      const updatedPermissions: UserProjectPermission[] = [];

      updatedPermissions.push(UserProjectPermission.VIEW_PROJECT);
      dispatch(
        Actions.updateUserPermissionsForProject(
          projectId,
          SHARING_USER_ID,
          updatedPermissions,
        ),
      );
      if (includeElement) {
        dispatch(
          enqueueSnackbar({
            message: 'Element link was successfully copied to the clipboard',
            options: {
              variant: 'success',
            },
          }),
        );
      } else {
        dispatch(
          enqueueSnackbar({
            message: 'Screen link was successfully copied to the clipboard',
            options: {
              variant: 'success',
            },
          }),
        );
      }
    },
    [access, activeElementId, dispatch, projectId, refresh, screenId, user.id],
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      classes={{ paper: classes.dialog }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Share Project
        <IconButton
          aria-label="close"
          className={classes.closeBtn}
          onClick={onClose}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <FormControlLabel
              control={<Checkbox checked color="primary" />}
              label="Everyone who has this link will be able to change project"
            />
          </Grid>
          <Grid item>
            <IconButton size="small" onClick={() => handleCopyLink()}>
              <FileCopyOutlined fontSize="small" />
            </IconButton>
            Copy link to the screen
          </Grid>
          <Grid item>
            <IconButton
              size="small"
              onClick={() => handleCopyLink(true)}
              disabled={!activeElementId || parseInt(activeElementId) <= 0}
            >
              <FileCopyOutlined fontSize="small" />
            </IconButton>
            Copy link to the element
          </Grid>
          <Grid item>
            <Typography>
              You can also invite other users to the project
            </Typography>
          </Grid>
          <Grid item>
            <Button>Invite People</Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
