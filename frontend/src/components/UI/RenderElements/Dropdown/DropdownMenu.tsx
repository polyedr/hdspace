import React from 'react';
import cn from 'classnames';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';

const useStyles = makeComponentStyles('dropdown-menu');

const DropdownMenu = React.forwardRef<HTMLUListElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled, children } = props;
    const [className, groupClass] = element.styles.classNames;
    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);
    const clickHandler = eventHandlers.onClick;

    eventHandlers.onClick = (event: React.SyntheticEvent<HTMLElement>) => {
      (event.target as HTMLElement).focus();
      if (clickHandler) {
        clickHandler(event);
      }
    };

    return (
      <ul
        id={element.id}
        data-ls-id={element.id}
        ref={ref}
        className={cn(
          'mdc-list',
          className,
          groupClass,
          isDisabled ? classes.disabled : classes.ownPseudoStyles,
          classes.ownStyles,
        )}
        role="menu"
        aria-hidden="true"
        aria-orientation="vertical"
        tabIndex={-1}
      >
        {children}
      </ul>
    );
  },
);

export default DropdownMenu;
