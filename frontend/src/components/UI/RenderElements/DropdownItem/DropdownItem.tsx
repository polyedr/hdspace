import React from 'react';
import cn from 'classnames';
import { makeStyles, MenuItem } from '@material-ui/core';

import { sharedClasses } from '$styles/sharedClasses';

import { DropdownItemRendererProps } from '../types';
const styles = require('../styles.scss');

const DropdownItemComponent = (props: DropdownItemRendererProps) => {
  const { id, style, isDisabled, params, className, elementRef } = props;
  const { showRipple, textContent } = params;

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
      disableRipple
    >
      {textContent}
    </MenuItem>
  ) : (
    <MenuItem
      key={id}
      className={classes.root}
      disableRipple={!showRipple}
    >
      {textContent}
    </MenuItem>
  );
};

export { DropdownItemComponent as DropdownItem };
