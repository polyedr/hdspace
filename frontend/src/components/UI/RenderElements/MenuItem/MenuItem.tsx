// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { MenuItem as MaterialMenuItem } from '@material-ui/core';
import { MenuItemRendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles({
  menuItem: ({ isDisabled }) => {
    return !isDisabled ? { '&:hover': 'rgba(0, 0, 0, 0.04)' } : {};
  },
});

const MenuItem: React.FC<MenuItemRendererProps> = React.forwardRef(
  (props, ref) => {
    const {
      id,
      isDisabled,
      params,
      className,
      entityClass,
      groupClass,
    } = props;
    const { showRipple, name, value } = params;

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return isDisabled ? (
      <MaterialMenuItem
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(
          className,
          classes.menuItem,
          entityClass,
          groupClass,
          classes.addedElem,
          classes.disabled,
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
        key={id}
        className={cn(entityClass, groupClass, classes.ownStyles)}
        value={value}
        disableRipple={!showRipple}
      >
        {name}
      </MaterialMenuItem>
    );
  },
);

export default MenuItem;
