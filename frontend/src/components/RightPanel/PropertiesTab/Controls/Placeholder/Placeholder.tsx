import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import { selectActiveElementParams } from '@Redux/project/selectors/element';
import { PropertiesChangeProps, TextinputElement } from '@Src/types';
import { AppReduxState } from '@Redux/types';
import { StyledTextField } from '@Components/styledComponents';

const Placeholder: React.FC<PropertiesChangeProps<TextinputElement>> = ({
  updateParams,
}) => {
  const placeholder = useSelector(
    (state: AppReduxState) => selectActiveElementParams(state).placeholder,
  );

  const [state, setState] = useState(placeholder || '');
  useEffect(() => {
    setState(placeholder);
  }, [placeholder]);

  const debounced = useDebouncedCallback((value) => {
    updateParams({ placeholder: value });
  }, 500);

  return (
    <StyledTextField
      value={state}
      onChange={({ target: { value } }) => {
        setState(value);
        debounced.callback(value);
      }}
      margin="dense"
      label="Placeholder"
    />
  );
};

export default Placeholder;
