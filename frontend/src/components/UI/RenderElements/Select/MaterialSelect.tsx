import React from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('select', {});

const MaterialSelect = React.forwardRef<HTMLSelectElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled, children } = props;
    const [className, groupClass] = element.styles.classNames;

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <div className="input-field col s12">
        <select
          ref={ref}
          id={element.id}
          data-ls-id={element.id}
          className={cn(
            className,
            groupClass,
            classes.ownStyles,
            isDisabled && classes.disabled,
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

export default MaterialSelect;
