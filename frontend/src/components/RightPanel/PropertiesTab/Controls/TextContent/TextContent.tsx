import React, { useEffect, useState } from 'react';
import { useDebouncedRichInputChange } from '@Utils/debounceHooks';
import { Checkbox, FormControlLabel, MenuItem, FormLabel } from '@mui/material';
import { StyledTextField } from '@Components/styledComponents';
import { useDebouncedCallback } from 'use-debounce';
import ELEMENT_IDS from '@Constants/elementIds';
import { selectScreensWithoutMaster } from '@Redux/project/selectors/screen';
import { useSelector } from 'react-redux';
import {
  CONTROLS_NOT_ALLOW_LINK,
  CONTROLS_NOT_ALLOW_RICHTEXTBOX,
} from '@Src/types';
import { convertToHTML } from 'draft-convert';
import RichTextContent from '@Components/RightPanel/PropertiesTab/helperComponents/RichTextContent/RichTextContent';

function TextContent({ element, updateParams, canEdit }) {
  const { link, isLink, textContent, screenName, screenLink } =
    element.parameters;
  const [input, setInput] = useState(link);
  const [selectedScreen, selectScreen] = useState(screenName);
  const screens = useSelector(selectScreensWithoutMaster);
  const [isValidURL, setValidURL] = useState(true);

  const debouncedLink = useDebouncedCallback((value) => {
    if (value) {
      const isValidURL =
        value.startsWith('https://') || value.startsWith('http://');
      setValidURL(isValidURL);
      if (isValidURL) {
        updateParams(
          { link: value, screenLink: '', screenName: '' },
          element.id,
        );
      }
    } else {
      setValidURL(true);
    }
  }, 500);

  const debouncedLinkedScreen = useDebouncedCallback((value, screenName) => {
    updateParams(
      { isLink: false, link: '', screenLink: value, screenName },
      element.id,
    );
  }, 500);

  const changeHandler = (ev) => {
    const { value } = ev.target;
    setInput(value);
    debouncedLink.callback(value);
  };

  const setElementScreen = (ev) => {
    const { value } = ev.target;
    if (value === 'noScreen') {
      selectScreen('noScreen');
      debouncedLinkedScreen.callback('', '');
    } else {
      const data = value.toString().split('-');
      const screenIds = data.shift();
      const screenName = data.join('-');
      selectScreen(`${screenIds}-${screenName}`);
      debouncedLinkedScreen.callback(screenIds, screenName);
    }
  };

  const [textContentValue, handleTextContentValueChange] =
    useDebouncedRichInputChange(
      textContent,
      element.id,
      (value, oldElementId) => {
        if (oldElementId === element.id) {
          updateParams(
            {
              textContent: convertToHTML({
                // eslint-disable-next-line consistent-return
                blockToHTML: (block) => {
                  if (block.type === 'unstyled') {
                    if (block.text === ' ' || block.text === '') return <br />;
                    return <div />;
                  }
                },
              })(value.getCurrentContent()),
            },
            element?.id,
          );
        }
      },
    );

  const handleCheckboxChange = (
    textId: string,
    { target: { checked } }: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (checked) {
      updateParams({ isLink: checked, screenLink: '', screenName: '' }, textId);
    } else {
      updateParams(
        { isLink: checked, link: '', screenLink: '', screenName: '' },
        textId,
      );
    }
    selectScreen('noScreen');
  };

  useEffect(() => {
    setInput(link);
  }, [link]);

  useEffect(() => {
    if (screenName && screenLink) {
      const selectdScreen = `${screenLink}-${screenName}`;
      selectScreen(selectdScreen);
    } else {
      selectScreen('noScreen');
    }
  }, [screenName, screenLink]);

  if (element.children && element.children.length) {
    return <span>Text content not allowed</span>;
  }

  return (
    <>
      {CONTROLS_NOT_ALLOW_RICHTEXTBOX.includes(element.type) ? null : (
        <RichTextContent
          handleChange={handleTextContentValueChange}
          textState={textContentValue}
        />
      )}

      {CONTROLS_NOT_ALLOW_LINK.includes(element.type) ? null : (
        <>
          <FormControlLabel
            id={ELEMENT_IDS.link}
            control={
              <Checkbox
                value="make link"
                name="make link"
                checked={isLink || false}
                onChange={(event) => handleCheckboxChange(element.id, event)}
                disabled={!canEdit}
              />
            }
            label="Make Link"
          />

          {isLink && (
            <StyledTextField
              id={ELEMENT_IDS.itemUrl}
              value={input || ''}
              onChange={changeHandler}
              label="Item URL"
              margin="dense"
              placeholder="https://www.google.com"
              fullWidth
              multiline
              disabled={!canEdit}
            />
          )}
          {isLink && !isValidURL && (
            <FormLabel id="error" component="label" error>
              Your link should be start with http:// or https://.
            </FormLabel>
          )}

          {!isLink && (
            <StyledTextField
              margin="dense"
              fullWidth
              label="Link with screen"
              onChange={setElementScreen}
              select
              value={selectedScreen || 'noScreen'}
            >
              <MenuItem value="noScreen" dense>
                Select Screen
              </MenuItem>
              {screens.map((data) => (
                <MenuItem
                  value={`${data?.project}/${data?.id}-${data?.name}`}
                  key={data?.id}
                  dense
                >
                  {data?.name}
                </MenuItem>
              ))}
            </StyledTextField>
          )}
        </>
      )}
    </>
  );
}

export default TextContent;
