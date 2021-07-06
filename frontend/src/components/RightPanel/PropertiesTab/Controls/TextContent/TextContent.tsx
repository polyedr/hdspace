import React from 'react';
import { useDebouncedRichInputChange } from '@Utils/debounceHooks';
import RichTextContent from '../../helperComponents/RichTextContent';

const TextContent = ({ element, updateParams, canEdit }) => {
  const { textContent } = element.parameters;

  const [state, handleChange] = useDebouncedRichInputChange(
    textContent,
    (value) => {
      updateParams({ textContent: value.toString('html') });
    },
  );

  if (element.children && element.children.length) {
    return <span>Text content not allowed</span>;
  }

  return (
    <RichTextContent
      canEdit={canEdit}
      state={state}
      handleChange={handleChange}
    />
  );
};

export default TextContent;
