import React, { memo, useCallback } from 'react';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { FormControlLabel } from '@material-ui/core';
import HeightIcon from '@material-ui/icons/Height';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { JUSTIFY_VALUES, ALIGN_VALUES } from './constants';
import { Flex } from '../../../../../types';

const useStyles = makeStyles({
  arrowRotated: {
    transform: 'rotate(90deg)',
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
});

type Props = {
  properties: Flex;
  onChange<T extends keyof Flex>(prop: T, value: Flex[T]): void;
};

const FlexProperties: React.FC<Props> = ({ properties, onChange }) => {
  const classes = useStyles();

  const handleChangeOrientation = (ev, newOrientation) => {
    if (!newOrientation) return;
    onChange('flexDirection', newOrientation);
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
              value={properties.flexDirection}
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
          <InputLabel>
            {renderLabel(properties.flexDirection === 'column')}
          </InputLabel>

          <Select
            defaultValue={properties.justifyContent}
            value={properties.justifyContent}
            onChange={(ev) =>
              onChange(
                'justifyContent',
                ev.target.value as Flex['justifyContent'],
              )
            }
          >
            {JUSTIFY_VALUES.map(({ label, value }) => (
              <MenuItem key={value} value={value} dense>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>
            {renderLabel(properties.flexDirection === 'row')}
          </InputLabel>

          <Select
            defaultValue={properties.alignItems}
            value={properties.alignItems}
            onChange={(ev) =>
              onChange('alignItems', ev.target.value as Flex['alignItems'])
            }
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

export default memo(FlexProperties);
