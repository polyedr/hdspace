// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeStyles, MenuItem as MaterialMenuItem } from '@material-ui/core';
import { MenuItemRendererProps } from '../types';
import sharedClasses from '../../../../styles/sharedClasses';

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

const MenuItem: React.FC<MenuItemRendererProps> = React.forwardRef(
  (
    { id, entityStyles, groupStyles, ownStyles, isDisabled, params, className },
    ref,
  ) => {
    const { showRipple, name, value } = params;

    const classes = getStyles(
      isDisabled,
      entityStyles,
      groupStyles,
      ownStyles,
    )();

    return isDisabled ? (
      <MaterialMenuItem
        ref={ref}
        id={id}
        data-ls-id={id}
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
