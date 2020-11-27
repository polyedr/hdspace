import React, { ChangeEvent, useEffect, useState } from 'react';
import withConfigurableProperties from '@Utils/withConfigurableProperties';
import { ColumnsElement, PropertiesChangeProps } from '@Src/types';
import { useSelector } from 'react-redux';
import { selectCurrentEditableStyles } from '@Redux/project/selectors/element';
import { StyledTextField } from '@Components/styledComponents';
import MenuItem from '@material-ui/core/MenuItem';
import { useDebouncedCallback } from 'use-debounce';
import { useColumnControlStyles } from '@Components/RightPanel/PropertiesTab/Controls/Columns/styles';
import { FormControlLabel } from '@material-ui/core';

enum Units {
  px = 'px',
  em = 'em',
  '%' = '%',
}

const parse = (value: string | number | undefined) => {
  let gap;
  let units;
  if (!value) {
    gap = 1;
    units = Units.em;
  } else {
    gap = parseInt(value.toString());
    const matches = value.toString().match(/\d*(\D*)/);
    units = matches ? matches[1] : Units.em;
  }
  return [gap, units];
};

const ColumnGap: React.FC<PropertiesChangeProps<ColumnsElement>> = ({
  updateStyles,
}) => {
  const classes = useColumnControlStyles();
  const value = useSelector(selectCurrentEditableStyles('columnGap'));
  const [gap, units] = parse(value);

  const [gapState, setGapState] = useState(gap);
  useEffect(() => {
    setGapState(gap);
  }, [gap]);
  const [unitsState, setUnitsState] = useState(units);

  const debouncedGap = useDebouncedCallback(
    (value) => updateStyles({ columnGap: `${value}${unitsState}` }),
    250,
  );

  const handleGapChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    const validValue = !value || +value < 0 ? 0 : value;
    setGapState(validValue);
    debouncedGap.callback(validValue);
  };

  const handleUnitsChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    updateStyles({ columnGap: `${gapState}${value}` });
    setUnitsState(value);
  };

  return (
    <FormControlLabel
      classes={{ root: classes.rootLabel, label: classes.label }}
      label="Column Gap"
      labelPlacement="start"
      control={
        <div className={classes.control}>
          <StyledTextField
            value={gapState}
            onChange={handleGapChange}
            margin="dense"
            type="number"
          />

          <StyledTextField
            value={units}
            onChange={handleUnitsChange}
            label="Units"
            margin="dense"
            select
          >
            {Object.keys(Units).map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </StyledTextField>
        </div>
      }
    />
  );
};

export default withConfigurableProperties(ColumnGap);
