import React from 'react';
import cn from 'classnames';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('textarea', {});

const BootstrapTextarea = React.forwardRef<HTMLTextAreaElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const { placeholder, textContent, label } = element.parameters;
    const [className, groupClass] = element.styles.classNames;

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <div className="form-group">
        {label?.length && <label htmlFor={element.id}>{label}</label>}
        <textarea
          ref={ref}
          id={element.id}
          data-ls-id={element.id}
          rows={4}
          readOnly={isDisabled}
          placeholder={placeholder}
          className={cn(
            'form-control',
            className,
            groupClass,
            classes.ownStyles,
            isDisabled ? classes.disabled : classes.ownPseudoStyles,
          )}
          defaultValue={textContent}
          {...eventHandlers}
          style={{ resize: 'none' }}
        />
      </div>
    );
  },
);

export default BootstrapTextarea;
