import React from 'react';
import cn from 'classnames';
import { makeStyles, MenuItem } from '@material-ui/core';

import sharedClasses from '$styles/sharedClasses';

import { DropdownItemRendererProps } from '../types';

const styles = require('../styles.scss');

const getDropdownItemClassStyles = (
  style: React.CSSProperties,
  isDisabled: boolean,
) => ({
  ...style,

  '&:hover': {
    backgroundColor: isDisabled ? style.backgroundColor : 'rgba(0, 0, 0, 0.04)',
  },
});

const getDropdownItemStyles = (
  isDisabled: boolean,
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) =>
  makeStyles({
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

const DropdownItem: React.FC<DropdownItemRendererProps> = ({
  id,
  entityStyles,
  groupStyles,
  ownStyles,
  isDisabled,
  params,
  className,
  elementRef,
}) => {
  const { showRipple, textContent } = params;

  const classes = getDropdownItemStyles(
    isDisabled,
    entityStyles,
    groupStyles,
    ownStyles,
  )();

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
      className={cn(
        classes.root,
        classes.entityStyles,
        classes.groupStyles,
        classes.ownStyles,
      )}
      disableRipple={!showRipple}
    >
      {textContent}
    </MenuItem>
  );
};

export default DropdownItem;
