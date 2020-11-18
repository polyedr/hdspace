import React from 'react';
import Switch from '@material-ui/core/Switch';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import html2canvas from 'html2canvas';
import { changePrototypeMode } from '../../../redux/user/actions';
import { selectIsPrototypeMode } from '../../../redux/user/selectors';
import Formats from './Formats';
import Actions from './Actions';
import { changeFreeCanvasMode } from '../../../redux/project/actions';
import {
  selectCurrentScreenId,
  selectFreeCanvasMode,
} from '../../../redux/project/selectors';
import ShowBorders from '../../RightPanel/PropertiesTab/Controls/ShowBorders/ShowBorders';

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

const TopBar: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const currentScreenId = useSelector(selectCurrentScreenId);
  const isProtoMode = useSelector(selectIsPrototypeMode);
  const freeCanvasMode = useSelector(selectFreeCanvasMode);

  const makeMagic = async () => {
    const root = document.getElementById('free-canvas-root');
    if (!root) return;

    const canvas = await html2canvas(root, {
      useCORS: true,
      allowTaint: true,
      logging: true,
    });
    console.log(canvas);
  };

  const handleToggleProtoMode = () =>
    dispatch(changePrototypeMode(!isProtoMode));

  const handleToggleFreeMode = () =>
    dispatch(changeFreeCanvasMode(!freeCanvasMode));

  return currentScreenId !== -1 ? (
    <div className={classes.root}>
      <Actions />

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

        {freeCanvasMode ? (
          <button type="button" onClick={makeMagic}>
            magic
          </button>
        ) : (
          <ShowBorders />
        )}
      </div>

      <Formats />
    </div>
  ) : (
    <div />
  );
};

export default TopBar;
