import React, { memo, useCallback, useState, useEffect } from 'react';
import { toState } from 'react-color/lib/helpers';
import { ColorResult } from 'react-color';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import {
  ColorPicker,
  normalizeColor,
  useColor,
} from '../../../../../components/UI/ColorPicker';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    padding: '0.5em 0',
  },
  text: {
    width: 100,
  },
});

type Props = {
  currentColor: string;
  activeItemID: string;
  onChange(color: string): any;
};

const ColorSettings: React.FC<Props> = ({
  currentColor,
  activeItemID,
  onChange,
}) => {
  const classes = useStyles();
  const [currentBackgroundColor, setCurrentBackgroundColor] = useColor(
    currentColor,
    activeItemID,
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
    [onChange, currentColorObject],
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
    [onChange, currentColorObject],
  );

  return (
    <div className={classes.root}>
      <TextField
        label="Color"
        className={classes.text}
        value={currentBackgroundColor.value}
        onBlur={({ target: { value } }) => handleColorInputBlur(value)}
        onChange={({ target: { value } }) => handleColorChange(value)}
        margin="dense"
      />

      <ColorPicker color={currentColor} onChangeComplete={handleColorChange} />
    </div>
  );
};

export default memo(ColorSettings);
