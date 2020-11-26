import React from 'react';
import { useSelector } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import withConfigurableProperties from '@Utils/withConfigurableProperties';
import { LabelElement, PropertiesChangeProps } from '@Src/types';
import { selectActiveLabelInputs } from '@Redux/project/selectors/element';
import { StyledTextField } from '@Components/styledComponents';

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
    <StyledTextField
      margin="dense"
      label="Label For"
      defaultValue={labelFor}
      value={labelFor}
      onChange={handleDropdownChange}
      select
    >
      {options.map(({ value, label }) => (
        <MenuItem key={value} value={value} dense>
          {label}
        </MenuItem>
      ))}
    </StyledTextField>
  );
};

export default withConfigurableProperties(LabelFor);
