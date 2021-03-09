import React, { FC, useState, MouseEvent } from 'react';
import ShareIcon from '@material-ui/icons/Share';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Container from '@material-ui/core/Container';
import { Button, makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { enqueueSnackbar } from '@Redux/notification/actions';
import { selectTokenPair } from '@Redux/user/selectors';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';

const useStyles = makeStyles({
  popup: {
    padding: '1em',
  },
});

type Props = {
  className?: string;
};

const Share: FC<Props> = ({ className = '' }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { access } = useSelector(selectTokenPair);
  const projectId = useSelector(selectCurrentProjectId);
  const screenId = useSelector(selectCurrentScreenId);

  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);

  const handleClick = (ev: MouseEvent<HTMLButtonElement>) => {
    setAnchor(ev.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const open = Boolean(anchor);

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
            variant="contained"
            color="primary"
            onClick={() => {
              const { origin } = window.location;

              navigator.clipboard.writeText(
                `${origin}/share?project=${projectId}&screen=${screenId}&token=${access}`,
              );

              handleClose();
              dispatch(
                enqueueSnackbar({
                  message:
                    'Project link was successfully copied to the clipboard',
                }),
              );
            }}
          >
            Copy link
          </Button>
        </Container>
      </Popover>
    </div>
  );
};

export default Share;
