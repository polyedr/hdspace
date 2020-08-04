import React from 'react';
import cn from 'classnames';
import { makeStyles, MenuItem } from '@material-ui/core';

import { sharedClasses } from '$styles/sharedClasses';

import { DropdownItemRendererProps } from '../types';
const styles = require('../styles.scss');

const getDropdownItemClassStyles = (styles: React.CSSProperties, isDisabled: boolean) => ({
  ...styles,

  '&:hover': {
    backgroundColor: isDisabled ? styles.backgroundColor : 'rgba(0, 0, 0, 0.04)',
  },
});

const getDropdownItemStyles = (
  isDisabled: boolean,
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) => makeStyles({
  root: {},

  entityStyles: {
    ...getDropdownItemClassStyles(entityStyles, isDisabled),
  },

  groupStyles: {
    ...getDropdownItemClassStyles(groupStyles, isDisabled),
  },

  ownStyles: {
    ...getDropdownItemClassStyles(ownStyles, isDisabled),
  },
});

const DropdownItemComponent = (props: DropdownItemRendererProps) => {
  const { id, entityStyles, groupStyles, ownStyles, isDisabled, params, className, elementRef } = props;
  const { showRipple, textContent } = params;

  const classes = getDropdownItemStyles(isDisabled, entityStyles, groupStyles, ownStyles)();

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
        classes.entityStyles,
        classes.groupStyles,
        classes.ownStyles,
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
