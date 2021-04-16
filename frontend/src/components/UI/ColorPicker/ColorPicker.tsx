import React, { useEffect, useCallback, useState, memo } from 'react';
import { SketchPicker, ColorResult } from 'react-color';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Popover } from '@material-ui/core';
import transparentBg from '../../../assets/sprites/background_empty.png';

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
    transparent: {
      borderRadius: theme.shape.borderRadius,
      background: `white url(${transparentBg})`,
    },
  }),
);

type ColorPickerProps = {
  color: string;
  colors?: string[];
  onChangeComplete(color: Pick<ColorResult, 'hex'>): void;
  disabled?: boolean;
};

const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChangeComplete,
  disabled,
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

  const handleColorPickerContainerClick = useCallback(() => {
    if (disabled) {
      return;
    }
    setIsPopoverOpen(!isPopoverOpen);
  }, [disabled, isPopoverOpen]);

  return (
    <PopupState variant="popover" popupId="demo-popup-popover">
      {(popupState) => (
        <div>
          <div className={classes.transparent} {...bindTrigger(popupState)}>
            <div
              onClick={handleColorPickerContainerClick}
              className={classes.container}
            />
          </div>
          <Popover
            {...bindPopover(popupState)}
            open={isPopoverOpen}
            onClose={handleColorPickerContainerClick}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <SketchPicker
              color={color}
              onChange={onChangeComplete}
              width="210px"
              presetColors={['transparent']}
            />
          </Popover>
        </div>
      )}
    </PopupState>
  );
};

export default memo(ColorPicker);
