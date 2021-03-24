import React from 'react';
import { useSelector } from 'react-redux';
import { selectActiveElementParamByName } from '@Redux/project/selectors/element';
import { ParagraphElement, PropertiesChangeProps } from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import useDebouncedChange from '@Utils/useDeboucedChange';

const TextContent: React.FC<PropertiesChangeProps<ParagraphElement>> = ({
  updateParams,
}) => {
  const content = useSelector(selectActiveElementParamByName('textContent'));

  const { state, handleChange } = useDebouncedChange(content, (value) =>
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
    />
  );
};

export default TextContent;
