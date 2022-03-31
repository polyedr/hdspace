import React, { memo, useCallback, useState, useEffect } from 'react';
import { toState } from 'react-color/lib/helpers';
import { ColorResult } from 'react-color';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import { ColorPicker, normalizeColor, useColor } from '../../../UI/ColorPicker';
import { StyledTextField } from '../../../styledComponents';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    padding: '0.5em 0',
  },
  wrapper: {
    padding: '0 0.5em',
  },
});

type Props = {
  currentColor: string;
  activeElementId: string;
  onChange(color: string): any | void;
  disabled?: boolean;
  labelTextStyle?: string;
  key?: string;
};

const ColorSettings: React.FC<Props> = ({
  currentColor,
  activeElementId,
  onChange,
  disabled,
  labelTextStyle = 'Color',
  key,
}) => {
  const classes = useStyles();
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

  console.log(`currentColor: ${currentColor} ${currentColor.includes('rgba')}`);

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

  return (
    <div key={key}>
      <div className={classes.root}>
        <StyledTextField
          label={labelTextStyle}
          fullWidth
          value={currentBackgroundColor.value}
          onBlur={({ target: { value } }) => handleColorInputBlur(value)}
          onChange={({ target: { value } }) => handleColorChange(value)}
          margin="none"
          disabled={disabled}
        />

        <div className={classes.wrapper}>
          <ColorPicker
            color={currentColor}
            onChangeComplete={handleColorChange}
            disabled={disabled}
          />
        </div>
      </div>
      <FormControlLabel
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
