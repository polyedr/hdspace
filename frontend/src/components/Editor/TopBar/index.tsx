import React, { useState } from 'react';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import TabletMacIcon from '@material-ui/icons/TabletMac';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import Switch from '@material-ui/core/Switch';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { selectIsPrototypeMode } from '../../../redux/user/selectors';
import { changePrototypeMode } from '../../../redux/user/actions';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
});

const formats = ['desktop', 'tablet', 'mobile'] as const;

const TopBar = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const isProtoMode = useSelector(selectIsPrototypeMode);
  const [format, setFormat] = useState(formats[0]);

  const handleFormat = (ev, newFormat) => setFormat(newFormat);

  const handleToggleProtoMode = () =>
    dispatch(changePrototypeMode(!isProtoMode));

  return (
    <div className={classes.root}>
      <ToggleButtonGroup value={format} onChange={handleFormat} exclusive>
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
