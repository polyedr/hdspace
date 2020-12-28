// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { DropdownMenuRendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles();

const DropdownMenu: React.FC<DropdownMenuRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, children, isDisabled, className } = props;
    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);
    const clickHandler = eventHandlers.onClick;

    eventHandlers.onClick = (event: React.MouseEvent<HTMLDivElement>) => {
      (event.target as HTMLElement).focus();
      if (clickHandler) {
        clickHandler(event);
      }
    };

    return (
      <ul
        id={id}
        data-ls-id={id}
        ref={ref}
        className={cn(
          'mdc-list',
          className,
          isDisabled && classes.isDisabled,
          classes.entityStyles,
          classes.groupStyles,
          classes.ownStyles,
        )}
        role="menu"
        aria-hidden="true"
        aria-orientation="vertical"
        tabIndex="-1"
      >
        {children}
      </ul>
    );
  },
);

export default DropdownMenu;
