import React from 'react';
import { useSelector } from 'react-redux';
import { selectActiveElementParams } from '@Redux/project/selectors/element';
import { PropertiesChangeProps, TextinputElement } from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import useDebouncedChange from '@Utils/useDeboucedChange';

const Placeholder: React.FC<PropertiesChangeProps<TextinputElement>> = ({
  updateParams,
  canEdit,
}) => {
  const { placeholder } = useSelector(selectActiveElementParams);

  const [state, handleChange] = useDebouncedChange(
    placeholder || '',
    (value) => {
      updateParams({ placeholder: value });
    },
  );

  return (
    <StyledTextField
      value={state}
      onChange={handleChange}
      margin="dense"
      label="Placeholder"
      disabled={!canEdit}
    />
  );
};

export default Placeholder;
