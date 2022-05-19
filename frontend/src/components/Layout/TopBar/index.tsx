import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { toggleContainersBorders } from '@Redux/project/actions';
import {
  selectBordersEnabled,
  selectShowingBorders,
} from '@Redux/project/selectors/base';
import {
  selectCurrentScreenId,
  selectFreeCanvasMode,
} from '@Redux/project/selectors/screen';
import { FormControlLabel, Typography, Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Layouts from './Layouts';
import Actions from './actions';
import ShowGrid from './ShowGrid';

const useStyles = makeStyles(({ typography, spacing }) => ({
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
  const dispatch = useDispatch();
  const classes = useStyles();

  const currentScreenId = useSelector(selectCurrentScreenId);
  const isProtoMode = useSelector(selectIsPrototypeMode);
  const freeCanvasMode = useSelector(selectFreeCanvasMode);
  const showBorders = useSelector(selectShowingBorders);
  const bordersEnabled = useSelector(selectBordersEnabled);

  return currentScreenId !== -1 ? (
    <div className={classes.root}>
      <div style={{ visibility: 'hidden' }} />
      <Actions />

      <div className={classes.wrapper}>
        <>
          {freeCanvasMode ? (
            <div className={classes.magic} />
          ) : (
            <FormControlLabel
              control={
                <Checkbox
                  name="Show borders"
                  checked={showBorders}
                  disabled={!bordersEnabled && !isProtoMode}
                  onChange={() =>
                    dispatch(toggleContainersBorders(!showBorders))
                  }
                />
              }
              label={
                <Typography className={classes.title}>Show blocks</Typography>
              }
            />
          )}
          <ShowGrid />
        </>
      </div>
      <Layouts />
    </div>
  ) : (
    <div />
  );
};

export default TopBar;
