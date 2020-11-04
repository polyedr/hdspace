import React, { useEffect, useCallback, useState, memo } from 'react';
import { SketchPicker, ColorResult } from 'react-color';
import Popover from 'react-tiny-popover';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { createStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      position: 'relative',
      width: 80,
      height: 30,
      borderRadius: theme.shape.borderRadius,
      border: '1px solid grey',
      backgroundColor: (props: any) => props.color,
      cursor: 'pointer',
    },
  }),
);

const popoverStyle = {
  opacity: '0',
  overflow: 'visibility',
  zIndex: '2',
  border: '1px solid #e7eaec',
  borderRadius: '4px',
};

type ColorPickerProps = {
  color: string;
  colors?: string[];
  onChangeComplete(color: Pick<ColorResult, 'hex'>): void;
};

const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChangeComplete,
}) => {
  const classes = useStyles({ color });
  const [startColor, setStartColor] = useState({ hex: color });
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  const handleKeys = useCallback(
    (event) => {
      if (event.keyCode === 27 && isPopoverOpen) {
        setIsPopoverOpen(false);
        onChangeComplete(startColor);
      }
    },
    [startColor, onChangeComplete, isPopoverOpen, setIsPopoverOpen],
  );

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

  const handleOverlayClick = useCallback(() => {
    setIsPopoverOpen(false);
  }, [setIsPopoverOpen]);

  const handleColorPickerContainerClick = useCallback(() => {
    setIsPopoverOpen(!isPopoverOpen);
  }, [setIsPopoverOpen, isPopoverOpen]);

  return (
    <Popover
      isOpen={isPopoverOpen}
      position="bottom"
      onClickOutside={handleOverlayClick}
      align="start"
      transitionDuration={0}
      containerStyle={popoverStyle}
      content={
        <SketchPicker
          color={color}
          onChangeComplete={onChangeComplete}
          width="210px"
        />
      }
    >
      <div
        onClick={handleColorPickerContainerClick}
        className={classes.container}
      />
    </Popover>
  );
};

export default memo(ColorPicker);
