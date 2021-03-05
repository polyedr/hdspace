import React from 'react';
import cn from 'classnames';
import { SelectRendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

type Props = SelectRendererProps;

const useStyles = makeComponentStyles('select', {});

const Select = React.forwardRef<HTMLSelectElement, Props>((props, ref) => {
  const { id, isDisabled, className, children, groupClass } = props;

  const classes = useStyles(props);
  const eventHandlers = useEventHandlers(props);

  return (
    <select
      ref={ref}
      id={id}
      data-ls-id={id}
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
  );
});

export default Select;
