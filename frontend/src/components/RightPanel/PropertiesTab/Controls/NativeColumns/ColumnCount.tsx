import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { ColumnsElement, PropertiesChangeProps } from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import { FormControlLabel, MenuItem } from '@mui/material';
import { useColumnControlStyles } from './styles';

enum Units {
  auto = 'auto',
  units = 'units',
}

interface Props {
  updateStyles: PropertiesChangeProps<ColumnsElement>['updateStyles'];
  count: React.CSSProperties['columnCount'];
  canEdit: boolean;
}

const ColumnCount: React.FC<Props> = ({ updateStyles, count, canEdit }) => {
  const classes = useColumnControlStyles();

  const [countState, setCountState] = useState<
    React.CSSProperties['columnCount']
  >(count || 0);
  useEffect(() => {
    setCountState(count);
  }, [count]);

  const debouncedCount = useDebouncedCallback(
    (value) => updateStyles({ columnCount: value }),
    250,
  );

  const handleCountChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    const validValue = +value < 1 ? 1 : +value;
    setCountState(validValue);
    debouncedCount.callback(validValue);
  };

  const [units, setUnits] = useState<string>(
    count === Units.auto ? Units.auto : Units.units,
  );

  const handleCountUnitsChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    const defaultCount = 2;
    if (value === Units.auto) {
      updateStyles({ columnCount: Units.auto });
    } else {
      setCountState(defaultCount);
      updateStyles({ columnCount: defaultCount });
    }
    setUnits(value);
  };

  return (
    <FormControlLabel
      classes={{ root: classes.rootLabel, label: classes.label }}
      label="Column Count"
      labelPlacement="start"
      control={
        <div className={classes.control}>
          <StyledTextField
            value={countState || 0}
            onChange={handleCountChange}
            margin="dense"
            type={units === 'auto' ? 'text' : 'number'}
            disabled={units === 'auto' || !canEdit}
          />

          <StyledTextField
            value={units}
            onChange={handleCountUnitsChange}
            label="units"
            margin="dense"
            select
            disabled={!canEdit}
          >
            {Object.keys(Units).map((unit) => (
              <MenuItem key={unit} value={unit}>
                {unit}
              </MenuItem>
            ))}
          </StyledTextField>
        </div>
      }
    />
  );
};

export default ColumnCount;
