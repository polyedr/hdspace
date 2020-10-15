import React from 'react';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import TabletMacIcon from '@material-ui/icons/TabletMac';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import Switch from '@material-ui/core/Switch';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ScreenRotationIcon from '@material-ui/icons/ScreenRotation';
import { selectIsPrototypeMode } from '../../../redux/user/selectors';
import { changePrototypeMode } from '../../../redux/user/actions';
import { formats } from '../Workspace/Workspace';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
});

type Props = {
  format: typeof formats[number];
  handleFormatChange: (ev: any, newFormat: any) => void;
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

  const handleToggleProtoMode = () =>
    dispatch(changePrototypeMode(!isProtoMode));

  return (
    <div className={classes.root}>
      <ToggleButtonGroup value={format} onChange={handleFormatChange} exclusive>
        <ToggleButton value={formats[0]}>
          <DesktopWindowsIcon />
        </ToggleButton>

        <ToggleButton value={formats[1]}>
          <TabletMacIcon />
        </ToggleButton>

        <ToggleButton value={formats[2]}>
          <PhoneIphoneIcon />
        </ToggleButton>
      </ToggleButtonGroup>

      {format !== formats[0] && (
        <ToggleButton
          selected={rotated}
          onChange={handleRotatedToggle}
          value="rotated"
        >
          <ScreenRotationIcon />
        </ToggleButton>
      )}

      <FormControlLabel
        control={
          <Switch checked={isProtoMode} onChange={handleToggleProtoMode} />
        }
        label="Proto mode"
        labelPlacement="end"
      />
    </div>
  );
};

export default TopBar;
