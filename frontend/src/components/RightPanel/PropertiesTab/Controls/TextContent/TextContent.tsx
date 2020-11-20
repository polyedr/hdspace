import React, { useEffect, useState } from 'react';
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

  const [state, setState] = useState(content);
  useEffect(() => {
    setState(content);
  }, [content]);

  const debounced = useDebouncedCallback((value) => {
    updateParams({ textContent: value });
  }, 500);

  const handleChange = ({ target: { value } }) => {
    setState(value);
    debounced.callback(value);
  };

  return (
    <TextField
      value={state}
      variant="outlined"
      onChange={handleChange}
      label="Text Content"
      margin="dense"
      fullWidth
      multiline
    />
  );
};

export default withConfigurableProperties(TextContent);
