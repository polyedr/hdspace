import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { useDebounce } from 'use-debounce';
import { selectActiveElementParams } from '../../../../../redux/project/selectors';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import { PropertiesChangeProps, TextinputElement } from '../../../../../types';
import { AppReduxState } from '../../../../../redux/types';

const Placeholder: React.FC<PropertiesChangeProps<TextinputElement>> = ({
  updateParams,
}) => {
  const placeholder = useSelector(
    (state: AppReduxState) => selectActiveElementParams(state).placeholder,
  );
  const [state, setState] = useState(placeholder);
  const [debouncedState] = useDebounce(state, 500);
  useEffect(() => {
    updateParams({ placeholder: debouncedState });
  }, [debouncedState, updateParams]);

  return (
    <TextField
      value={state}
      onChange={(ev) => setState(ev.target.value)}
      margin="dense"
      label="Placeholder"
    />
  );
};

export default withConfigurableProperties(Placeholder);
