import {
  Dialog,
  DialogContent,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';
import { setNewScreenModal } from '@Redux/project/actions';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import HtmlImportForm from './HTMLImportForm';

type Props = {
  open: boolean;
};

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  wrapper: {
    maxWidth: breakpoints.values.sm,
    margin: 'auto',
  },
  backdrop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    padding: spacing(2),
  },
}));

const NewScreenModal: FC<Props> = ({ open }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const handleClose = () => dispatch(setNewScreenModal(false));

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Choose the option to create a new screen</DialogTitle>

      <DialogContent>
        <div className={classes.wrapper}>
          <HtmlImportForm onClose={handleClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewScreenModal;
