import React from 'react';
import useEventHandlers from '@Components/UI/RenderElements/useEventHandlers';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import { InputRendererProps } from '../types';

const useStyles = makeComponentStyles('input', {});

type Props = InputRendererProps;

const Input = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { id, params, isDisabled, className, groupClass } = props;
  const { type, placeholder, textContent } = params;

  const classes = useStyles(props);
  const eventHandlers = useEventHandlers(props);

  return (
    <input
      ref={ref}
      id={id}
      data-ls-id={id}
      className={cn(
        className,
        groupClass,
        classes.ownStyles,
        isDisabled && classes.disabled,
      )}
      type={type}
      readOnly={isDisabled}
      value={textContent}
      placeholder={placeholder}
      {...eventHandlers}
    />
  );
});

export default Input;
