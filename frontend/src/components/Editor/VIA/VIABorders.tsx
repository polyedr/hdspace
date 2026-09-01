import { makeStyles } from '@mui/styles';
import React, { FC } from 'react';
import cn from 'classnames';

const useStyles = makeStyles({
  border: {
    position: 'absolute',
    border: '1px solid black',
    backgroundColor: 'yellow',
  },
  top: {
    top: -1,
    height: 3,
    width: '100%',
  },
  right: {
    right: -1,
    width: 3,
    height: '100%',
  },
  bottom: {
    bottom: -1,
    height: 3,
    width: '100%',
  },
  left: {
    left: -1,
    width: 3,
    height: '100%',
  },
});

const VIABorders: FC = () => {
  const classes = useStyles();

  return (
    <>
      <div className={cn(classes.border, classes.top)} />
      <div className={cn(classes.border, classes.right)} />
      <div className={cn(classes.border, classes.bottom)} />
      <div className={cn(classes.border, classes.left)} />
    </>
  );
};

export default VIABorders;
