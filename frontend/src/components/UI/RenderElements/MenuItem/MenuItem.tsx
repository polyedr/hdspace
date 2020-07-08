import React from 'react';
import cn from 'classnames';
import { makeStyles, MenuItem } from '@material-ui/core';

import { sharedClasses } from '$styles/sharedClasses';

import { MenuItemRendererProps } from '../types';
const styles = require('../styles.scss');

const MenuItemComponent = (props: MenuItemRendererProps) => {
  const { id, style, isDisabled, params, className, elementRef } = props;
  const { showRipple, name, value } = params;

  const classes = makeStyles({
    root: {
      ...style,
      '&:hover': {
        backgroundColor: isDisabled ? style.backgroundColor : 'rgba(0, 0, 0, 0.04)',
      },
    },
  })();

  return isDisabled ? (
    <MenuItem
      ref={elementRef}
      id={id}
      data-ls-id={id}
      tabIndex={0}
      key={id}
      className={cn(
        classes.root,
        className,
        sharedClasses.unsortable,
        styles.addedElem,
        styles.disabled,
      )}
      value={value}
      disableRipple
    >
      {name}
    </MenuItem>
  ) : (
    <MenuItem
      key={id}
      className={classes.root}
      value={value}
      disableRipple={!showRipple}
    >
      {name}
    </MenuItem>
  );
};

export { MenuItemComponent as MenuItem };
