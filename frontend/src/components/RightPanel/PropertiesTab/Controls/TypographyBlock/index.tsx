import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import * as CSS from 'csstype';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import { getPermissibleValue } from '../../../../../utils/NumberHelper';
import FONTS from '../../../../../constants/fonts';
import {
  selectActiveElementId,
  selectCurrentEditableStyles,
} from '../../../../../redux/project/selectors';
import StylesHeader from '../../helperComponents/StylesHeader';
import ColorSettings from '../../helperComponents/ColorSettings';
import {
  Entity,
  LibraryElement,
  PropertiesChangeProps,
} from '../../../../../types';

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
  const fontFamily = useSelector(selectCurrentEditableStyles('fontFamily'));
  const fontStyle = useSelector(selectCurrentEditableStyles('fontStyle'));
  const fontWeight = useSelector(selectCurrentEditableStyles('fontWeight'));
  const fontSize = useSelector(selectCurrentEditableStyles('fontSize'));
  const textAlign = useSelector(selectCurrentEditableStyles('textAlign'));
  const color =
    useSelector(selectCurrentEditableStyles('color')) || 'transparent';
  const classes = useStyles();

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
    ({ target: { value } }) => {
      const newSize = getPermissibleValue(value, MIN_FONT_SIZE, MAX_FONT_SIZE);

      updateStyles({ fontSize: `${newSize}px` });
    },
    [updateStyles],
  );

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
        <FormControl margin="dense" fullWidth>
          <InputLabel>Font Family</InputLabel>

          <Select
            defaultValue={FONTS[0].value}
            value={fontFamily}
            onChange={handleFontFamilyChange}
          >
            {FONTS.map(({ label, value }) => (
              <MenuItem value={value} key={value} dense>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className={classes.wrapper}>
          <TextField
            className={classes.text}
            label="Size"
            margin="dense"
            type="number"
            value={fontSize || 14}
            onChange={handleChangeFontSize}
          />

          <ToggleButtonGroup
            value={[fontStyle, fontWeight === 700 ? 'bold' : 'normal']}
            onChange={handleFormatChange}
            size="small"
          >
            <ToggleButton value="italic">
              <FormatItalicIcon fontSize="small" />
            </ToggleButton>

            <ToggleButton value="bold">
              <FormatBoldIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>

          <ToggleButtonGroup
            value={textAlign}
            onChange={handleAlignmentChange}
            exclusive
            size="small"
          >
            <ToggleButton value="left">
              <FormatAlignLeftIcon fontSize="small" />
            </ToggleButton>

            <ToggleButton value="center">
              <FormatAlignCenterIcon fontSize="small" />
            </ToggleButton>

            <ToggleButton value="right">
              <FormatAlignRightIcon fontSize="small" />
            </ToggleButton>
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
