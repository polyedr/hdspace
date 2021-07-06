import React from 'react';
import { useDebouncedRichInputChange } from '@Utils/debounceHooks';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { StyledTextField } from '@Components/styledComponents';
import { useDebouncedCallback } from 'use-debounce';
import RichTextContent from '../../helperComponents/RichTextContent';

const TextContent = ({ element, updateParams, canEdit }) => {
  const { link, isLink, textContent } = element.parameters;

  const [state, handleChange] = useDebouncedRichInputChange(
    textContent,
    (value) => {
      updateParams({ textContent: value.toString('html') });
    },
  );

  const handleCheckboxChange = (
    listItemID: string,
    { target: { checked } }: React.ChangeEvent<HTMLInputElement>,
  ) => {
    updateParams({ isLink: checked }, listItemID);
  };

  const debouncedLink = useDebouncedCallback((value) => {
    updateParams({ link: value }, element.id);
  }, 500);

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
          defaultValue={link}
          onChange={(ev) => debouncedLink.callback(ev.target.value)}
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
