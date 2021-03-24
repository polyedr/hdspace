import React from 'react';
import { useSelector } from 'react-redux';
import { selectActiveElementParams } from '@Redux/project/selectors/element';
import { AppReduxState } from '@Redux/types';
import { StyledTextField } from '@Components/styledComponents';
import { PropertiesChangeProps, RadiobuttonElement } from '@Src/types';
import useDebouncedChange from '@Utils/useDeboucedChange';

const Name: React.FC<PropertiesChangeProps<RadiobuttonElement>> = ({
  updateParams,
}) => {
  const name = useSelector(
    (state: AppReduxState) => selectActiveElementParams(state).name,
  );

  const [state, handleNameChange] = useDebouncedChange(name || '', (value) => {
    updateParams({ name: value });
  });

  return (
    <StyledTextField
      variant="outlined"
      value={state}
      onChange={handleNameChange}
      label="Name"
      margin="dense"
      fullWidth
      multiline
    />
  );
};

export default Name;
