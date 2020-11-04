import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';
import { FormControl } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { SelectElement } from '../../../../../api/types';
import { AppReduxState } from '../../../../../shared/types/app';
import {
  selectActiveItemChildren,
  selectActiveElementParams,
  selectElementById,
} from '../../../../../redux/project/selectors';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../utils/withConfigurableProperties';

type StateProps = {
  value: string;
  optionsValues: string[];
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectActiveElementParams(state);
  const { value } = activeItemParams;
  const [selectMenu] = selectActiveItemChildren(state, 'selectMenu');
  if (!selectMenu?.children) {
    return {
      value,
      optionsValues: [],
    };
  }
  const optionsValues = selectMenu.children.map(
    (childId) => selectElementById(childId)(state).parameters.value || '',
  );

  return {
    value,
    optionsValues,
  };
}
type Props = StateProps & PropertiesChangeProps<SelectElement>;

const SelectValue: React.FC<Props> = (props) => {
  const { value, optionsValues = [], updateParams } = props;

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
    <FormControl fullWidth margin="dense">
      <InputLabel>Default Value</InputLabel>

      <Select
        label="Default Value"
        defaultValue={value}
        value={value}
        onChange={handleDropdownChange}
      >
        {optionsValues.map((option) => (
          <MenuItem key={option} value={option} dense>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default connect(mapState)(withConfigurableProperties(memo(SelectValue)));
