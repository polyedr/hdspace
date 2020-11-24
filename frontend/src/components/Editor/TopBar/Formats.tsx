import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import TabletMacIcon from '@material-ui/icons/TabletMac';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import ScreenRotationIcon from '@material-ui/icons/ScreenRotation';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  selectScreenFormat,
  selectScreenRotated,
} from '@Redux/project/selectors/base';
import { changeScreenFormat, rotateScreenFormat } from '@Redux/project/actions';
import { SCREEN_FORMATS } from '@Src/types';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    width: 180,
  },
});

const Formats: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const format = useSelector(selectScreenFormat);
  const rotated = useSelector(selectScreenRotated);

  const handleFormatChange = (ev, newFormat) => {
    if (!newFormat) return;
    dispatch(changeScreenFormat(newFormat));
  };

  const handleRotatedToggle = () => dispatch(rotateScreenFormat(!rotated));

  return (
    <div className={classes.root}>
      <ToggleButtonGroup value={format} onChange={handleFormatChange} exclusive>
        <ToggleButton value={SCREEN_FORMATS.Desktop} title="Desktop view">
          <DesktopWindowsIcon />
        </ToggleButton>

        <ToggleButton value={SCREEN_FORMATS.Tablet} title="Tablet view">
          <TabletMacIcon />
        </ToggleButton>

        <ToggleButton value={SCREEN_FORMATS.Mobile} title="Mobile view">
          <PhoneIphoneIcon />
        </ToggleButton>
      </ToggleButtonGroup>

      {format !== SCREEN_FORMATS.Desktop && (
        <ToggleButton
          selected={rotated}
          onChange={handleRotatedToggle}
          value="rotated"
          title="Rotated view"
        >
          <ScreenRotationIcon />
        </ToggleButton>
      )}
    </div>
  );
};

export default Formats;
