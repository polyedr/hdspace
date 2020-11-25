import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import { selectActiveElementParams } from '../../../../../redux/project/selectors';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import {
  PropertiesChangeProps,
  RadiobuttonElement,
} from '../../../../../types';
import { AppReduxState } from '../../../../../redux/types';
import { StyledTextField } from '../../../../styledComponents';

const Name: React.FC<PropertiesChangeProps<RadiobuttonElement>> = ({
  updateParams,
}) => {
  const name = useSelector(
    (state: AppReduxState) => selectActiveElementParams(state).name,
  );
  const [state, setState] = useState(name);
  useEffect(() => {
    setState(name);
  }, [name]);
  const debounced = useDebouncedCallback((value) => {
    updateParams({ name: value });
  }, 500);

  return (
    <StyledTextField
      variant="outlined"
      value={state}
      onChange={({ target: { value } }) => {
        setState(value);
        debounced.callback(value);
      }}
      label="Name"
      margin="dense"
      fullWidth
      multiline
    />
  );
};

export default withConfigurableProperties(Name);
