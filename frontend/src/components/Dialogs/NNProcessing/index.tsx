import React from 'react';
import { useSelector } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { selectAnalyzerLoader } from '@Redux/project/selectors/base';

const useStyles = makeStyles({
  modal: {
    padding: '20px',
  },
});

const NNProcessing: React.FC = () => {
  const classes = useStyles();
  const isAnalyzerModalOpened = useSelector(selectAnalyzerLoader);

  return (
    <Dialog open={isAnalyzerModalOpened}>
      <div className={classes.modal}>
        <Typography variant="body2">Analyzing...</Typography>
      </div>
    </Dialog>
  );
};

export default NNProcessing;
