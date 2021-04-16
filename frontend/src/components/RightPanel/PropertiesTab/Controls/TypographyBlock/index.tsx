import React, { useCallback, useEffect, useState, memo } from 'react';
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
import { getPermissibleValue } from '@Utils/NumberHelper';

import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import FONTS from '@Constants/fonts';
import {
  StyledTextField,
  StyledToggleButton,
} from '@Components/styledComponents';
import { useDebouncedValueChange } from '@Utils/debounceHooks';
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

type Props = PropertiesChangeProps<LibraryElement<Entity>> & {
  fontFamily?: React.CSSProperties['fontFamily'];
  fontSize?: React.CSSProperties['fontSize'];
  fontWeight?: React.CSSProperties['fontWeight'];
  fontStyle?: React.CSSProperties['fontStyle'];
  textAlign?: React.CSSProperties['textAlign'];
  color: React.CSSProperties['color'];
};

const TypographyBlock: React.FC<Props> = ({
  updateStyles,
  removeStyles,
  masterScreenEnabled,
  activeElementId,
  fontFamily,
  fontSize,
  fontWeight,
  fontStyle,
  textAlign,
  color = 'transparent',
  canEdit,
}) => {
  const classes = useStyles();

  /* const handleColorSettingsChange = useCallback(
    (newColor: string) => {
      updateStyles({ color: newColor });
    },
    [updateStyles],
  ); */

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

  const [state, setState] = useState<React.CSSProperties['fontSize']>(
    fontSize || '14px',
  );
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

  const [colorValue, handleColorValueChange] = useDebouncedValueChange(
    color,
    (newColor: string) => {
      updateStyles({ color: newColor });
    },
  );

  return (
    <div>
      {!masterScreenEnabled && canEdit && (
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
      )}

      <div>
        <StyledTextField
          fullWidth
          margin="dense"
          label="Font Family"
          value={fontFamily || FONTS[0].value}
          onChange={handleFontFamilyChange}
          select
          disabled={!canEdit}
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
            value={state ? parseInt(state.toString()) : 0}
            onChange={(ev) => {
              setState(ev.target.value);
              debounced.callback(ev.target.value);
            }}
            disabled={!canEdit}
          />

          <ToggleButtonGroup
            value={[
              fontStyle,
              fontWeight === 700 || fontWeight === 'bold' ? 'bold' : 'normal',
            ]}
            onChange={handleFormatChange}
            size="small"
          >
            <StyledToggleButton value="italic" disabled={!canEdit}>
              <FormatItalicIcon fontSize="small" />
            </StyledToggleButton>

            <StyledToggleButton value="bold" disabled={!canEdit}>
              <FormatBoldIcon fontSize="small" />
            </StyledToggleButton>
          </ToggleButtonGroup>

          <ToggleButtonGroup
            value={textAlign}
            onChange={handleAlignmentChange}
            exclusive
            size="small"
          >
            <StyledToggleButton value="left" disabled={!canEdit}>
              <FormatAlignLeftIcon fontSize="small" />
            </StyledToggleButton>

            <StyledToggleButton value="center" disabled={!canEdit}>
              <FormatAlignCenterIcon fontSize="small" />
            </StyledToggleButton>

            <StyledToggleButton value="right" disabled={!canEdit}>
              <FormatAlignRightIcon fontSize="small" />
            </StyledToggleButton>
          </ToggleButtonGroup>
        </div>

        <div>
          <ColorSettings
            currentColor={(colorValue as string) || 'transparent'}
            activeElementId={activeElementId}
            onChange={handleColorValueChange as (color: string) => void}
            disabled={!canEdit}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(TypographyBlock);
