import React, { ChangeEvent } from 'react';
import { FormControlLabel, MenuItem } from '@mui/material';
import { ColumnsElement, PropertiesChangeProps } from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import { useColumnControlStyles } from '@Components/RightPanel/PropertiesTab/Controls/NativeColumns/styles';

enum Options {
  balance = 'balance',
  auto = 'auto',
}

interface Props {
  updateStyles: PropertiesChangeProps<ColumnsElement>['updateStyles'];
  fill: React.CSSProperties['columnFill'];
  canEdit: boolean;
}

const ColumnFill: React.FC<Props> = ({ updateStyles, fill, canEdit }) => {
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
        <div className={classes.control}>
          <StyledTextField
            value={fill}
            label=" "
            onChange={handleFillChange}
            margin="dense"
            select
            disabled={!canEdit}
          >
            {Object.keys(Options).map((option) => (
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

export default ColumnFill;
