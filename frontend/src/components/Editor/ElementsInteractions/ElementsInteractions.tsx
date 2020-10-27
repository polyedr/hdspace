import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { selectBorderedElementsRef } from '../../../redux/project/selectors';
import InteractionsHandler from './InteractionsHandler';

const useStyles = makeStyles({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    maxHeight: 0,
  },
});

const ElementsInteractions: React.FC<any> = () => {
  const borderedElements = useSelector(selectBorderedElementsRef);
  const borderedElementsIds = Object.keys(borderedElements);
  const classes = useStyles();
  return (
    <div className={classes.container}>
      {borderedElementsIds.map((id) => (
        <InteractionsHandler key={`border-handler-${id}`} elementId={id} />
      ))}
    </div>
  );
};

export default ElementsInteractions;
