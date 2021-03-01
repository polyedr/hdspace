// @ts-nocheck
import React from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';
import { SharedRendererProps } from '../types';

const useStyles = makeComponentStyles('select-menu');

const SelectMenu: React.FC<SharedRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, children, className, groupClass } = props;
    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);
    return (
      <ul
        id={id}
        data-ls-id={id}
        ref={ref}
        className={cn('mdc-list', className, groupClass, classes.ownStyles)}
        role="listbox"
        aria-label={`menu-${id}-listbox`}
        {...eventHandlers}
      >
        {children}
      </ul>
    );
  },
);

export default SelectMenu;
