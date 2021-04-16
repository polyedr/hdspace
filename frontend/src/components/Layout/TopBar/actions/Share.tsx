import React, { FC, useState, useCallback, MouseEvent } from 'react';
import ShareIcon from '@material-ui/icons/Share';
import { Button, IconButton, Popover, Container } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { enqueueSnackbar } from '@Redux/notification/actions';
import { selectTokenPair, selectUserData } from '@Redux/user/selectors';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { selectActiveElementId } from '@Redux/project/selectors/element';
import { makeStyles } from '@material-ui/core/styles';

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

  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);

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

      navigator.clipboard.writeText(
        `${origin}/share/?user=${
          user.id
        }&project=${projectId}&screen=${screenId}${
          activeElementId && includeElement ? `&element=${activeElementId}` : ''
        }&token=${access}&refresh=${refresh}`,
      );

      handleClose();
      dispatch(
        enqueueSnackbar({
          message: 'Project link was successfully copied to the clipboard',
        }),
      );
    },
    [access, activeElementId, dispatch, projectId, refresh, screenId, user.id],
  );

  return (
    <div>
      <IconButton title="Share" className={className} onClick={handleClick}>
        <ShareIcon />
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
    </div>
  );
};

export default Share;
