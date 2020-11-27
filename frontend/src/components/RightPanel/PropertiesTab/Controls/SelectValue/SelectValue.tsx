import React, { memo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import withConfigurableProperties from '@Utils/withConfigurableProperties';
import { PropertiesChangeProps, SelectElement, StateElement } from '@Src/types';
import { AppReduxState } from '@Redux/types';
import {
  selectActiveElementParams,
  selectActiveItemChildren,
  selectElementsByIds,
} from '@Redux/project/selectors/element';
import { StyledTextField } from '@Components/styledComponents';

const SelectValue: React.FC<PropertiesChangeProps<SelectElement>> = ({
  updateParams,
}) => {
  const value = useSelector(
    (state: AppReduxState) => selectActiveElementParams(state).value,
  );

  const optionsValues = useSelector((state: AppReduxState) => {
    const [selectMenu] = selectActiveItemChildren('selectMenu')(state);
    if (!selectMenu?.children) {
      return [];
    }
    return selectElementsByIds(selectMenu?.children)(state).map(
      (child: StateElement) => child.parameters.value,
    );
  });

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
      defaultValue={value}
      value={value}
      onChange={handleDropdownChange}
      select
    >
      {optionsValues.map((option) => (
        <MenuItem key={option} value={option} dense>
          {option}
        </MenuItem>
      ))}
    </StyledTextField>
  );
};

export default withConfigurableProperties(memo(SelectValue));
