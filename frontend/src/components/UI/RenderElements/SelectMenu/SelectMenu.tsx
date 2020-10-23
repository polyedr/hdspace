// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeStyles, Paper, MenuList } from '@material-ui/core';
import { SelectMenuRendererProps } from '../types';
import sharedClasses from '../../../../styles/sharedClasses';

const styles = require('../styles.scss');

const getStyles = (
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) =>
  makeStyles({
    root: {
      position: 'absolute',
      top: '0',
      left: '0',
      overflow: 'hidden',
      zIndex: 1,
    },

    entityStyles: {
      ...entityStyles,
    },

    groupStyles: {
      ...groupStyles,
    },

    ownStyles: {
      ...ownStyles,
    },
  });

const SelectMenu: React.FC<SelectMenuRendererProps> = React.forwardRef(
  (
    {
      id,
      entityStyles,
      groupStyles,
      ownStyles,
      isDisabled,
      children,
      className,
    },
    ref,
  ) => {
    const handlePaperClick = (event: React.MouseEvent<HTMLDivElement>) => {
      (event.target as HTMLElement).focus();
    };

    const classes = getStyles(entityStyles, groupStyles, ownStyles)();

    return isDisabled ? (
      <div style={{ position: 'relative' }}>
        <Paper
          ref={ref}
          id={id}
          data-ls-id={id}
          key={id}
          className={cn(
            className,
            sharedClasses.unsortable,
            styles.addedElem,
            classes.root,
            classes.entityStyles,
            classes.groupStyles,
            classes.ownStyles,
          )}
          elevation={8}
          onClick={handlePaperClick}
        >
          <MenuList>{children}</MenuList>
        </Paper>
      </div>
    ) : (
      <>{children}</>
    );
  },
);

export default SelectMenu;
