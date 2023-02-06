/* eslint-disable */
import React from 'react';
import cn from 'classnames';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

const useStyles = makeComponentStyles('slider', {});

const MaterialSlider = React.forwardRef<HTMLInputElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const { min, max, value, step } = element.parameters;
    const [className, groupClass] = element.styles.classNames;

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <div
        className={classes}
        id={element.id}
        data-ls-id={element.id}
        {...eventHandlers}
      >
        <Box
          className={cn(
            'mdc-text-field__input',
            className,
            groupClass,
            classes.ownStyles,
            isDisabled ? classes.disabled : classes.ownPseudoStyles,
          )}
        >
          <Slider
            defaultValue={value}
            valueLabelDisplay="auto"
            disabled={isDisabled}
            max={max}
            min={min}
            ref={ref}
            step={step}
            aria-label={`${element.name}-${element.id}`}
          />
        </Box>
      </div>
    )
  },
);

export default MaterialSlider;
