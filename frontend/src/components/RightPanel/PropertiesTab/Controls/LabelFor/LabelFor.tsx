import React from 'react';
import { useSelector } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { selectActiveLabelInputs } from '../../../../../redux/project/selectors';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import { LabelElement, PropertiesChangeProps } from '../../../../../types';

const LabelFor: React.FC<PropertiesChangeProps<LabelElement>> = ({
  updateParams,
}) => {
  const { inputsIDs, labelFor } = useSelector(selectActiveLabelInputs);

  const options = [
    { label: 'No for attribute', value: 'no for attribute' },
    ...inputsIDs.map((id) => ({ label: id, value: id })),
  ];

  const handleDropdownChange = (ev) => {
    updateParams({ labelFor: ev.target.value });
  };

  return (
    <FormControl margin="dense">
      <InputLabel>Label For</InputLabel>

      <Select
        defaultValue={labelFor}
        value={labelFor}
        onChange={handleDropdownChange}
      >
        {options.map(({ value, label }) => (
          <MenuItem key={value} value={value} dense>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default withConfigurableProperties(LabelFor);
