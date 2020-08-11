import React, { memo, useCallback, useState, useEffect } from 'react';
import cn from 'classnames';
import { toState } from 'react-color/lib/helpers';
import { ColorResult } from 'react-color';

import {
  ColorPicker,
  useColor,
  normalizeColor,
} from '$components/UI/ColorPicker/';

type Props = {
  currentColor: string;
  activeItemID: string;
  onChange(color: string): any;
};

const ColorSettings: React.FC<Props> = memo(
  ({ currentColor, activeItemID, onChange }) => {
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
          const normalizedColor = normalizeColor(
            color,
            currentColorObject,
            true,
          );
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
      <>
        <ColorPicker
          color={currentColor}
          onChangeComplete={handleColorChange}
        />
        <input
          className={cn('colorField', {
            inputWithError: !currentBackgroundColor.isValid,
          })}
          type="text"
          value={currentBackgroundColor.value}
          onBlur={({ target: { value } }) => handleColorInputBlur(value)}
          onChange={({ target: { value } }) => handleColorChange(value)}
        />
      </>
    );
  },
);

export { ColorSettings };
