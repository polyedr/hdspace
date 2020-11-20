import React from 'react';
import { useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { useDebouncedCallback } from 'use-debounce';
import { selectActiveElementParamByName } from '../../../../../redux/project/selectors';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import { ParagraphElement, PropertiesChangeProps } from '../../../../../types';

const TextContent: React.FC<PropertiesChangeProps<ParagraphElement>> = ({
  updateParams,
}) => {
  const content = useSelector(selectActiveElementParamByName('textContent'));

  const debounced = useDebouncedCallback((value) => {
    updateParams({ textContent: value });
  }, 500);

  return (
    <TextField
      defaultValue={content}
      variant="outlined"
      onChange={(ev) => debounced.callback(ev.target.value)}
      label="Text Content"
      margin="dense"
      fullWidth
      multiline
    />
  );
};

export default withConfigurableProperties(TextContent);
