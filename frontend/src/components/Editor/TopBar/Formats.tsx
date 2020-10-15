import React from 'react';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import TabletMacIcon from '@material-ui/icons/TabletMac';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import ScreenRotationIcon from '@material-ui/icons/ScreenRotation';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { formats } from '../Workspace/Workspace';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
});

type Props = {
  format: typeof formats[number];
  handleFormatChange: (
    ev: any,
    newFormat: typeof formats[number] | null,
  ) => void;
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
        <ToggleButton value={formats[0]} title="Desktop view">
          <DesktopWindowsIcon />
        </ToggleButton>

        <ToggleButton value={formats[1]} title="Tablet view">
          <TabletMacIcon />
        </ToggleButton>

        <ToggleButton value={formats[2]} title="Mobile view">
          <PhoneIphoneIcon />
        </ToggleButton>
      </ToggleButtonGroup>

      {format !== formats[0] && (
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
