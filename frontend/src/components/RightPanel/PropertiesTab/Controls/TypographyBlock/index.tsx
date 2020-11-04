import React, { memo, useCallback } from 'react';
import { connect } from 'react-redux';
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
import { Entity } from '../../../../../domain/core';
import { AppReduxState } from '../../../../../shared/types/app';
import { LibraryElement } from '../../../../../api/types';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../utils/withConfigurableProperties';
import { getPermissibleValue } from '../../../../../utils/NumberHelper';
import FONTS from '../../../../../constants/fonts';
import { selectCurrentEditableStyles } from '../../../../../redux/project/selectors';
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

function mapState(state: AppReduxState) {
  return {
    fontFamily: selectCurrentEditableStyles(state, 'font-family'),
    fontStyle: selectCurrentEditableStyles(state, 'font-style'),
    fontWeight: selectCurrentEditableStyles(state, 'font-weight'),
    fontSize: selectCurrentEditableStyles(state, 'font-size'),
    textAlign: selectCurrentEditableStyles(state, 'text-align'),
    color: selectCurrentEditableStyles(state, 'color'),
  };
}
type Props = ReturnType<typeof mapState> &
  PropertiesChangeProps<LibraryElement<Entity>>;

const TypographyBlock: React.FC<Props> = ({
  fontFamily,
  fontStyle,
  fontWeight,
  fontSize,
  textAlign,
  color,
  updateStyles,
  removeStyles,
  activeItemID,
}) => {
  const classes = useStyles();

  const handleColorSettingsChange = useCallback(
    (newColor: string) => {
      updateStyles({ color: newColor });
    },
    [updateStyles],
  );

  const handleFontFamilyChange = (ev) => {
    updateStyles({ 'font-family': ev.target.value });
  };

  const handleChangeFontSize = useCallback(
    ({ target: { value } }) => {
      const newSize = getPermissibleValue(value, MIN_FONT_SIZE, MAX_FONT_SIZE);

      updateStyles({ 'font-size': `${newSize}px` });
    },
    [updateStyles],
  );

  const handleFormatChange = (
    ev: React.MouseEvent<HTMLElement>,
    newFormats: string[],
  ) => {
    updateStyles({
      'font-style': newFormats.includes('italic') ? 'italic' : 'normal',
      'font-weight': newFormats.includes('bold') ? 700 : 400,
    });
  };

  const handleAlignmentChange = (
    ev: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    if (!newAlignment) return;
    updateStyles({
      'text-align': newAlignment,
    });
  };

  return (
    <div>
      <StylesHeader
        title="Font"
        onClick={removeStyles}
        cssPropertiesNames={[
          'font-family',
          'font-style',
          'font-weight',
          'font-size',
          'text-align',
          'color',
        ]}
      />

      <div>
        <FormControl margin="dense" fullWidth>
          <InputLabel>Font Family</InputLabel>

          <Select
            defaultValue={fontFamily}
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
            value={parseFloat(fontSize)}
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
            activeItemID={activeItemID}
            onChange={handleColorSettingsChange}
          />
        </div>
      </div>
    </div>
  );
};

export default connect(mapState)(
  withConfigurableProperties(memo(TypographyBlock)),
);
