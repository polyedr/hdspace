import React from 'react';
import cn from 'classnames';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('slider', {});

const BootstrapSlider = React.forwardRef<HTMLInputElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const { min, max, value, step } = element.parameters;
    const [className, groupClass] = element.styles.classNames;

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <div
        className={classes.ownStyles}
        id={element.id}
        data-ls-id={element.id}
        {...eventHandlers}
      >
        <input
          type="range"
          ref={ref}
          className={cn(
            'form-range',
            className,
            groupClass,
            isDisabled ? classes.disabled : classes.ownPseudoStyles,
          )}
          style={{ width: '100%' }}
          id={element.id}
          defaultValue={value}
          min={min}
          max={max}
          step={step}
        />
      </div>
    );
  },
);

export default BootstrapSlider;
