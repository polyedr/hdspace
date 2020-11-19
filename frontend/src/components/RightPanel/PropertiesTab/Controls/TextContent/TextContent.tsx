import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { useDebounce } from 'use-debounce';
import { selectActiveElementParamByName } from '../../../../../redux/project/selectors';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import { ParagraphElement, PropertiesChangeProps } from '../../../../../types';

const TextContent: React.FC<PropertiesChangeProps<ParagraphElement>> = ({
  updateParams,
}) => {
  const content = useSelector(selectActiveElementParamByName('textContent'));
  const [text, setText] = useState(content);

  const [debouncedText] = useDebounce(text, 1000);

  useEffect(() => {
    updateParams({ textContent: debouncedText });
  }, [debouncedText, updateParams]);

  return (
    <TextField
      variant="outlined"
      value={text}
      onChange={(e) => setText(e.target.value)}
      label="Text Content"
      margin="dense"
      fullWidth
      multiline
    />
  );
};

export default withConfigurableProperties(TextContent);
