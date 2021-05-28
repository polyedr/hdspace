import React from 'react';
import { useSelector } from 'react-redux';
import { selectActiveElementParams } from '@Redux/project/selectors/element';
import { AppReduxState } from '@Redux/types';
import { StyledTextField } from '@Components/styledComponents';
import { CheckboxElement, PropertiesChangeProps } from '@Src/types';
import { useDebouncedInputChange } from '@Utils/debounceHooks';

const Name: React.FC<PropertiesChangeProps<CheckboxElement>> = ({
  updateParams,
  canEdit,
}) => {
  const name = useSelector(
    (state: AppReduxState) => selectActiveElementParams(state).name,
  );

  const [state, handleNameChange] = useDebouncedInputChange(
    name || '',
    (value) => {
      updateParams({ name: value });
    },
  );

  return (
    <StyledTextField
      variant="outlined"
      value={state}
      onChange={handleNameChange}
      label="Name"
      margin="dense"
      fullWidth
      multiline
      disabled={!canEdit}
    />
  );
};

export default Name;
