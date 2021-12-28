import React, { useEffect, useState } from 'react';
import { useDebouncedRichInputChange } from '@Utils/debounceHooks';
import { Checkbox, FormControlLabel, MenuItem } from '@material-ui/core';
import { StyledTextField } from '@Components/styledComponents';
import { useDebouncedCallback } from 'use-debounce';
import ELEMENT_IDS from '@Constants/elementIds';
import { selectScreensWithoutMaster } from '@Redux/project/selectors/screen';
import { useSelector } from 'react-redux';
import { CONTROLS_NOT_ALLOW_LINK } from '@Src/types';
import RichTextContent from '../../helperComponents/RichTextContent';

const TextContent = ({ element, updateParams, canEdit }) => {
  const {
    link,
    isLink,
    textContent,
    screenName,
    screenLink,
  } = element.parameters;
  const [input, setInput] = useState(link);
  const [selectedScreen, selectScreen] = useState(screenName);
  const screens = useSelector(selectScreensWithoutMaster);
  const debouncedLink = useDebouncedCallback((value) => {
    updateParams({ link: value, screenLink: '', screenName: '' }, element.id);
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
      selectScreen(`${data[0]}-${data[1]}`);
      debouncedLinkedScreen.callback(data[0], data[1]);
    }
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
    updateParams({ isLink: checked, screenLink: '', screenName: '' }, textId);
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
      <RichTextContent
        canEdit={canEdit}
        state={state}
        handleChange={handleChange}
      />

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
              fullWidth
              multiline
              disabled={!canEdit}
            />
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

export default TextContent;
