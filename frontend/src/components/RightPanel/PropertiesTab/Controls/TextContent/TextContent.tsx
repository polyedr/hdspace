import React from 'react';
import { useSelector } from 'react-redux';
import { selectElementById } from '@Redux/project/selectors/element';
import { ParagraphElement, PropertiesChangeProps } from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import useDebouncedChange from '@Utils/useDeboucedChange';

const TextContent: React.FC<PropertiesChangeProps<ParagraphElement>> = ({
  activeElementId,
  updateParams,
  canEdit,
}) => {
  const element = useSelector(selectElementById(activeElementId));

  const { textContent } = element.parameters;

  const [state, handleChange] = useDebouncedChange(textContent, (value) =>
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

export default TextContent;
