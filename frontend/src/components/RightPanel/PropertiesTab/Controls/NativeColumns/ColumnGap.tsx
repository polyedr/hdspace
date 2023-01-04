import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { FormControlLabel, MenuItem } from '@material-ui/core';
import { ColumnsElement, PropertiesChangeProps } from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import { useColumnControlStyles } from '@Components/RightPanel/PropertiesTab/Controls/NativeColumns/styles';

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

interface Props {
  updateStyles: PropertiesChangeProps<ColumnsElement>['updateStyles'];
  value: React.CSSProperties['columnGap'];
  canEdit: boolean;
}

const ColumnGap: React.FC<Props> = ({ updateStyles, value, canEdit }) => {
  const classes = useColumnControlStyles();
  const [gap, units] = parse(value);

  const [gapState, setGapState] = useState<React.CSSProperties['columnGap']>(
    gap || 0,
  );
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
            disabled={!canEdit}
          />

          <StyledTextField
            value={units}
            onChange={handleUnitsChange}
            label="Units"
            margin="dense"
            select
            disabled={!canEdit}
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

export default ColumnGap;
