import React, { useEffect, useCallback, useState } from 'react';
import { SketchPicker, ColorResult } from 'react-color';

type ColorPickerProps = {
  display?: boolean;
  color: string;
  colors?: string[];
  onChangeComplete(color: Pick<ColorResult, 'hex'>): void;
  onClose(): void;
}

export const ColorPicker: React.FC<ColorPickerProps> = React.memo(({
  display = false,
  color,
  onChangeComplete,
  onClose,
}) => {
  const [startColor, setStartColor] = useState({ hex: color });

  const handleKeys = useCallback((event) => {
    if (event.keyCode === 27 && display) {
      onChangeComplete(startColor);
      onClose();
    }
  }, [display, startColor, onChangeComplete, onClose]);

  useEffect(() => {
    if (display) {
      setStartColor({ hex: color });
    }
  }, [display]);

  useEffect(() => {
    window.addEventListener('keyup', handleKeys);

    return () => {
      window.removeEventListener('keyup', handleKeys);
    };
  }, [handleKeys]);

  const handleStopEvent = useCallback((event) => {
    event.stopPropagation();
  }, []);

  const handleClickOverlay = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <>
      <div className="colorPickerContainer-backgroundEmpty"/>
      <div
        className="colorPickerContainer"
        style={{ backgroundColor: color }}
        onClick={onClose}
      >
        {
          display && (
            <div className="colorPicker">
              <div
                className="colorPickerOverlay"
                onClick={handleClickOverlay}
              />
              <div onClick={handleStopEvent}>
                <SketchPicker
                  color={color}
                  onChangeComplete={onChangeComplete}
                />
              </div>
            </div>
          )
        }
      </div>
    </>
  );
});
