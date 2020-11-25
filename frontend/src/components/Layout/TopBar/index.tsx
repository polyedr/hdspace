import React from 'react';
import Switch from '@material-ui/core/Switch';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { changePrototypeMode } from '../../../redux/user/actions';
import { selectIsPrototypeMode } from '../../../redux/user/selectors';
import Formats from './Formats';
import Actions from './Actions';
import {
  changeFreeCanvasMode,
  convertFreeCanvas,
  toggleContainersBorders,
} from '../../../redux/project/actions';
import {
  selectCurrentScreenId,
  selectFreeCanvasMode,
  selectShowingBorders,
} from '../../../redux/project/selectors';

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
}));

const TopBar: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const currentScreenId = useSelector(selectCurrentScreenId);
  const isProtoMode = useSelector(selectIsPrototypeMode);
  const freeCanvasMode = useSelector(selectFreeCanvasMode);
  const showBorders = useSelector(selectShowingBorders);

  const createFlex = () => {
    dispatch(convertFreeCanvas());
  };

  const handleToggleProtoMode = () =>
    dispatch(changePrototypeMode(!isProtoMode));

  const handleToggleFreeMode = () =>
    dispatch(changeFreeCanvasMode(!freeCanvasMode));

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
        />

        {freeCanvasMode ? (
          <div className={classes.magic}>
            <Button onClick={createFlex} color="secondary" variant="outlined">
              Create Flex
            </Button>
          </div>
        ) : (
          <FormControlLabel
            control={
              <Checkbox
                name="Show borders"
                checked={showBorders}
                onChange={() => dispatch(toggleContainersBorders())}
              />
            }
            label={
              <Typography className={classes.title}>Show blocks</Typography>
            }
          />
        )}
      </div>

      <Formats />
    </div>
  ) : (
    <div />
  );
};

export default TopBar;
