// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeStyles, MenuItem } from '@material-ui/core';
import { DropdownItemRendererProps } from '../types';
import sharedClasses from '../../../../styles/sharedClasses';

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

const DropdownItem: React.FC<DropdownItemRendererProps> = React.forwardRef(
  (
    { id, entityStyles, groupStyles, ownStyles, isDisabled, params, className },
    ref,
  ) => {
    const { showRipple, textContent } = params;

    const classes = getDropdownItemStyles(
      isDisabled,
      entityStyles,
      groupStyles,
      ownStyles,
    )();

    return isDisabled ? (
      <MenuItem
        ref={ref}
        id={id}
        data-ls-id={id}
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
  },
);

export default DropdownItem;
