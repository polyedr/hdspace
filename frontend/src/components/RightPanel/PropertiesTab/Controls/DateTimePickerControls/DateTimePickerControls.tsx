import React, { useCallback } from 'react';
import { MenuItem } from '@mui/material';
import { useSelector } from 'react-redux';
import {
  DateTimePickerElement,
  DateTimePickerType,
  PropertiesChangeProps,
} from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import {
  selectActiveElementParamByName,
  selectActiveElementParams,
} from '@Redux/project/selectors/element';

type Props = PropertiesChangeProps<DateTimePickerElement>;

const DateTimePickerControls: React.FC<Props> = ({ updateParams, canEdit }) => {
  const { type } = useSelector(selectActiveElementParams);
  const label = useSelector(selectActiveElementParamByName('label'));

  const handleChangeType = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const type = e.target.value as DateTimePickerType;
      updateParams({ type });
    },
    [],
  );

  const handleChangeLabel = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateParams({ label: e.target.value });
    },
    [],
  );

  return (
    <>
      <StyledTextField
        onChange={handleChangeLabel}
        label="Label"
        value={label}
        margin="dense"
        fullWidth
        multiline
        disabled={!canEdit}
      />
      <StyledTextField
        value={type}
        onChange={handleChangeType}
        label="Picker Type"
        margin="dense"
        fullWidth
        multiline
        disabled={!canEdit}
        select
      >
        {Object.values(DateTimePickerType).map((t) => (
          <MenuItem value={t} key={t} dense>
            {t}
          </MenuItem>
        ))}
      </StyledTextField>
    </>
  );
};

export default DateTimePickerControls;
