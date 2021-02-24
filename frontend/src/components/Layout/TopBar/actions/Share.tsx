import React, { FC, useState, MouseEvent } from 'react';
import ShareIcon from '@material-ui/icons/Share';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Container from '@material-ui/core/Container';
import { Button, makeStyles } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { enqueueSnackbar } from '@Redux/notification/actions';

const useStyles = makeStyles({
  popup: {
    padding: '1em',
  },
});

type Props = {
  className: string;
};

const Share: FC<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);

  const handleClick = (ev: MouseEvent<HTMLButtonElement>) => {
    setAnchor(ev.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const open = Boolean(anchor);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <IconButton title="Share" className={className} onClick={handleClick}>
        <ShareIcon />
      </IconButton>

      <Popover
        id={id}
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
              navigator.clipboard.writeText('project link');

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
