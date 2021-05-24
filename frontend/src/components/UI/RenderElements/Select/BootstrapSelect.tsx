import React from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('select', {});

const BootstrapSelect = React.forwardRef<HTMLSelectElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled, children } = props;
    const [className, groupClass] = element.styles.classNames;
    const { label } = element.parameters;

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <div className="form-group">
        {label && <label htmlFor={element.id}>{label}</label>}
        <select
          ref={ref}
          id={element.id}
          data-ls-id={element.id}
          className={cn(
            'form-control',
            className,
            groupClass,
            classes.ownStyles,
            isDisabled ? classes.disabled : classes.ownPseudoStyles,
          )}
          {...eventHandlers}
          {...(isDisabled && {
            onMouseDown: (ev) => {
              ev.preventDefault();
            },
          })}
        >
          {children}
        </select>
      </div>
    );
  },
);

export default BootstrapSelect;
