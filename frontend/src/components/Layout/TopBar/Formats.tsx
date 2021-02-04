import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import TabletMacIcon from '@material-ui/icons/TabletMac';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import ScreenRotationIcon from '@material-ui/icons/ScreenRotation';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  selectScreenFormat,
  selectScreenRotated,
} from '@Redux/project/selectors/base';
import { changeLayout, rotateScreenFormat } from '@Redux/project/actions';
import { Layout } from '@Src/types';
import { StyledToggleButton } from '../../styledComponents';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  rotated: {
    width: 50,
    paddingLeft: '0.5em',
  },
});

const Formats: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const format = useSelector(selectScreenFormat);
  const rotated = useSelector(selectScreenRotated);

  const handleFormatChange = (ev, newFormat) => {
    if (!newFormat) return;
    dispatch(changeLayout(newFormat));
  };

  const handleRotatedToggle = () => dispatch(rotateScreenFormat(!rotated));

  return (
    <div className={classes.root}>
      <ToggleButtonGroup
        value={format}
        onChange={handleFormatChange}
        exclusive
        size="small"
      >
        <StyledToggleButton value={Layout.Desktop} title="Desktop view">
          <DesktopWindowsIcon />
        </StyledToggleButton>

        <StyledToggleButton value={Layout.Tablet} title="Tablet view">
          <TabletMacIcon />
        </StyledToggleButton>

        <StyledToggleButton value={Layout.Mobile} title="Mobile view">
          <PhoneIphoneIcon />
        </StyledToggleButton>
      </ToggleButtonGroup>

      <div className={classes.rotated}>
        {format !== Layout.Desktop && (
          <StyledToggleButton
            size="small"
            selected={rotated}
            onChange={handleRotatedToggle}
            value="rotated"
            title="Rotated view"
          >
            <ScreenRotationIcon />
          </StyledToggleButton>
        )}
      </div>
    </div>
  );
};

export default Formats;
