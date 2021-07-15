import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ScreenRotationIcon from '@material-ui/icons/ScreenRotation';
import {
  selectLayout,
  selectScreenRotated,
} from '@Redux/project/selectors/base';
import { changeLayout, rotateScreenFormat } from '@Redux/project/actions';
import {
  additionalLayoutPhone,
  additionalLayoutDesktop,
  additionalLayoutTablet,
  Layout,
} from '@Src/types';
import ELEMENT_IDS from '@Constants/elementIds';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { FormControl, NativeSelect } from '@material-ui/core';
import { StyledToggleButton } from '../../styledComponents';

const useStyles = makeStyles((theme) =>
  createStyles({
    formControl: {
      minWidth: 120,
    },
    selectEmpty: {
      margin: theme.spacing(1),
      padding: theme.spacing(0.3),
      backgroundColor: 'white',
    },
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    rotated: {
      width: 50,
      paddingLeft: '0.5em',
    },
  }),
);

const Layouts: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const layout = useSelector(selectLayout);
  const rotated = useSelector(selectScreenRotated);

  const handleFormatChange = (ev) => {
    if (!ev.target.value) return;

    dispatch(changeLayout(ev.target.value));
  };

  const handleRotatedToggle = () => dispatch(rotateScreenFormat(!rotated));

  const renderOption = (additionalLayout) => {
    return additionalLayout.map((key) => (
      <option value={Layout[key]} key={key}>
        {key}
      </option>
    ));
  };

  return (
    <div className={classes.root} id={ELEMENT_IDS.layoutSelector}>
      <FormControl className={classes.formControl}>
        <NativeSelect
          value={layout}
          onChange={handleFormatChange}
          className={classes.selectEmpty}
        >
          <optgroup label="Desktop">
            {renderOption(additionalLayoutDesktop)}
          </optgroup>
          <optgroup label="Mobile">
            {renderOption(additionalLayoutPhone)}
          </optgroup>
          <optgroup label="Tablet">
            {renderOption(additionalLayoutTablet)}
          </optgroup>
        </NativeSelect>
      </FormControl>
      <div className={classes.rotated}>
        {layout !== Layout.Desktop && (
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

export default Layouts;
