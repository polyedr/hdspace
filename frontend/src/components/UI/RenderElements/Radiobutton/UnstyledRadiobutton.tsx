import React, { useState } from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('radiobutton', {});

const UnstyledRadiobutton = React.forwardRef<HTMLInputElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [className, groupClass] = element.styles.classNames;

    const classes = useStyles(props);
    const [isChecked, setIsChecked] = useState<boolean>(false);

    const eventHandlers = useEventHandlers(props);

    const { value, name, label } = element.parameters;

    return (
      <label
        htmlFor={element.id}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <input
          type="radio"
          ref={ref}
          id={element.id}
          data-ls-id={element.id}
          className={cn(
            className,
            groupClass,
            isDisabled ? classes.disabled : classes.ownPseudoStyles,
            classes.ownStyles,
          )}
          value={value}
          name={name}
          {...eventHandlers}
          checked={!isDisabled && !isChecked}
          onChange={() => {
            if (!isDisabled && isChecked) {
              setIsChecked(!isChecked);
            }
          }}
        />

        {label}
      </label>
    );
  },
);

export default UnstyledRadiobutton;
