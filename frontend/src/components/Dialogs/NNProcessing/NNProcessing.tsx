import React from 'react';
import { useSelector } from 'react-redux';
import Modal from '@material-ui/core/Modal';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import { selectAnalyzerLoader } from '../../../redux/project/selectors';

const useStyles = makeStyles((theme) =>
  createStyles({
    modalWrapper: {
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 10,

      display: 'flex',
      flexWrap: 'nowrap',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100vw',
      height: '100vh',

      color: '#808080',
      fontWeight: 400,

      overflow: 'auto',
      fontSize: '12px',
      lineHeight: '16px',
      background: 'rgba(#3f4b57, 0.8)',
    },
    modal: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      position: 'relative',
      zIndex: 20,
      outline: 'none',
      flex: '0 1',
      width: '200px',
      height: '70px',
      padding: '28px 20px',

      backgroundColor: theme.palette.common.white,
      borderRadius: '5px',

      transition: 'all 0.3s linear',
    },
    modalLabel: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
  }),
);

const NNProcessing: React.FC = () => {
  const classes = useStyles();
  const isAnalyzerModalOpened = useSelector(selectAnalyzerLoader);

  return (
    <Modal open={isAnalyzerModalOpened} className={classes.modalWrapper}>
      <div className={classes.modal}>
        <span>Analyzing...</span>
      </div>
    </Modal>
  );
};

export default NNProcessing;
