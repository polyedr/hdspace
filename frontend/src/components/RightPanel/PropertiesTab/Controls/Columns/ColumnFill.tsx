import React, { ChangeEvent } from 'react';
import withConfigurableProperties from '@Utils/withConfigurableProperties';
import { ColumnsElement, PropertiesChangeProps } from '@Src/types';
import { useSelector } from 'react-redux';
import { selectCurrentEditableStyles } from '@Redux/project/selectors/element';
import { StyledTextField } from '@Components/styledComponents';
import MenuItem from '@material-ui/core/MenuItem';
import { FormControlLabel } from '@material-ui/core';
import { useColumnControlStyles } from '@Components/RightPanel/PropertiesTab/Controls/Columns/styles';

enum Options {
  balance = 'balance',
  auto = 'auto',
}

const ColumnFill: React.FC<PropertiesChangeProps<ColumnsElement>> = ({
  updateStyles,
}) => {
  const classes = useColumnControlStyles();
  const fill = useSelector(selectCurrentEditableStyles('columnFill'));

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

export default withConfigurableProperties(ColumnFill);
