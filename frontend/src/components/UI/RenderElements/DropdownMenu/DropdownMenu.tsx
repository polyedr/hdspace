import React from 'react';
import cn from 'classnames';
import { makeStyles, Menu, Paper, MenuList } from '@material-ui/core';

import { sharedClasses } from '$styles/sharedClasses';

import { DropdownMenuRendererProps } from '../types';
const styles = require('../styles.scss');

const getDropdownMenuStyles = (
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) => makeStyles({
  root: {},

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

const getEditableMenuStyles = (
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) => makeStyles({
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

const DropdownMenuComponent = (props: DropdownMenuRendererProps) => {
  const {
    id,
    entityStyles,
    groupStyles,
    ownStyles,
    isDisabled,
    children,
    elementRef,
    className,
    anchorEl,
    setAnchorEl,
  } = props;

  const handlePaperClick = (event: React.MouseEvent<HTMLDivElement>) => {
    (event.target as HTMLElement).focus();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const dropdownMenuClasses = getDropdownMenuStyles(entityStyles, groupStyles, ownStyles)();

  const editableMenuClasses = getEditableMenuStyles(entityStyles, groupStyles, ownStyles)();

  return isDisabled ? (
    <div style={{ position: 'relative' }}>
      <Paper
        ref={elementRef}
        id={id}
        data-ls-id={id}
        tabIndex={0}
        key={id}
        className={cn(
          className,
          sharedClasses.unsortable,
          styles.addedElem,
          editableMenuClasses.root,
          editableMenuClasses.entityStyles,
          editableMenuClasses.groupStyles,
          editableMenuClasses.ownStyles,
        )}
        elevation={8}
        onClick={handlePaperClick}
      >
        <MenuList>{children}</MenuList>
      </Paper>
    </div>
  ) : (
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        classes={{ paper: cn(
          dropdownMenuClasses.root,
          dropdownMenuClasses.entityStyles,
          dropdownMenuClasses.groupStyles,
          dropdownMenuClasses.ownStyles,
        )}}
      >
        {children}
      </Menu>
  );
};

export { DropdownMenuComponent as DropdownMenu };
