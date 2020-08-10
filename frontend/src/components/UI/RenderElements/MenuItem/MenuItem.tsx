import React from 'react';
import cn from 'classnames';
import { makeStyles, MenuItem } from '@material-ui/core';

import { sharedClasses } from '$styles/sharedClasses';

import { MenuItemRendererProps } from '../types';

const styles = require('../styles.scss');

const getClassStyles = (style: React.CSSProperties, isDisabled: boolean) => ({
  ...style,
  '&:hover': {
    backgroundColor: isDisabled ? style.backgroundColor : 'rgba(0, 0, 0, 0.04)',
  },
});

const getStyles = (
  isDisabled: boolean,
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) =>
  makeStyles({
    entityStyles: {
      ...getClassStyles(entityStyles, isDisabled),
    },

    groupStyles: {
      ...getClassStyles(groupStyles, isDisabled),
    },

    ownStyles: {
      ...getClassStyles(ownStyles, isDisabled),
    },
  });

const MenuItemComponent: React.FC<MenuItemRendererProps> = ({
  id,
  entityStyles,
  groupStyles,
  ownStyles,
  isDisabled,
  params,
  className,
  elementRef,
}) => {
  const { showRipple, name, value } = params;

  const classes = getStyles(isDisabled, entityStyles, groupStyles, ownStyles)();

  return isDisabled ? (
    <MenuItem
      ref={elementRef}
      id={id}
      data-ls-id={id}
      tabIndex={0}
      key={id}
      className={cn(
        className,
        sharedClasses.unsortable,
        styles.addedElem,
        styles.disabled,
        classes.entityStyles,
        classes.groupStyles,
        classes.ownStyles,
      )}
      value={value}
      disableRipple
    >
      {name}
    </MenuItem>
  ) : (
    <MenuItem
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
    </MenuItem>
  );
};

export { MenuItemComponent as MenuItem };
