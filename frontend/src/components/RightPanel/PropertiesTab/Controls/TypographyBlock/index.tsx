import React, { useCallback, useEffect, useState, memo } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import * as CSS from 'csstype';
import { getPermissibleValue } from '@Utils/NumberHelper';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import FONTS from '@Constants/fonts';
import {
  StyledTextField,
  StyledToggleButton,
  StyledToggleButtonGroup,
} from '@Components/styledComponents';
import { useDebouncedValueChange } from '@Utils/debounceHooks';
import { MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { selectCurrentProjectDefaultStyles } from '@Redux/project/selectors/base';
import FONT_WEIGHT from '@Constants/fontWeight';
import cn from 'classnames';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import VerticalAlignCenterIcon from '@mui/icons-material/VerticalAlignCenter';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import ColorSettings from '../../helperComponents/ColorSettings';
import RemoveStyles from '../../helperComponents/RemoveStyles';

const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 84;

const MIN_LINE_HEIGHT = 1;
const MAX_LINE_HEIGHT = 1000;

const useStyles = makeStyles({
  rootContainer: {
    padding: '0 16px',
  },
  lineHeightAndLetterSpacing: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  lineHeightContainer: {
    maxWidth: '141px',
  },
  text: {
    width: '80px',
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
  align: {
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  styleText: {
    fontSize: '14px',
    // color: 'rgba(129, 129, 142, 1)',
    // paddingBottom: '2px',
    marginRight: 30,
  },
});

type Props = PropertiesChangeProps<LibraryElement<Entity>> & {
  fontFamily?: React.CSSProperties['fontFamily'];
  fontSize?: React.CSSProperties['fontSize'];
  fontWeight?: React.CSSProperties['fontWeight'];
  // eslint-disable-next-line react/no-unused-prop-types
  fontStyle?: React.CSSProperties['fontStyle'];
  textAlign?: React.CSSProperties['textAlign'];
  lineHeight?: React.CSSProperties['lineHeight'];
  letterSpacing?: React.CSSProperties['letterSpacing'];
  verticalAlign?: React.CSSProperties['verticalAlign'];
  color: React.CSSProperties['color'];
  opacity: React.CSSProperties['opacity'];
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
  letterSpacing,
  textAlign,
  verticalAlign,
  color = 'transparent',
  opacity,
  canEdit,
  editableStyles,
  isDefaultStyles = false,
}) => {
  const defaultStyles = useSelector(selectCurrentProjectDefaultStyles);
  const classes = useStyles();

  const debouncedValueChangeHandler = useDebouncedCallback((value, cb) => {
    cb(value);
  }, 500);

  const handleFontFamilyChange = (event) => {
    updateStyles({ fontFamily: event.target.value });
  };

  const handleFontWeightChange = (event) => {
    updateStyles({ fontWeight: event.target.value });
  };

  const [lineHeightState, setLineHeightState] = useState<
    React.CSSProperties['lineHeight']
  >(lineHeight || '100%');

  const [letterSpacingState, setLetterSpacingState] = useState<
    React.CSSProperties['letterSpacing']
  >(letterSpacing || 1);

  const [fontSizeState, setFontSizeState] = useState<
    React.CSSProperties['fontSize']
  >(fontSize || '14px');

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

  const handleChangeLetterSpacing = useCallback(
    (value) => {
      updateStyles({ letterSpacing: `${value}px` });
    },
    [updateStyles],
  );

  useEffect(() => {
    setLetterSpacingState(letterSpacing);
  }, [letterSpacing]);

  useEffect(() => {
    setLineHeightState(lineHeight);
  }, [lineHeight]);

  const handleChangeFontSize = useCallback(
    (value) => {
      const newSize = getPermissibleValue(value, MIN_FONT_SIZE, MAX_FONT_SIZE);

      updateStyles({ fontSize: `${newSize}px` });
    },
    [updateStyles],
  );

  useEffect(() => {
    setFontSizeState(
      (isDefaultStyles && defaultStyles?.typography?.fontSize) || fontSize,
    );
  }, [fontSize, isDefaultStyles]);

  const handleAlignmentChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: CSS.Property.TextAlign,
  ) => {
    if (!newAlignment) return;
    updateStyles({
      textAlign: newAlignment,
    });
  };
  const handleVerticalAlignmentChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: CSS.Property.VerticalAlign,
  ) => {
    if (!newAlignment) return;
    updateStyles({
      verticalAlign: newAlignment,
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
            style={isDefaultStyles ? { width: 'calc(50% - 10px)' } : {}}
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
            style={isDefaultStyles ? { width: 'calc(50% - 10px)' } : {}}
            margin="dense"
            type="number"
            value={fontSizeState ? parseInt(fontSizeState.toString()) : 0}
            onChange={(event) => {
              setFontSizeState(event.target.value);
              debouncedValueChangeHandler.callback(
                event.target.value,
                handleChangeFontSize,
              );
            }}
            disabled={!canEdit}
            // style={isDefaultStyles ? { marginRight: '10%' } : {}}
          />
        </div>

        {!isDefaultStyles && (
          <div className={classes.wrapper}>
            <div
              className={cn(
                classes.lineHeightContainer,
                classes.lineHeightAndLetterSpacing,
              )}
            >
              <StyledTextField
                fullWidth
                margin="dense"
                type="number"
                value={
                  lineHeightState ? parseInt(lineHeightState.toString()) : 100
                }
                onChange={(event) => {
                  setLineHeightState(event.target.value);
                  debouncedValueChangeHandler.callback(
                    event.target.value,
                    handleChangeLineHeight,
                  );
                }}
                disabled={!canEdit}
              />
              <div style={{ color: '#81818E', fontSize: 12 }}>Line</div>
            </div>
            <div
              className={cn(classes.text, classes.lineHeightAndLetterSpacing)}
            >
              <StyledTextField
                fullWidth
                margin="dense"
                type="number"
                value={
                  letterSpacingState
                    ? parseInt(letterSpacingState.toString())
                    : 5
                }
                onChange={(event) => {
                  setLetterSpacingState(event.target.value);
                  debouncedValueChangeHandler.callback(
                    event.target.value,
                    handleChangeLetterSpacing,
                  );
                }}
                disabled={!canEdit}
              />
              <div style={{ color: '#81818E', fontSize: 12 }}>Character</div>
            </div>
          </div>
        )}

        <div>
          <ColorSettings
            onClick={removeStyles}
            propsToRemove={['color']}
            updateStyles={updateStyles}
            currentOpacity={opacity}
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
        <div className={classes.align} style={{ marginBottom: 12 }}>
          <div className={classes.styleText}>Style</div>
          <div
            className={classes.wrapper}
            style={isDefaultStyles ? { justifyContent: 'flex-start' } : {}}
          >
            <div>
              <StyledToggleButtonGroup
                value={
                  (isDefaultStyles &&
                    defaultStyles?.typography?.verticalAlign) ||
                  verticalAlign
                }
                onChange={handleVerticalAlignmentChange}
                exclusive
                size="small"
                style={isDefaultStyles ? { height: '30px' } : {}}
              >
                <StyledToggleButton value="top" disabled={!canEdit}>
                  <VerticalAlignTopIcon fontSize="small" />
                </StyledToggleButton>

                <StyledToggleButton value="middle" disabled={!canEdit}>
                  <VerticalAlignCenterIcon fontSize="small" />
                </StyledToggleButton>

                <StyledToggleButton value="bottom" disabled={!canEdit}>
                  <VerticalAlignBottomIcon fontSize="small" />
                </StyledToggleButton>
              </StyledToggleButtonGroup>
            </div>
          </div>
        </div>
        <div className={classes.align}>
          <div className={classes.styleText}>Align</div>
          <div
            className={classes.wrapper}
            style={isDefaultStyles ? { justifyContent: 'flex-start' } : {}}
          >
            <div>
              <StyledToggleButtonGroup
                value={
                  (isDefaultStyles && defaultStyles?.typography?.textAlign) ||
                  textAlign
                }
                onChange={handleAlignmentChange}
                exclusive
                size="small"
                style={isDefaultStyles ? { height: '30px' } : {}}
              >
                <StyledToggleButton value="left" disabled={!canEdit}>
                  <FormatAlignLeftIcon fontSize="small" />
                </StyledToggleButton>

                <StyledToggleButton value="center" disabled={!canEdit}>
                  <FormatAlignCenterIcon fontSize="small" />
                </StyledToggleButton>

                <StyledToggleButton value="justify" disabled={!canEdit}>
                  <FormatAlignJustifyIcon fontSize="small" />
                </StyledToggleButton>

                <StyledToggleButton value="right" disabled={!canEdit}>
                  <FormatAlignRightIcon fontSize="small" />
                </StyledToggleButton>
              </StyledToggleButtonGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(TypographyBlock);
