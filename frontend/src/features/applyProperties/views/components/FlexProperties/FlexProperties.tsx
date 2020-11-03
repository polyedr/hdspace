import React, { memo, useCallback, useState } from 'react';
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
import { Flex } from '../../../../../redux/project/types';

const useStyles = makeStyles({
  arrowRotated: {
    transform: 'rotate(90deg)',
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
});

type Orientation = 'vertical' | 'horizontal';

type Props = {
  properties: Flex;
  onChange<T extends keyof Flex>(prop: T, value: Flex[T]): void;
};

const FlexProperties: React.FC<Props> = ({ properties, onChange }) => {
  const classes = useStyles();
  const [orientation, setOrientation] = useState<Orientation>(
    properties.flexDirection.includes('row') ? 'horizontal' : 'vertical',
  );

  const handleChangeOrientation = (ev, newOrientation) => {
    if (!newOrientation) return;
    setOrientation(newOrientation);
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
              value={orientation}
              onChange={handleChangeOrientation}
              exclusive
            >
              <ToggleButton value="horizontal">
                <HeightIcon className={classes.arrowRotated} />
              </ToggleButton>

              <ToggleButton value="vertical">
                <HeightIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          }
        />
      </div>

      <div className={classes.wrapper}>
        <FormControl>
          <InputLabel>{renderLabel(orientation === 'vertical')}</InputLabel>

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
          <InputLabel>{renderLabel(orientation === 'horizontal')}</InputLabel>

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
