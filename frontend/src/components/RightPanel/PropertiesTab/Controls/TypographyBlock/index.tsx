import React, { useCallback, useEffect, useState, memo } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
import * as CSS from 'csstype';
import { getPermissibleValue } from '@Utils/NumberHelper';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import FONTS from '@Constants/fonts';

import {
  StyledTextField,
  StyledToggleButton,
} from '@Components/styledComponents';
import { useDebouncedValueChange } from '@Utils/debounceHooks';
import { MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { selectCurrentProjectDefaultStyles } from '@Redux/project/selectors/base';
import FONT_WEIGHT from '@Constants/fontWeight';
import ColorSettings from '../../helperComponents/ColorSettings';
import RemoveStyles from '../../helperComponents/RemoveStyles';

const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 84;

const MIN_LINE_HEIGHT = 1;
const MAX_LINE_HEIGHT = 1000;

const useStyles = makeStyles({
  rootContainer: {
    padding: '16px',
  },
  lineHeightContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '141px',
  },
  text: {
    width: '62px',
    marginLeft: '24px',
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  fontWeightControl: {
    maxWidth: '141px',
  },
});

type Props = PropertiesChangeProps<LibraryElement<Entity>> & {
  fontFamily?: React.CSSProperties['fontFamily'];
  fontSize?: React.CSSProperties['fontSize'];
  fontWeight?: React.CSSProperties['fontWeight'];
  fontStyle?: React.CSSProperties['fontStyle'];
  textAlign?: React.CSSProperties['textAlign'];
  lineHeight?: React.CSSProperties['lineHeight'];
  color: React.CSSProperties['color'];
  isDefaultStyles?: boolean;
};

const TypographyBlock: React.FC<Props> = ({
  updateStyles,
  removeStyles,
  masterScreenEnabled,
  element,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  textAlign,
  color = 'transparent',
  canEdit,
  editableStyles,
  isDefaultStyles = false,
}) => {
  const defaultStyles = useSelector(selectCurrentProjectDefaultStyles);
  const classes = useStyles();

  const handleFontFamilyChange = (event) => {
    updateStyles({ fontFamily: event.target.value });
  };

  const handleFontWeightChange = (event) => {
    updateStyles({ fontWeight: event.target.value });
  };

  const handleChangeLineHeight = useCallback(
    (value) => {
      const newLineHeight = getPermissibleValue(
        value,
        MIN_LINE_HEIGHT,
        MAX_LINE_HEIGHT,
      );
      updateStyles({ lineHeight: `${newLineHeight}%` });
    },
    [updateStyles],
  );

  const [lineHeightState, setLineHeightState] = useState<
    React.CSSProperties['lineHeight']
  >(lineHeight || '100%');

  useEffect(() => {
    setLineHeightState(lineHeight);
  }, [lineHeight, isDefaultStyles]);

  const handleChangeFontSize = useCallback(
    (value) => {
      const newSize = getPermissibleValue(value, MIN_FONT_SIZE, MAX_FONT_SIZE);

      updateStyles({ fontSize: `${newSize}px` });
    },
    [updateStyles],
  );

  const [fontSizeState, setFontSizeState] = useState<
    React.CSSProperties['fontSize']
  >(fontSize || '14px');

  useEffect(() => {
    setFontSizeState(
      (isDefaultStyles && defaultStyles?.typography?.fontSize) || fontSize,
    );
  }, [fontSize, isDefaultStyles]);

  const debouncedFontSize = useDebouncedCallback((value) => {
    handleChangeFontSize(value);
  }, 500);

  const debouncedLineHeight = useDebouncedCallback((value) => {
    handleChangeLineHeight(value);
  }, 500);

  const handleAlignmentChange = (
    event: React.MouseEvent<HTMLElement>,
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
    <div className={isDefaultStyles ? '' : classes.rootContainer}>
      {!isDefaultStyles && !masterScreenEnabled && canEdit && (
        <RemoveStyles
          type={element.type}
          onClick={removeStyles}
          propsToRemove={[
            'fontFamily',
            'fontStyle',
            'fontWeight',
            'fontSize',
            'textAlign',
            'color',
          ]}
          editableStyles={editableStyles}
        />
      )}

      <div>
        <StyledTextField
          fullWidth
          margin="dense"
          value={
            (isDefaultStyles && defaultStyles?.typography?.fontFamily) ||
            fontFamily ||
            FONTS[0].value
          }
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
            className={classes.fontWeightControl}
            style={isDefaultStyles ? { width: '100px' } : {}}
            fullWidth
            margin="dense"
            value={
              (isDefaultStyles && defaultStyles?.typography?.fontWeight) ||
              fontWeight ||
              FONT_WEIGHT[4].value
            }
            onChange={handleFontWeightChange}
            select
            disabled={!canEdit}
          >
            {FONT_WEIGHT.map(({ label, value }) => (
              <MenuItem value={value} key={value}>
                {label}
              </MenuItem>
            ))}
          </StyledTextField>

          <StyledTextField
            className={classes.text}
            margin="dense"
            type="number"
            value={fontSizeState ? parseInt(fontSizeState.toString()) : 0}
            onChange={(event) => {
              setFontSizeState(event.target.value);
              debouncedFontSize.callback(event.target.value);
            }}
            disabled={!canEdit}
            style={isDefaultStyles ? { marginRight: '10%' } : {}}
          />
        </div>

        {!isDefaultStyles && (
          <div className={classes.wrapper}>
            <div className={classes.lineHeightContainer}>
              <StyledTextField
                fullWidth
                margin="dense"
                type="number"
                value={
                  lineHeightState ? parseInt(lineHeightState.toString()) : 100
                }
                onChange={(event) => {
                  setLineHeightState(event.target.value);
                  debouncedLineHeight.callback(event.target.value);
                }}
                disabled={!canEdit}
              />
              <div style={{ color: '#81818E', fontSize: 12 }}>%</div>
            </div>
          </div>
        )}

        <div
          className={classes.wrapper}
          style={isDefaultStyles ? { justifyContent: 'flex-start' } : {}}
        >
          <div
            style={
              isDefaultStyles
                ? { display: 'flex', flexDirection: 'column' }
                : {}
            }
          >
            <ToggleButtonGroup
              value={
                (isDefaultStyles && defaultStyles?.typography?.textAlign) ||
                textAlign
              }
              onChange={handleAlignmentChange}
              exclusive
              size="small"
              style={isDefaultStyles ? { width: '20px', height: '20px' } : {}}
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
        </div>

        <div>
          <ColorSettings
            currentColor={
              (isDefaultStyles && defaultStyles?.colors?.color) ||
              (colorValue as string) ||
              'transparent'
            }
            activeElementId={element.id}
            onChange={handleColorValueChange as (color: string) => void}
            disabled={!canEdit}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(TypographyBlock);
