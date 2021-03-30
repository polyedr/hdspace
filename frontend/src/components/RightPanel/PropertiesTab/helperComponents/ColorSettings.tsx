import React, { memo, useCallback, useState, useEffect } from 'react';
import { toState } from 'react-color/lib/helpers';
import { ColorResult } from 'react-color';
import makeStyles from '@material-ui/core/styles/makeStyles';
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
  onChange(color: string): any;
  disabled?: boolean;
};

const ColorSettings: React.FC<Props> = ({
  currentColor,
  activeElementId,
  onChange,
  disabled,
}) => {
  const classes = useStyles();
  const [currentBackgroundColor, setCurrentBackgroundColor] = useColor(
    currentColor,
    activeElementId,
  );
  const [currentColorObject, setCurrentColorObject] = useState<ColorResult>(
    toState(currentColor),
  );

  useEffect(() => {
    setCurrentColorObject(toState(currentColor));
  }, [currentColor]);

  const handleColorChange = useCallback(
    (color) => {
      if (typeof color === 'object') {
        const normalizedColor = normalizeColor(color, currentColorObject, true);
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
      const normalizedColor = normalizeColor(color, currentColorObject, true);
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
    <div className={classes.root}>
      <StyledTextField
        label="Color"
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
        />
      </div>
    </div>
  );
};

export default memo(ColorSettings);
