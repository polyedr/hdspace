import React from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('select-menu');

const SelectMenu = React.forwardRef<HTMLDivElement, RendererProps>(
  (props, ref) => {
    const { element, children } = props;
    const [className, groupClass] = element.styles.classNames;
    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);
    return (
      <ul
        id={element.id}
        data-ls-id={element.id}
        ref={ref}
        className={cn('mdc-list', className, groupClass, classes.ownStyles)}
        role="listbox"
        aria-label={`menu-${element.id}-listbox`}
        {...eventHandlers}
      >
        {children}
      </ul>
    );
  },
);

export default SelectMenu;
