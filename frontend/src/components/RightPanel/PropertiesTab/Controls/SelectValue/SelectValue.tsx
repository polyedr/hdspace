import React, { memo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { PropertiesChangeProps, SelectElement } from '@Src/types';
import { AppReduxState } from '@Redux/types';
import {
  selectActiveElementParams,
  selectActiveItemChildren,
} from '@Redux/project/selectors/element';
import { StyledTextField } from '@Components/styledComponents';
import { MenuItem } from '@material-ui/core';

const SelectValue: React.FC<PropertiesChangeProps<SelectElement>> = ({
  updateParams,
  canEdit,
}) => {
  const value = useSelector(
    (state: AppReduxState) => selectActiveElementParams(state).value,
  );

  const options = useSelector(selectActiveItemChildren('option'));
  const optionsValues = options.map((item) => item.parameters.value);

  useEffect(() => {
    const isValueInOptions = optionsValues.some(
      (optionValue) => optionValue === value,
    );

    if (!isValueInOptions && optionsValues.length) {
      updateParams({ value: optionsValues[0] });
    }
  }, [optionsValues]);

  const handleDropdownChange = (ev) => {
    updateParams({ value: ev.target.value });
  };

  return (
    <StyledTextField
      fullWidth
      margin="dense"
      label="Default Value"
      value={value}
      onChange={handleDropdownChange}
      select
      disabled={!canEdit}
    >
      {optionsValues.map((option) => (
        <MenuItem key={option} value={option} dense>
          {option}
        </MenuItem>
      ))}
    </StyledTextField>
  );
};

export default memo(SelectValue);
