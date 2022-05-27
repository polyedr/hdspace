import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectLayout,
  selectScreenRotated,
  selectCurrentProjectDataJson,
  selectCurrentProject,
} from '@Redux/project/selectors/base';

import {
  changeLayout,
  rotateScreenFormat,
  updateLayoutProject,
} from '@Redux/project/actions';

import {
  additionalLayoutPhone,
  additionalLayoutDesktop,
  additionalLayoutTablet,
  Layout,
} from '@Src/types';

import { Select, ToggleButton, MenuItem } from '@mui/material';
import ScreenRotationIcon from '@mui/icons-material/ScreenRotation';
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';
import TabletIcon from '@mui/icons-material/Tablet';
import PhoneIphoneSharpIcon from '@mui/icons-material/PhoneIphoneSharp';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { FormControl } from '@material-ui/core';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import ELEMENT_IDS from '@Constants/elementIds';

const useStyles = makeStyles((theme) =>
  createStyles({
    formControl: {
      minWidth: 120,
    },
    selectEmpty: {
      color: '#81818E',
      margin: theme.spacing(1),
      padding: theme.spacing(0.3),
      backgroundColor: 'white',
      '& .MuiSelect-select': {
        display: 'flex',
      },
    },
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    rotated: {
      width: 50,
      paddingLeft: '0.5em',
    },
    togglebutton: {
      width: '32px',
      height: '32px',
      border: 'none !important',
      borderRadius: '50% !important',
      color: '#81818E !important',
      '&.Mui-selected': {
        color: '#000  !important',
      },
    },
    dropdowntext: {
      paddingLeft: '10px',
      fontSize: '12px',
    },
    icon: {
      color: '#5064FF',
      width: '16px !important',
    },
  }),
);

const Layouts: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { id } = useSelector(selectCurrentProject);
  const layout = useSelector(selectLayout);
  const rotated = useSelector(selectScreenRotated);
  const projectDataJson = useSelector(selectCurrentProjectDataJson);
  const currentScreenId = useSelector(selectCurrentScreenId);
  const layoutObject = {
    value: layout,
    rotated,
  };
  const handleFormatChange = (e) => {
    if (!e.target.value) return;
    layoutObject.value = e.target.value;
    dispatch(
      updateLayoutProject(
        id,
        JSON.stringify({ ...projectDataJson, layout: layoutObject }),
      ),
    );
    dispatch(changeLayout(e.target.value));
  };

  const handleRotatedToggle = () => {
    dispatch(rotateScreenFormat(!rotated));
    layoutObject.rotated = !rotated;

    dispatch(
      updateLayoutProject(
        id,
        JSON.stringify({ ...projectDataJson, layout: layoutObject }),
      ),
    );
  };

  const iconSelector = (iconType) => {
    if (iconType === 'Desktop')
      return <DesktopWindowsOutlinedIcon className={classes.icon} />;
    if (iconType === 'Mobile')
      return <PhoneIphoneSharpIcon className={classes.icon} />;
    if (iconType === 'Tablet') return <TabletIcon className={classes.icon} />;
    return null;
  };
  const renderOption = (additionalLayout, iconType) => {
    return additionalLayout.map((key) => (
      <MenuItem value={key} key={key} style={{ display: 'flex' }}>
        {iconSelector(iconType)}

        <div className={classes.dropdowntext}>{key}</div>
      </MenuItem>
    ));
  };

  return (
    <>
      {currentScreenId !== -1 ? (
        <div className={classes.root} id={ELEMENT_IDS.layoutSelector}>
          <FormControl className={classes.formControl}>
            <Select
              value={layout}
              variant="standard"
              disableUnderline
              onChange={handleFormatChange}
              className={classes.selectEmpty}
            >
              <MenuItem disabled>Desktop</MenuItem>
              {renderOption(additionalLayoutDesktop, 'Desktop')}
              <MenuItem disabled>Mobile</MenuItem>
              {renderOption(additionalLayoutPhone, 'Mobile')}
              <MenuItem disabled>Tablet</MenuItem>
              {renderOption(additionalLayoutTablet, 'Tablet')}
            </Select>
          </FormControl>
          {layout !== Layout.Desktop && (
            <ToggleButton
              className={classes.togglebutton}
              size="small"
              selected={rotated}
              onChange={handleRotatedToggle}
              value="rotated"
              title="Rotated view"
              sx={{ border: 'none !important' }}
            >
              <ScreenRotationIcon sx={{ width: '16px' }} />
            </ToggleButton>
          )}
        </div>
      ) : null}
    </>
  );
};

export default Layouts;
