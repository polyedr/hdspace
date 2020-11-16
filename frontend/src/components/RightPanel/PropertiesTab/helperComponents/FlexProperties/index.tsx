import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { FormControlLabel } from '@material-ui/core';
import HeightIcon from '@material-ui/icons/Height';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import * as CSS from 'csstype';
import { JUSTIFY_VALUES, ALIGN_VALUES } from './constants';
import { selectCurrentEditableStyles } from '../../../../../redux/project/selectors';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import {
  Entity,
  LibraryElement,
  PropertiesChangeProps,
} from '../../../../../types';

const useStyles = makeStyles({
  arrowRotated: {
    transform: 'rotate(90deg)',
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
});

const FlexProperties: React.FC<PropertiesChangeProps<
  LibraryElement<Entity>
>> = ({ updateStyles }) => {
  const flexDirection = useSelector(
    selectCurrentEditableStyles('flexDirection'),
  );
  const justifyContent = useSelector(
    selectCurrentEditableStyles('justifyContent'),
  );
  const alignItems = useSelector(selectCurrentEditableStyles('alignItems'));
  const classes = useStyles();
  const handleChangeOrientation = (ev, newOrientation) => {
    if (!newOrientation) return;
    updateStyles({ flexDirection: newOrientation });
  };

  const renderLabel = useCallback(
    (reversed: boolean) => (
      <span>
        {reversed ? 'Y-' : 'X-'}
        axis
      </span>
    ),
    [],
  );

  return (
    <>
      <div className={classes.wrapper}>
        <FormControlLabel
          label="Direction"
          labelPlacement="top"
          control={
            <ToggleButtonGroup
              size="small"
              value={flexDirection || 'initial'}
              onChange={handleChangeOrientation}
              exclusive
            >
              <ToggleButton value="row">
                <HeightIcon className={classes.arrowRotated} />
              </ToggleButton>

              <ToggleButton value="column">
                <HeightIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          }
        />
      </div>

      <div className={classes.wrapper}>
        <FormControl>
          <InputLabel>{renderLabel(flexDirection === 'column')}</InputLabel>

          <Select
            defaultValue="initial"
            value={justifyContent}
            onChange={(ev: React.ChangeEvent<{ value: unknown }>) => {
              updateStyles({
                justifyContent: ev.target.value as CSS.Property.JustifyContent,
              });
            }}
          >
            {JUSTIFY_VALUES.map(({ label, value }) => (
              <MenuItem key={value} value={value} dense>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>{renderLabel(flexDirection === 'row')}</InputLabel>

          <Select
            defaultValue="initial"
            value={alignItems}
            onChange={(ev: React.ChangeEvent<{ value: unknown }>) => {
              updateStyles({
                alignItems: ev.target.value as CSS.Property.AlignItems,
              });
            }}
          >
            {ALIGN_VALUES.map(({ label, value }) => (
              <MenuItem key={value} value={value} dense>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </>
  );
};

export default withConfigurableProperties(FlexProperties);
