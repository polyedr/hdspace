import React from 'react';
import cn from 'classnames';
import { MenuItem as MaterialMenuItem } from '@material-ui/core';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('menu-item', {
  menuItem: ({ isDisabled }) =>
    !isDisabled ? { '&:hover': 'rgba(0, 0, 0, 0.04)' } : {},
});

const MenuItem = React.forwardRef<HTMLLIElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [className, groupClass] = element.styles.classNames;
    const { showRipple, name, value } = element.parameters;

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return isDisabled ? (
      <MaterialMenuItem
        ref={ref}
        id={element.id}
        data-ls-id={element.id}
        className={cn(
          className,
          classes.menuItem,
          groupClass,
          isDisabled ? classes.disabled : classes.ownPseudoStyles,
          classes.ownStyles,
        )}
        value={value}
        disableRipple
        {...eventHandlers}
      >
        {name}
      </MaterialMenuItem>
    ) : (
      <MaterialMenuItem
        className={cn(className, groupClass, classes.ownStyles)}
        value={value}
        disableRipple={!showRipple}
      >
        {name}
      </MaterialMenuItem>
    );
  },
);

export default MenuItem;
