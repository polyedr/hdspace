import React from 'react';
import { useSelector } from 'react-redux';
import { Dialog, Typography } from '@mui/material';

import { makeStyles } from '@mui/styles';
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
