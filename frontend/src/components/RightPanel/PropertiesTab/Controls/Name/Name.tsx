import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { useDebounce } from 'use-debounce';
import { selectActiveElementParams } from '../../../../../redux/project/selectors';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import {
  PropertiesChangeProps,
  RadiobuttonElement,
} from '../../../../../types';
import { AppReduxState } from '../../../../../redux/types';

const Name: React.FC<PropertiesChangeProps<RadiobuttonElement>> = ({
  updateParams,
}) => {
  const name = useSelector(
    (state: AppReduxState) => selectActiveElementParams(state).name,
  );
  const [state, setState] = useState(name);
  const [debouncedState] = useDebounce(state, 500);
  useEffect(() => {
    updateParams({ name: debouncedState });
  }, [debouncedState, updateParams]);

  return (
    <TextField
      variant="outlined"
      value={state}
      onChange={(ev) => setState(ev.target.value)}
      label="Name"
      margin="dense"
      fullWidth
      multiline
    />
  );
};

export default withConfigurableProperties(Name);
