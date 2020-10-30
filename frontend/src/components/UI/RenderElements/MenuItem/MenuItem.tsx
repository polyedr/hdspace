// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { MenuItem as MaterialMenuItem } from '@material-ui/core';
import { MenuItemRendererProps } from '../types';
import sharedClasses from '../../../../styles/sharedClasses';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles({
  menuItem: ({ isDisabled }) => {
    return !isDisabled ? { '&:hover': 'rgba(0, 0, 0, 0.04)' } : {};
  },
});

const MenuItem: React.FC<MenuItemRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, isDisabled, params, className } = props;
    const { showRipple, name, value } = params;

    const classes = useStyles(props);

    return isDisabled ? (
      <MaterialMenuItem
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(
          className,
          sharedClasses.unsortable,
          classes.menuItem,
          classes.addedElem,
          classes.disabled,
          classes.entityStyles,
          classes.groupStyles,
          classes.ownStyles,
        )}
        value={value}
        disableRipple
      >
        {name}
      </MaterialMenuItem>
    ) : (
      <MaterialMenuItem
        key={id}
        className={cn(
          classes.entityStyles,
          classes.groupStyles,
          classes.ownStyles,
        )}
        value={value}
        disableRipple={!showRipple}
      >
        {name}
      </MaterialMenuItem>
    );
  },
);

export default MenuItem;
