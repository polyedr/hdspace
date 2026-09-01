import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import { selectActiveElementParamByName } from '@Redux/project/selectors/element';
import { PropertiesChangeProps, SelectElement } from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';

const Value: React.FC<PropertiesChangeProps<SelectElement>> = ({
  updateParams,
  canEdit,
}) => {
  const value = useSelector(selectActiveElementParamByName('value'));

  const [state, setState] = useState(value);
  useEffect(() => {
    setState(value);
  }, [value]);

  const debounced = useDebouncedCallback((value) => {
    updateParams({ value });
  }, 500);

  const handleChange = ({ target: { value } }) => {
    setState(value);
    debounced.callback(value);
  };

  return (
    <StyledTextField
      value={state || ''}
      onChange={handleChange}
      label="Value"
      margin="dense"
      fullWidth
      multiline
      disabled={!canEdit}
    />
  );
};

export default Value;
