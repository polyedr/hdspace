import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import { changePrototypeMode } from '@Redux/user/actions';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import {
  changeFreeCanvasMode,
  convertFreeCanvas,
  setBordersEnabled,
} from '@Redux/project/actions';
import { selectFreeCanvasMode } from '@Redux/project/selectors/base';
import {
  selectCurrentScreenId,
  selectMasterScreenEnabled,
} from '@Redux/project/selectors/screen';
import { PANEL_TRANSITION_DURATION } from '@Src/styles/Theme';
import {
  Switch,
  FormControlLabel,
  Typography,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Layouts from './Layouts';
import Actions from './actions';
import ShowBordersSection from './ShowBordersSection';

const useStyles = makeStyles(({ typography, spacing }) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switch: {
    padding: '0 1em',
  },
  title: {
    fontSize: typography.fontSize,
  },
  wrapper: {
    flex: 1,
    display: 'flex',
    flexWrap: 'nowrap',
  },
  magic: {
    paddingRight: spacing(1),
  },
  magicButton: {
    height: 40,
  },
}));

const TopBar: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const currentScreenId = useSelector(selectCurrentScreenId);
  const isProtoMode = useSelector(selectIsPrototypeMode);
  const freeCanvasMode = useSelector(selectFreeCanvasMode);
  const masterScreenEnabled = useSelector(selectMasterScreenEnabled);

  const createFlex = () => {
    dispatch(convertFreeCanvas());
  };

  const enableBordersDebounce = useDebouncedCallback(() => {
    dispatch(setBordersEnabled(true));
  }, PANEL_TRANSITION_DURATION + 120);

  const handleToggleProtoMode = useCallback(() => {
    dispatch(setBordersEnabled(false));
    dispatch(changePrototypeMode(!isProtoMode));
    enableBordersDebounce.callback();
  }, [dispatch, isProtoMode, enableBordersDebounce]);

  const handleToggleFreeMode = useCallback(() => {
    dispatch(setBordersEnabled(false));
    dispatch(changeFreeCanvasMode(!freeCanvasMode));
    enableBordersDebounce.callback();
  }, [dispatch, freeCanvasMode, enableBordersDebounce]);

  return currentScreenId !== -1 ? (
    <div className={classes.root}>
      <Actions />

      <div className={classes.wrapper}>
        <FormControlLabel
          control={
            <Switch checked={isProtoMode} onChange={handleToggleProtoMode} />
          }
          label={<Typography className={classes.title}>Proto Mode</Typography>}
          labelPlacement="end"
          className={classes.switch}
          disabled={masterScreenEnabled}
        />

        <FormControlLabel
          control={
            <Switch checked={freeCanvasMode} onChange={handleToggleFreeMode} />
          }
          label={
            <Typography className={classes.title}>Free Canvas Mode</Typography>
          }
          labelPlacement="end"
          className={classes.switch}
          disabled={masterScreenEnabled}
        />

        {freeCanvasMode ? (
          <div className={classes.magic}>
            <Button
              onClick={createFlex}
              color="secondary"
              variant="outlined"
              className={classes.magicButton}
            >
              Create Flex
            </Button>
          </div>
        ) : (
          <ShowBordersSection
            label={
              <Typography className={classes.title}>Show blocks</Typography>
            }
          />
        )}
      </div>

      <Layouts />
    </div>
  ) : (
    <div />
  );
};

export default TopBar;
