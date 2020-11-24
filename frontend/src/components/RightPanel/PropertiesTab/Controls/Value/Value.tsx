import React from 'react';
import { useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { selectActiveElementParamByName } from '@Redux/project/selectors/element';
import withConfigurableProperties from '@Utils/withConfigurableProperties';
import { PropertiesChangeProps, SelectElement } from '@Src/types';

const Value: React.FC<PropertiesChangeProps<SelectElement>> = ({
  updateParams,
}) => {
  const value = useSelector(selectActiveElementParamByName('value'));
  const handleTextFieldChange = ({
    target: { value: newValue },
  }: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateParams({ value: newValue });
  };

  return (
    <TextField
      variant="outlined"
      value={value}
      onChange={handleTextFieldChange}
      label="Value"
      margin="dense"
      fullWidth
      multiline
    />
  );
};

export default withConfigurableProperties(Value);
