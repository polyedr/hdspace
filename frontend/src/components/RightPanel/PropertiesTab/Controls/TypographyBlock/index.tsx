import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import MenuItem from '@material-ui/core/MenuItem';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import * as CSS from 'csstype';
import withConfigurableProperties from '@Utils/withConfigurableProperties';
import { getPermissibleValue } from '@Utils/NumberHelper';

import {
  selectActiveElementId,
  selectCurrentEditableStyles,
} from '@Redux/project/selectors/element';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import FONTS from '@Constants/fonts';
import {
  StyledTextField,
  StyledToggleButton,
} from '@Components/styledComponents';
import StylesHeader from '../../helperComponents/StylesHeader';
import ColorSettings from '../../helperComponents/ColorSettings';

const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 84;

const useStyles = makeStyles({
  text: {
    width: 50,
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
});

const TypographyBlock: React.FC<PropertiesChangeProps<
  LibraryElement<Entity>
>> = ({ updateStyles, removeStyles }) => {
  const classes = useStyles();
  const fontFamily = useSelector(selectCurrentEditableStyles('fontFamily'));
  const fontStyle = useSelector(selectCurrentEditableStyles('fontStyle'));
  const fontWeight = useSelector(selectCurrentEditableStyles('fontWeight'));
  const fontSize =
    useSelector(selectCurrentEditableStyles('fontSize')) || '14px';
  const textAlign = useSelector(selectCurrentEditableStyles('textAlign'));
  const color =
    useSelector(selectCurrentEditableStyles('color')) || 'transparent';

  const activeElementId = useSelector(selectActiveElementId);

  const handleColorSettingsChange = useCallback(
    (newColor: string) => {
      updateStyles({ color: newColor });
    },
    [updateStyles],
  );

  const handleFontFamilyChange = (ev) => {
    updateStyles({ fontFamily: ev.target.value });
  };

  const handleChangeFontSize = useCallback(
    (value) => {
      const newSize = getPermissibleValue(value, MIN_FONT_SIZE, MAX_FONT_SIZE);

      updateStyles({ fontSize: `${newSize}px` });
    },
    [updateStyles],
  );

  const [state, setState] = useState(fontSize);
  useEffect(() => {
    setState(fontSize);
  }, [fontSize]);
  const debounced = useDebouncedCallback((value) => {
    handleChangeFontSize(value);
  }, 500);

  const handleFormatChange = (
    ev: React.MouseEvent<HTMLElement>,
    newFormats: string[],
  ) => {
    updateStyles({
      fontStyle: newFormats.includes('italic') ? 'italic' : 'normal',
      fontWeight: newFormats.includes('bold') ? 700 : 400,
    });
  };

  const handleAlignmentChange = (
    ev: React.MouseEvent<HTMLElement>,
    newAlignment: CSS.Property.TextAlign,
  ) => {
    if (!newAlignment) return;
    updateStyles({
      textAlign: newAlignment,
    });
  };

  return (
    <div>
      <StylesHeader
        title="Font"
        onClick={removeStyles}
        cssPropertiesNames={[
          'fontFamily',
          'fontStyle',
          'fontWeight',
          'fontSize',
          'textAlign',
          'color',
        ]}
      />

      <div>
        <StyledTextField
          fullWidth
          margin="dense"
          label="Font Family"
          defaultValue={FONTS[0].value}
          value={fontFamily}
          onChange={handleFontFamilyChange}
          select
        >
          {FONTS.map(({ label, value }) => (
            <MenuItem value={value} key={value} dense>
              {label}
            </MenuItem>
          ))}
        </StyledTextField>

        <div className={classes.wrapper}>
          <StyledTextField
            className={classes.text}
            label="Size"
            margin="dense"
            type="number"
            value={parseInt(state.toString())}
            onChange={(ev) => {
              setState(ev.target.value);
              debounced.callback(ev.target.value);
            }}
          />

          <ToggleButtonGroup
            value={[fontStyle, fontWeight === 700 ? 'bold' : 'normal']}
            onChange={handleFormatChange}
            size="small"
          >
            <StyledToggleButton value="italic">
              <FormatItalicIcon fontSize="small" />
            </StyledToggleButton>

            <StyledToggleButton value="bold">
              <FormatBoldIcon fontSize="small" />
            </StyledToggleButton>
          </ToggleButtonGroup>

          <ToggleButtonGroup
            value={textAlign}
            onChange={handleAlignmentChange}
            exclusive
            size="small"
          >
            <StyledToggleButton value="left">
              <FormatAlignLeftIcon fontSize="small" />
            </StyledToggleButton>

            <StyledToggleButton value="center">
              <FormatAlignCenterIcon fontSize="small" />
            </StyledToggleButton>

            <StyledToggleButton value="right">
              <FormatAlignRightIcon fontSize="small" />
            </StyledToggleButton>
          </ToggleButtonGroup>
        </div>

        <div>
          <ColorSettings
            currentColor={color}
            activeItemID={activeElementId}
            onChange={handleColorSettingsChange}
          />
        </div>
      </div>
    </div>
  );
};

export default withConfigurableProperties(TypographyBlock);
