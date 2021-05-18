import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import { changePrototypeMode } from '@Redux/user/actions';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import {
  convertFreeCanvas,
  setBordersEnabled,
  toggleContainersBorders,
} from '@Redux/project/actions';
import {
  selectBordersEnabled,
  selectShowingBorders,
} from '@Redux/project/selectors/base';
import {
  selectCurrentScreenId,
  selectMasterScreenEnabled,
  selectFreeCanvasMode,
} from '@Redux/project/selectors/screen';
import { PANEL_TRANSITION_DURATION } from '@Src/styles/Theme';
import {
  Switch,
  FormControlLabel,
  Typography,
  Button,
  Checkbox,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Layouts from './Layouts';
import Actions from './actions';

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
  const showBorders = useSelector(selectShowingBorders);
  const bordersEnabled = useSelector(selectBordersEnabled);

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
          <FormControlLabel
            control={
              <Checkbox
                name="Show borders"
                checked={showBorders}
                disabled={!bordersEnabled && !isProtoMode}
                onChange={() => dispatch(toggleContainersBorders(!showBorders))}
              />
            }
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
