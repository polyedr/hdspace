import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useSelector } from 'react-redux';
import { selectCurrentEditableStyles } from '@Redux/project/selectors/element';
import withConfigurableProperties from '@Utils/withConfigurableProperties';
import { ColumnsElement, PropertiesChangeProps } from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import MenuItem from '@material-ui/core/MenuItem';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles({
  control: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    '& > *:first-child': {
      width: 110,
    },
  },
});

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

const ColumnWidth: React.FC<PropertiesChangeProps<ColumnsElement>> = ({
  updateStyles,
}) => {
  const classes = useStyles();
  const value = useSelector(selectCurrentEditableStyles('columnWidth'));

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
    <div className={classes.control}>
      <StyledTextField
        value={widthState || 0}
        onChange={handleWidthChange}
        label="Column Width"
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
  );
};

export default withConfigurableProperties(ColumnWidth);
