import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';
import {
  selectCurrentScreenId,
  selectFreeCanvasMode,
} from '@Redux/project/selectors/screen';
import Actions from './actions';

const useStyles = makeStyles<Theme>(({ typography, spacing }) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  switch: {
    padding: '0 1em',
  },
  title: {
    color: '#81818E',
    fontSize: typography.fontSize,
  },
  wrapper: {
    flex: 1,
    display: 'flex',
    flexWrap: 'nowrap',
  },
  magic: {
    paddingRight: spacing(1),
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  magicButton: {
    height: 40,
  },
  helpTextStyle: {
    textDecoration: 'none',
    color: 'white',
    '&:hover': {
      cursor: 'pointer',
    },
    margin: 'auto',
  },
}));

const TopBar: React.FC = () => {
  const classes = useStyles();
  const currentScreenId = useSelector(selectCurrentScreenId);
  const freeCanvasMode = useSelector(selectFreeCanvasMode);

  return currentScreenId !== -1 ? (
    <div className={classes.root}>
      <Actions />

      <div className={classes.wrapper}>
        {freeCanvasMode ? <div className={classes.magic} /> : null}
      </div>
    </div>
  ) : (
    <div />
  );
};

export default TopBar;
