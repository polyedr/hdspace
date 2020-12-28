import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { ColumnsElement, PropertiesChangeProps } from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import MenuItem from '@material-ui/core/MenuItem';
import { FormControlLabel } from '@material-ui/core';
import { useColumnControlStyles } from '@Components/RightPanel/PropertiesTab/Controls/Columns/styles';

enum Units {
  auto = 'auto',
  px = 'px',
}

const parse = (value: string | number | undefined) => {
  let width;
  let units;
  if (!value || value === 'auto') {
    width = Units.auto;
    units = Units.auto;
  } else {
    width = parseInt(value.toString());
    units = Units.px;
  }
  return [width, units];
};

type Props = {
  updateStyles: PropertiesChangeProps<ColumnsElement>['updateStyles'];
  value: React.CSSProperties['columnWidth'];
};

const ColumnWidth: React.FC<Props> = ({ updateStyles, value }) => {
  const classes = useColumnControlStyles();

  const [width, units] = parse(value);

  const [widthState, setWidthState] = useState(width);
  useEffect(() => {
    setWidthState(width);
  }, [width]);

  const [unitsState, setUnitsState] = useState(units);

  const debouncedWidth = useDebouncedCallback(
    (value) => updateStyles({ columnWidth: `${value}${unitsState}` }),
    250,
  );

  const handleWidthChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setWidthState(value);
    debouncedWidth.callback(value);
  };

  const handleUnitsChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    const defaultWidth = 200;
    if (value === Units.auto) {
      updateStyles({ columnWidth: Units.auto });
    } else {
      setWidthState(defaultWidth);
      updateStyles({ columnWidth: `${defaultWidth}px` });
    }
    setUnitsState(value);
  };

  return (
    <FormControlLabel
      classes={{ root: classes.rootLabel, label: classes.label }}
      label="Column Width"
      labelPlacement="start"
      control={
        <div className={classes.control}>
          <StyledTextField
            value={widthState || 0}
            onChange={handleWidthChange}
            margin="dense"
            type={unitsState === Units.auto ? 'text' : 'number'}
            disabled={unitsState === Units.auto}
          />

          <StyledTextField
            value={unitsState}
            onChange={handleUnitsChange}
            label="Units"
            margin="dense"
            select
          >
            <MenuItem value="px">px</MenuItem>
            <MenuItem value="auto">auto</MenuItem>
          </StyledTextField>
        </div>
      }
    />
  );
};

export default ColumnWidth;
