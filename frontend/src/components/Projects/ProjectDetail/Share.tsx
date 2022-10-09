import React, { FC, useState, useCallback, MouseEvent } from 'react';
import ShareIcon from '@material-ui/icons/Share';
import {
  Button,
  IconButton,
  Popover,
  Container,
  Box,
  Typography,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { enqueueSnackbar } from '@Redux/notification/actions';
import {
  selectTokenPair,
  selectUserData,
  selectProjectViewTokenPair,
} from '@Redux/user/selectors';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { selectActiveElementId } from '@Redux/project/selectors/element';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import { setProjectViewStart } from '@Redux/user/actions';
import axios from 'axios';
import { shorten_url_api_key, SHARING_USER_ID } from '@Constants/defaultParams';
import * as Actions from '@Redux/permissions/actions';
import { UserProjectPermission } from '@Src/types';

const useStyles = makeStyles({
  popup: {
    padding: '1em',
    display: 'flex',
    flexDirection: 'column',
  },
});

const StyledIconButton = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
})(IconButton);

type Props = {
  className?: string;
};

const Share: FC<Props> = ({ className = '' }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = useSelector(selectUserData);
  const { access, refresh } = useSelector(selectTokenPair);
  const projectId = useSelector(selectCurrentProjectId);
  const screenId = useSelector(selectCurrentScreenId);
  const activeElementId = useSelector(selectActiveElementId);
  const viewToken = useSelector(selectProjectViewTokenPair);

  localStorage.setItem('viewToken', JSON.stringify(viewToken));
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  const handleClick = (ev: MouseEvent<HTMLButtonElement>) => {
    setAnchor(ev.currentTarget);
    dispatch(setProjectViewStart());
    dispatch(Actions.getUsersList());
  };

  const handleClose = () => {
    setAnchor(null);
  };
  const open = Boolean(anchor);

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
      handleClose();
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
    <>
      <StyledIconButton title="Share" className={className} onClick={handleClick}>
        <ShareIcon />
      </StyledIconButton>

      <Popover
        open={open}
        anchorEl={anchor}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Container maxWidth="xs" className={classes.popup}>
          <Button
            style={{ marginBottom: '1em' }}
            variant="contained"
            color="primary"
            onClick={() => handleCopyLink()}
          >
            Copy screen link
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleCopyLink(true)}
            disabled={!activeElementId || parseInt(activeElementId) <= 0}
          >
            Copy element link
          </Button>
        </Container>
      </Popover>
    </>
  );
};

export default Share;
