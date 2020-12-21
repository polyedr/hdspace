import React, { ChangeEvent } from 'react';
import { ColumnsElement, PropertiesChangeProps } from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import MenuItem from '@material-ui/core/MenuItem';
import { FormControlLabel } from '@material-ui/core';
import { useColumnControlStyles } from '@Components/RightPanel/PropertiesTab/Controls/Columns/styles';

enum Options {
  balance = 'balance',
  auto = 'auto',
}

type Props = {
  updateStyles: PropertiesChangeProps<ColumnsElement>['updateStyles'];
  fill: React.CSSProperties['columnFill'];
};

const ColumnFill: React.FC<Props> = ({ updateStyles, fill }) => {
  const classes = useColumnControlStyles();

  const handleFillChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    updateStyles({ columnFill: value as Options });
  };

  return (
    <FormControlLabel
      classes={{ root: classes.rootLabel, label: classes.label }}
      label="Column Fill"
      labelPlacement="start"
      control={
        <StyledTextField
          value={fill}
          label=" "
          onChange={handleFillChange}
          margin="dense"
          select
        >
          {Object.keys(Options).map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </StyledTextField>
      }
    />
  );
};

export default ColumnFill;
