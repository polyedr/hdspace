import { makeStyles } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import { setNewScreenModal } from '@Redux/project/actions';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

type Props = {
  open: boolean;
};

const useStyles = makeStyles(({ palette, shadows, spacing }) => ({
  backdrop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: palette.background.paper,
    border: '2px solid #000',
    boxShadow: shadows[5],
    padding: spacing(2, 4, 3),
  },
}));

const NewScreenModal: FC<Props> = ({ open }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const handleClose = () => dispatch(setNewScreenModal(false));

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.backdrop}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.modal}>
          <h2 id="transition-modal-title">Transition modal</h2>
          <p id="transition-modal-description">
            react-transition-group animates me.
          </p>
        </div>
      </Fade>
    </Modal>
  );
};

export default NewScreenModal;
