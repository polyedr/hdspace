import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Modal from '@material-ui/core/Modal';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { selectIsNNProcessingModalOpened } from '../../../redux/project/selectors';
import { setIsNNProcessingModalOpened } from '../../../redux/project/actions';

const useStyles = makeStyles({
  modal: {
    position: 'relative',
    zIndex: 20,

    flex: '0 1',
    minHeight: '470px',
    padding: '28px 20px',

    background: 'white',
    borderRadius: '5px',

    transition: 'all 0.3s linear',
  },
});

const NNProcessing: React.FC = () => {
  const classes = useStyles();
  const isNNProcessingModalOpened = useSelector(
    selectIsNNProcessingModalOpened,
  );

  const dispatch = useDispatch();

  const handleClose = useCallback(() => {
    dispatch(setIsNNProcessingModalOpened(false));
  }, [dispatch]);

  return (
    <Modal
      open={isNNProcessingModalOpened}
      onClose={handleClose}
      className={classes.modal}
    >
      <span>test123</span>
    </Modal>
  );
};

export default NNProcessing;
