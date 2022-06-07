import React from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  IconButton,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ spacing, palette }) =>
  createStyles({
    closeBtn: {
      position: 'absolute',
      right: spacing(1),
      top: spacing(1),
      color: palette.grey[500],
    },
  }),
);

type Props = {
  open: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
  onDelete: (e) => void;
};

const ConfirmDialog: React.FC<Props> = ({
  open,
  title = 'Confirm',
  description = 'Are you sure?',
  onDelete,
  onClose,
}) => {
  const classes = useStyles();
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        { title }
        <IconButton 
          aria-label="close" 
          className={classes.closeBtn} 
          onClick={onClose}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          { description }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onDelete} color="primary" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
