import React from 'react';
import Switch from '@material-ui/core/Switch';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {
  changeFreeCanvasMode,
  changePrototypeMode,
} from '../../../redux/user/actions';
import {
  selectFreeCanvasMode,
  selectIsPrototypeMode,
} from '../../../redux/user/selectors';
import Formats from './Formats';
import Actions from './Actions';
import { SCREEN_FORMATS } from '../../../constants/defaultParams';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switch: {
    padding: '0 1em',
  },
});

type Props = {
  format: SCREEN_FORMATS;
  handleFormatChange: (ev: any, newFormat: SCREEN_FORMATS | null) => void;
  rotated: boolean;
  handleRotatedToggle: () => void;
};

const TopBar: React.FC<Props> = ({
  format,
  handleFormatChange,
  rotated,
  handleRotatedToggle,
}) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const isProtoMode = useSelector(selectIsPrototypeMode);
  const freeCanvasMode = useSelector(selectFreeCanvasMode);

  const handleToggleProtoMode = () =>
    dispatch(changePrototypeMode(!isProtoMode));

  const handleToggleFreeMode = () =>
    dispatch(changeFreeCanvasMode(!freeCanvasMode));

  return (
    <div className={classes.root}>
      <Formats
        format={format}
        handleFormatChange={handleFormatChange}
        rotated={rotated}
        handleRotatedToggle={handleRotatedToggle}
      />

      <div>
        <FormControlLabel
          control={
            <Switch checked={isProtoMode} onChange={handleToggleProtoMode} />
          }
          label="Proto Mode"
          labelPlacement="end"
          className={classes.switch}
        />

        <FormControlLabel
          control={
            <Switch checked={freeCanvasMode} onChange={handleToggleFreeMode} />
          }
          label="Free Canvas Mode"
          labelPlacement="end"
          className={classes.switch}
        />
      </div>

      <Actions />
    </div>
  );
};

export default TopBar;
