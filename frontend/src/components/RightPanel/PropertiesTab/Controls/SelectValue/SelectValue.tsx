/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { MenuItem } from '@mui/material';
import { PropertiesChangeProps, SelectElement } from '@Src/types';
import {
  selectActiveElementChildren,
  selectActiveElementParams,
} from '@Redux/project/selectors/element';
import { StyledTextField } from '@Components/styledComponents';

const SelectValue: React.FC<PropertiesChangeProps<SelectElement>> = ({
  updateParams,
  canEdit,
}) => {
  const { value } = useSelector(selectActiveElementParams);
  const children = useSelector(selectActiveElementChildren);
  const childrenValues = children.map((item) => item.parameters.value);

  useEffect(() => {
    const isValueInChildren = childrenValues.some(
      (childValue) => childValue === value,
    );

    if (!isValueInChildren && childrenValues.length) {
      updateParams({ value: childrenValues[0] });
    }
  }, [childrenValues]);

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
      {childrenValues.map((child) => (
        <MenuItem key={child} value={child} dense>
          {child}
        </MenuItem>
      ))}
    </StyledTextField>
  );
};

export default memo(SelectValue);
