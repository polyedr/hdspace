import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { selectActiveElementParamByName } from '../../../../../redux/project/selectors';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import { ParagraphElement, PropertiesChangeProps } from '../../../../../types';

const TextContent: React.FC<PropertiesChangeProps<ParagraphElement>> = ({
  updateParams,
}) => {
  const content = useSelector(selectActiveElementParamByName('textContent'));
  const handleTextContentChange = useCallback(
    ({ target: { value } }) => {
      updateParams({ textContent: value });
    },
    [updateParams],
  );

  return (
    <TextField
      variant="outlined"
      value={content}
      onChange={handleTextContentChange}
      label="Text Content"
      margin="dense"
      fullWidth
      multiline
    />
  );
};

export default withConfigurableProperties(TextContent);
