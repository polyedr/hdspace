import React, { useState, useEffect } from 'react';
import { Checkbox, FormControlLabel, MenuItem, FormLabel } from '@mui/material';
import { useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import {
  ParagraphElement,
  PropertiesChangeProps,
  CONTROLS_NOT_ALLOW_LINK,
} from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import { useDebouncedInputChange } from '@Utils/debounceHooks';
import ELEMENT_IDS from '@Constants/elementIds';
import { selectScreensWithoutMaster } from '@Redux/project/selectors/screen';

const Text: React.FC<PropertiesChangeProps<ParagraphElement>> = ({
  element,
  updateParams,
  canEdit,
}) => {
  const { link, isLink, textContent, screenName, screenLink } =
    element.parameters;

  const elementType: any = element?.type;

  const [state, handleChange] = useDebouncedInputChange(textContent, (value) =>
    updateParams({ textContent: value }),
  );

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
      <StyledTextField
        value={state || ''}
        onChange={handleChange}
        label="Text Content"
        margin="dense"
        fullWidth
        multiline
        disabled={!canEdit}
      />

      {CONTROLS_NOT_ALLOW_LINK.includes(elementType) ? null : (
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
};

export default Text;
