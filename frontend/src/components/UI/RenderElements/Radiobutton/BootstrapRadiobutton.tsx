import React, { useState } from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('radiobutton', {});

const BootstrapRadiobutton = React.forwardRef<HTMLInputElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [className, groupClass] = element.styles.classNames;
    const { label } = element.parameters;

    const classes = useStyles(props);
    const [isChecked, setIsChecked] = useState<boolean>(false);

    const eventHandlers = useEventHandlers(props);

    return (
      <div
        ref={ref}
        {...eventHandlers}
        className={cn(
          'form-check',
          className,
          groupClass,
          isDisabled ? classes.disabled : classes.ownPseudoStyles,
          classes.ownStyles,
        )}
      >
        <input
          type="radio"
          id={element.id}
          data-ls-id={element.id}
          className={cn('form-check-input')}
          checked={!isDisabled && !isChecked}
          onChange={() => {
            if (!isDisabled && isChecked) {
              setIsChecked(!isChecked);
            }
          }}
        />
        <label
          htmlFor={element.id}
          className="form-check-label"
          dangerouslySetInnerHTML={{ __html: label || '' }}
        />
      </div>
    );
  },
);

export default BootstrapRadiobutton;
