import React from 'react';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import TabletMacIcon from '@material-ui/icons/TabletMac';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import ScreenRotationIcon from '@material-ui/icons/ScreenRotation';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { SCREEN_FORMATS } from '../../../constants/defaultParams';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
});

type Props = {
  format: SCREEN_FORMATS;
  handleFormatChange: (ev: any, newFormat: SCREEN_FORMATS | null) => void;
  rotated: boolean;
  handleRotatedToggle: () => void;
};

const Formats: React.FC<Props> = ({
  format,
  rotated,
  handleRotatedToggle,
  handleFormatChange,
}) => {
  const classes = useStyles();

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
