import React, { FC, useState, useCallback, MouseEvent } from 'react';
import ShareIcon from '@material-ui/icons/Share';
import {
  Button,
  IconButton,
  Popover,
  Container,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { enqueueSnackbar } from '@Redux/notification/actions';
import { selectTokenPair, selectUserData } from '@Redux/user/selectors';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { selectActiveElementId } from '@Redux/project/selectors/element';
import { makeStyles } from '@material-ui/core/styles';
import {selectProjectViewTokenPair} from '@Redux/user/selectors'
import { setProjectViewStart } from '@Redux/user/actions'
import axios from 'axios';
import { shorten_url_api_key } from '@Constants/defaultParams';
const useStyles = makeStyles({
  popup: {
    padding: '1em',
    display: 'flex',
    flexDirection: 'column',
  },
});

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
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  const [isUserWarnigOpen, setIsUserWarnigOpen] = useState(false);
  const [isElement, setIsElement] = useState(false); 
  const handleClick = (ev: MouseEvent<HTMLButtonElement>) => {
    setAnchor(ev.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const open = Boolean(anchor);

  const handleCopyLink = useCallback(
    (includeElement = false) => {
      const { origin } = window.location;
      dispatch(setProjectViewStart())
      // console.log("viewToken",viewToken)
      const url = `${origin}/share/?user=${
        user.id
      }&project=${projectId}&screen=${screenId}${
        activeElementId && includeElement ? `&element=${activeElementId}` : ''
      }&token=${access}&refresh=${refresh}`;

      const headers = {
        apikey: shorten_url_api_key,
      };

      axios
        .post('https://api.apilayer.com/short_url/hash', url, { headers })
        .then((response) =>
          navigator.clipboard.writeText(response.data.short_url),
        );

      handleClose();
      setIsUserWarnigOpen(false);
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
  const openModel = (element) => {
    setIsElement(element);
    setIsUserWarnigOpen(true);
  };
  return (
    <>
      <IconButton title="Share" className={className} onClick={handleClick}>
        <Box component="div">
          <ShareIcon />
          <Typography variant="body1">Share</Typography>
        </Box>
      </IconButton>

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
            onClick={() => openModel(false)}
          >
            Copy screen link
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => openModel(true)}
            disabled={!activeElementId || parseInt(activeElementId) <= 0}
          >
            Copy element link
          </Button>
        </Container>
      </Popover>
      <Dialog
        open={isUserWarnigOpen}
        onClose={() => setIsUserWarnigOpen(false)}
      >
        <DialogTitle>Warning</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Users with a link will have all the rights and accesses. Make sure
            it will be sent to trusted users only
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setIsUserWarnigOpen(false)}>Disagree</Button>

          <Button
            onClick={() =>
              isElement ? handleCopyLink(isElement) : handleCopyLink()
            }
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Share;
