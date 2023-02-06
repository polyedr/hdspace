import React, { memo, useCallback, useState, useEffect } from 'react';
import { toState } from 'react-color/lib/helpers';
import { ColorResult } from 'react-color';
import { Checkbox, styled, FormControlLabel } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ClearIcon from '@mui/icons-material/Clear';
import { getPermissibleValue } from '@Utils/NumberHelper';
import { ColorPicker, normalizeColor, useColor } from '../../../UI/ColorPicker';
import { StyledTextField } from '../../../styledComponents';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: '0.5em 0',
    flexDirection: 'row',
    position: 'relative',
  },
  wrapper: {
    padding: '0 5px 0 0',
  },
  input: {
    // width: '95px',
  },
  colorPickerBlock: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: 'calc(50% - 10px)',
  },
});

interface Props {
  currentColor: string;
  currentOpacity?: React.CSSProperties['opacity'];
  activeElementId: string;
  onChange: (color: string) => any | void;
  disabled?: boolean;
  labelTextStyle?: string;
  updateStyles?: any;
  propsToRemove?: string[];
  onClick?: (propsToRemove: string[] | undefined) => void;
  isDefaultStyles?: boolean;
}

const CheckedFormControl = styled(FormControlLabel)({
  margin: '10px 0 10px -3px',

  '& .MuiCheckbox-root': {
    padding: 0,
  },
});

const ColorSettings: React.FC<Props> = ({
  propsToRemove,
  onClick,
  currentColor,
  currentOpacity,
  activeElementId,
  onChange,
  disabled,
  labelTextStyle = 'Color',
  updateStyles,
  isDefaultStyles,
}) => {
  const classes = useStyles();
  const [currentOpacityState, setCurrentOpacityState] = useState<
    React.CSSProperties['opacity']
  >(currentOpacity || 1);
  const [currentBackgroundColor, setCurrentBackgroundColor] = useColor(
    currentColor,
    activeElementId,
  );
  const [currentColorObject, setCurrentColorObject] = useState<ColorResult>(
    toState(currentColor),
  );
  const [checked, setChecked] = useState(
    currentBackgroundColor.value.includes('rgba'),
  );

  useEffect(() => {
    if (currentColorObject.rgb.a)
      setCurrentOpacityState(currentColorObject.rgb.a || currentOpacity || 1);
  }, [currentColorObject]);

  const handleChangeOpacity = useCallback(
    (value) => {
      const newOpacity = getPermissibleValue(value, 0, 1);

      updateStyles({ opacity: `${newOpacity}` });
    },
    [updateStyles],
  );

  const formatTextColor = useCallback(
    (isValueCheckBox: boolean) => {
      if (isValueCheckBox) {
        const { r, g, b, a } = currentColorObject.rgb;
        const convertedColor = `rgba(${r}, ${g}, ${b}, ${a})`;
        const normalizedColor = normalizeColor(
          convertedColor,
          currentColorObject,
        );

        setCurrentBackgroundColor(normalizedColor);
        onChange(convertedColor);
        const reactColorObject = toState(convertedColor);
        setCurrentColorObject(reactColorObject);

        return currentBackgroundColor.value;
      }
      const normalizedColor = normalizeColor(
        currentColorObject.hex,
        currentColorObject,
      );
      setCurrentBackgroundColor(normalizedColor);
      onChange(currentColorObject.hex);
      return currentBackgroundColor.value;
    },
    [
      currentBackgroundColor,
      onChange,
      currentColorObject,
      setCurrentBackgroundColor,
    ],
  );

  const handleChange = (event) => {
    setChecked(event.target.checked);
    formatTextColor(event.target.checked);
  };

  useEffect(() => {
    setCurrentColorObject(toState(currentColor));
    setChecked(currentBackgroundColor.value.includes('rgba'));
  }, [currentColor, currentBackgroundColor.value]);

  const handleColorChange = useCallback(
    (color) => {
      if (typeof color === 'object') {
        const normalizedColor = normalizeColor(color, currentColorObject);
        onChange(normalizedColor.value);
        setCurrentBackgroundColor(normalizedColor);
        setCurrentColorObject(color);
      } else {
        const normalizedColor = normalizeColor(color, currentColorObject);
        setCurrentBackgroundColor(normalizedColor);
      }
    },
    [currentColorObject, onChange, setCurrentBackgroundColor],
  );

  const handleColorInputBlur = useCallback(
    (color) => {
      const normalizedColor = normalizeColor(color, currentColorObject);
      const reactColorObject = toState(color);

      setCurrentBackgroundColor(normalizedColor);
      setCurrentColorObject(reactColorObject);

      if (normalizedColor.isValid) {
        onChange(normalizedColor.value);
      }
    },
    [currentColorObject, setCurrentBackgroundColor, onChange],
  );

  const validateOpacity = () => {
    const value = currentOpacityState as unknown as number;
    return value && value <= 1 && value > 0 && !Number.isNaN(value)
      ? value * 100
      : 100;
  };

  const handleRemoveClick = () => {
    if (onClick) onClick(propsToRemove);
  };

  return (
    <div>
      <div className={classes.root}>
        <div className={classes.colorPickerBlock}>
          <div className={classes.wrapper}>
            <ColorPicker
              color={currentBackgroundColor.value}
              onChangeComplete={handleColorChange}
              disabled={disabled}
            />
          </div>
          <StyledTextField
            className={classes.input}
            label={labelTextStyle}
            value={currentBackgroundColor.value}
            onBlur={({ target: { value } }) => handleColorInputBlur(value)}
            onChange={({ target: { value } }) => handleColorChange(value)}
            margin="none"
            disabled={disabled}
          />
        </div>
        <StyledTextField
          className={classes.input}
          style={{ width: 'calc(50% - 10px)', paddingRight: 25 }}
          value={`${validateOpacity()}%`}
          onBlur={({ target: { value } }) => {
            setCurrentOpacityState(parseInt(value) / 100);
            handleChangeOpacity(parseInt(value) / 100);
          }}
          onChange={({ target: { value } }) => {
            setCurrentOpacityState(parseInt(value) / 100);
            handleChangeOpacity(parseInt(value) / 100);
          }}
          margin="none"
          disabled={disabled}
        />
        {!isDefaultStyles && (
          <div
            onClick={handleRemoveClick}
            style={{ position: 'absolute', bottom: 5, right: 0 }}
          >
            <ClearIcon sx={{ width: '16px', color: '#81818E' }} />
          </div>
        )}
      </div>
      <CheckedFormControl
        control={
          <Checkbox
            checked={checked}
            onChange={handleChange}
            name="checkedB"
            color="primary"
          />
        }
        label="Format color RGBA"
      />
    </div>
  );
};

export default memo(ColorSettings);
