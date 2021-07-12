import React, { useEffect, useState } from 'react';
import { useDebouncedRichInputChange } from '@Utils/debounceHooks';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { StyledTextField } from '@Components/styledComponents';
import { useDebouncedCallback } from 'use-debounce';
import RichTextContent from '../../helperComponents/RichTextContent';

const TextContent = ({ element, updateParams, canEdit }) => {
  const { link, isLink, textContent } = element.parameters;
  const [input, setInput] = useState(link);

  const debouncedLink = useDebouncedCallback((value) => {
    updateParams({ link: value }, element.id);
  }, 500);

  const changeHandler = (ev) => {
    const { value } = ev.target;
    setInput(value);
    debouncedLink.callback(value);
  };

  const [state, handleChange] = useDebouncedRichInputChange(
    textContent,
    (value) => {
      updateParams({ textContent: value.toString('html') });
    },
  );

  const handleCheckboxChange = (
    textId: string,
    { target: { checked } }: React.ChangeEvent<HTMLInputElement>,
  ) => {
    updateParams({ isLink: checked }, textId);
  };

  useEffect(() => {
    setInput(link);
  }, [link]);

  if (element.children && element.children.length) {
    return <span>Text content not allowed</span>;
  }

  return (
    <>
      <RichTextContent
        canEdit={canEdit}
        state={state}
        handleChange={handleChange}
      />
      <FormControlLabel
        control={
          <Checkbox
            value="make link"
            name="make link"
            checked={isLink}
            onChange={(event) => handleCheckboxChange(element.id, event)}
            disabled={!canEdit}
          />
        }
        label="Make Link"
      />

      {isLink && (
        <StyledTextField
          value={input || ''}
          onChange={changeHandler}
          label="Item URL"
          margin="dense"
          fullWidth
          multiline
          disabled={!canEdit}
        />
      )}
    </>
  );
};

export default TextContent;
