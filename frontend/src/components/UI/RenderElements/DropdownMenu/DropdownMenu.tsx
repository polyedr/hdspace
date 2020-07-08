import React from 'react';
import cn from 'classnames';
import { makeStyles, Menu, Paper, MenuList } from '@material-ui/core';

import { sharedClasses } from '$styles/sharedClasses';

import { DropdownMenuRendererProps } from '../types';
const styles = require('../styles.scss');

const DropdownMenuComponent = (props: DropdownMenuRendererProps) => {
  const { id, style, isDisabled, children, elementRef, className, anchorEl, setAnchorEl } = props;

  const handlePaperClick = (event: React.MouseEvent<HTMLDivElement>) => {
    (event.target as HTMLElement).focus();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const classes = makeStyles({
    paper: {
      ...style,
    },
  })();

  const EditableMenuClasses = makeStyles({
    root: {
      position: 'absolute',
      top: '0',
      left: '0',
      overflow: 'hidden',
      zIndex: 1,
      ...style,
    },
  })();

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
          EditableMenuClasses.root
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
        classes={classes}
      >
        {children}
      </Menu>
  );
};

export { DropdownMenuComponent as DropdownMenu };
