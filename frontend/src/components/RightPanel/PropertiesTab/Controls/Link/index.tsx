import React from 'react';
import { ParagraphElement, PropertiesChangeProps } from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import { useDebouncedInputChange } from '@Utils/debounceHooks';

const LinkContent: React.FC<PropertiesChangeProps<ParagraphElement>> = ({
  element,
  updateParams,
  canEdit,
}) => {
  const { textContent } = element.parameters;

  const [state, handleChange] = useDebouncedInputChange(textContent, (value) =>
    updateParams({ textContent: value }),
  );

  if (element.children && element.children.length) {
    return <span>Text content not allowed</span>;
  }

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

export default LinkContent;
