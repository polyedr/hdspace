import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { selectActiveElementParams } from '@Redux/project/selectors/element';
import withConfigurableProperties from '@Utils/withConfigurableProperties';
import { PropertiesChangeProps, TextinputElement } from '@Src/types';
import { AppReduxState } from '@Redux/types';

const Placeholder: React.FC<PropertiesChangeProps<TextinputElement>> = ({
  updateParams,
}) => {
  const placeholder = useSelector(
    (state: AppReduxState) => selectActiveElementParams(state).placeholder,
  );
  const handlePlaceholderChange = useCallback(
    ({ target: { value } }) => {
      updateParams({ placeholder: value });
    },
    [updateParams],
  );

  return (
    <TextField
      value={placeholder}
      onChange={handlePlaceholderChange}
      margin="dense"
      label="Placeholder"
    />
  );
};

export default withConfigurableProperties(Placeholder);
