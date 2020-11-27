import React, { ChangeEvent } from 'react';
import withConfigurableProperties from '@Utils/withConfigurableProperties';
import { ColumnsElement, PropertiesChangeProps } from '@Src/types';
import { useSelector } from 'react-redux';
import { selectCurrentEditableStyles } from '@Redux/project/selectors/element';
import { StyledTextField } from '@Components/styledComponents';
import MenuItem from '@material-ui/core/MenuItem';

enum Options {
  balance = 'balance',
  auto = 'auto',
}

const ColumnFill: React.FC<PropertiesChangeProps<ColumnsElement>> = ({
  updateStyles,
}) => {
  const fill = useSelector(selectCurrentEditableStyles('columnFill'));

  const handleFillChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    updateStyles({ columnFill: value as Options });
  };

  return (
    <StyledTextField
      value={fill}
      onChange={handleFillChange}
      label="Column Fill"
      margin="dense"
      fullWidth
      select
    >
      {Object.keys(Options).map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </StyledTextField>
  );
};

export default withConfigurableProperties(ColumnFill);
