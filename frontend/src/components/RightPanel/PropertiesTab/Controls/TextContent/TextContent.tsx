import React from 'react';
import { useSelector } from 'react-redux';
import { selectActiveElementParamByName } from '@Redux/project/selectors/element';
import { ParagraphElement, PropertiesChangeProps } from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import { useDebouncedInputChange } from '@Utils/debounceHooks';

const TextContent: React.FC<PropertiesChangeProps<ParagraphElement>> = ({
  updateParams,
  canEdit,
}) => {
  const content = useSelector(selectActiveElementParamByName('textContent'));

  const [state, handleChange] = useDebouncedInputChange(content, (value) =>
    updateParams({ textContent: value }),
  );

  return (
    <StyledTextField
      value={state || ''}
      variant="outlined"
      onChange={handleChange}
      label="Text Content"
      margin="dense"
      fullWidth
      multiline
      disabled={!canEdit}
    />
  );
};

export default TextContent;
