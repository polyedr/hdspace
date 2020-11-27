import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useSelector } from 'react-redux';
import { selectCurrentEditableStyles } from '@Redux/project/selectors/element';
import withConfigurableProperties from '@Utils/withConfigurableProperties';
import { ColumnsElement, PropertiesChangeProps } from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import MenuItem from '@material-ui/core/MenuItem';
import { FormControlLabel } from '@material-ui/core';
import { useColumnControlStyles } from '@Components/RightPanel/PropertiesTab/Controls/Columns/styles';

enum Units {
  auto = 'auto',
  units = 'units',
}

const ColumnCount: React.FC<PropertiesChangeProps<ColumnsElement>> = ({
  updateStyles,
}) => {
  const classes = useColumnControlStyles();
  const count = useSelector(selectCurrentEditableStyles('columnCount'));

  const [countState, setCountState] = useState(count);
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
            disabled={units === 'auto'}
          />

          <StyledTextField
            value={units}
            onChange={handleCountUnitsChange}
            label="units"
            margin="dense"
            select
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

export default withConfigurableProperties(ColumnCount);
