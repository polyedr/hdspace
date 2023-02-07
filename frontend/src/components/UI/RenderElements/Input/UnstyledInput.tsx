import React, { memo } from 'react';
import cn from 'classnames';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { makeComponentStyles } from '../styles';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('input', {});

const UnstyledInput = React.forwardRef<HTMLInputElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [className, groupClass] = element.styles.classNames;
    const { type = 'text', placeholder, textContent } = element.parameters;

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <input
        ref={ref}
        id={element.id}
        data-ls-id={element.id}
        className={cn(
          className,
          groupClass,
          classes.ownStyles,
          isDisabled ? classes.disabled : classes.ownPseudoStyles,
        )}
        value={textContent}
        type={type}
        readOnly={isDisabled}
        defaultValue={textContent}
        placeholder={placeholder}
        {...eventHandlers}
      />
    );
  },
);

export default memo(UnstyledInput);
