import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { selectActiveElementParams } from '@Redux/project/selectors/element';
import withConfigurableProperties from '@Utils/withConfigurableProperties';
import { AppReduxState } from '@Redux/types';
import {
  PropertiesChangeProps,
  RadiobuttonElement,
} from '../../../../../types';

const Name: React.FC<PropertiesChangeProps<RadiobuttonElement>> = ({
  updateParams,
}) => {
  const name = useSelector(
    (state: AppReduxState) => selectActiveElementParams(state).name,
  );
  const handleTextFieldChange = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateParams({ name: value });
    },
    [updateParams],
  );

  return (
    <TextField
      variant="outlined"
      value={name}
      onChange={handleTextFieldChange}
      label="Name"
      margin="dense"
      fullWidth
      multiline
    />
  );
};

export default withConfigurableProperties(Name);
