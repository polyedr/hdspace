import React, { useEffect, useCallback, useState } from 'react';
import { SketchPicker, ColorResult } from 'react-color';
import Popover from 'react-tiny-popover';
import cn from 'classnames';

const styles = require('./styles.scss');

type ColorPickerProps = {
  color: string;
  colors?: string[];
  onChangeComplete(color: Pick<ColorResult, 'hex'>): void;
}

export const ColorPicker: React.FC<ColorPickerProps> = React.memo(({
  color,
  onChangeComplete,
}) => {
  const [startColor, setStartColor] = useState({ hex: color });
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  const handleKeys = useCallback((event) => {
    if (event.keyCode === 27 && isPopoverOpen) {
      setIsPopoverOpen(false)
      onChangeComplete(startColor);
    }
  }, [startColor, onChangeComplete, isPopoverOpen, setIsPopoverOpen]);

  useEffect(() => {
    if (isPopoverOpen) {
      setStartColor({ hex: color });
    }
  }, [isPopoverOpen]);

  useEffect(() => {
    window.addEventListener('keyup', handleKeys);

    return () => {
      window.removeEventListener('keyup', handleKeys);
    };
  }, [handleKeys]);

  const handleClickOverlay = useCallback(() => {
    setIsPopoverOpen(false)
  }, [setIsPopoverOpen]);

  const popoverStyle = {
    opacity: '0',
    overflow: 'visibility',
    zIndex: '2',
    border: '1px solid #e7eaec',
    borderRadius: '4px',
  }

  return (
    <Popover
      isOpen={isPopoverOpen}
      position={'bottom'}
      onClickOutside={handleClickOverlay}
      align="start"
      transitionDuration={0}
      containerStyle={popoverStyle}
      content={(
        <SketchPicker
          color={color}
          onChangeComplete={onChangeComplete}
          width="210px"
        />
      )}
    >
      <div onClick={() => setIsPopoverOpen(!isPopoverOpen)} className={cn(styles.colorPickerContainer)}>
        <div className={cn(styles.backgroundEmpty)} />
        <div
          className={cn(styles.colorPickerColor)}
          style={{ backgroundColor: color }}
        />
      </div>
    </Popover >
  );
});
