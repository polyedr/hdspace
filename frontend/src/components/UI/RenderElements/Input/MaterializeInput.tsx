import React, { memo } from 'react';
import cn from 'classnames';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { makeComponentStyles } from '../styles';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('input', {});

const MaterializeInput = React.forwardRef<HTMLInputElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [className, groupClass] = element.styles.classNames;
    const {
      type = 'text',
      placeholder,
      textContent,
      label,
    } = element.parameters;

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <div className="input-field">
        {label && <label htmlFor={element.id}>{label}</label>}
        <input
          ref={ref}
          id={element.id}
          data-ls-id={element.id}
          className={cn(
            'validate',
            className,
            groupClass,
            classes.ownStyles,
            isDisabled && classes.disabled,
          )}
          type={type}
          readOnly={isDisabled}
          defaultValue={textContent}
          placeholder={placeholder}
          {...eventHandlers}
        />
      </div>
    );
  },
);

export default memo(MaterializeInput);
