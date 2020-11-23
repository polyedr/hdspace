import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { useDebouncedCallback } from 'use-debounce';
import { selectActiveElementParamByName } from '../../../../../redux/project/selectors';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import { PropertiesChangeProps, SelectElement } from '../../../../../types';

const Value: React.FC<PropertiesChangeProps<SelectElement>> = ({
  updateParams,
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
    <TextField
      variant="outlined"
      value={state}
      onChange={handleChange}
      label="Value"
      margin="dense"
      fullWidth
      multiline
    />
  );
};

export default withConfigurableProperties(Value);
