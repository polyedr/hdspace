import React, { useState } from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('radiobutton', {});

const MaterializeRadiobutton = React.forwardRef<
  HTMLLabelElement,
  RendererProps
>((props, ref) => {
  const { element, isDisabled } = props;
  const [className, groupClass] = element.styles.classNames;
  const { label } = element.parameters;

  const classes = useStyles(props);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const eventHandlers = useEventHandlers(props);

  return (
    <label
      ref={ref}
      {...eventHandlers}
      className={cn(
        className,
        groupClass,
        isDisabled && classes.disabled,
        classes.ownStyles,
      )}
    >
      <input
        type="radio"
        id={element.id}
        data-ls-id={element.id}
        checked={!isDisabled && !isChecked}
        className="with-gap"
        onChange={() => {
          if (!isDisabled && isChecked) {
            setIsChecked(!isChecked);
          }
        }}
      />
      <span>{label || ''}</span>
    </label>
  );
});

export default MaterializeRadiobutton;
