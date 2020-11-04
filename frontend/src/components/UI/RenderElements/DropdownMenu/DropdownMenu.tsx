// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { Menu, Paper, MenuList } from '@material-ui/core';
import { DropdownMenuRendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles({
  root: {
    position: 'absolute',
    top: '0',
    left: '0',
    overflow: 'hidden',
    zIndex: 1,
  },
});

const DropdownMenu: React.FC<DropdownMenuRendererProps> = React.forwardRef(
  (props, ref) => {
    const {
      id,
      isDisabled,
      children,
      className,
      anchorEl,
      setAnchorEl,
    } = props;

    const styles = useStyles(props);

    const handlePaperClick = (event: React.MouseEvent<HTMLDivElement>) => {
      (event.target as HTMLElement).focus();
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
    };

    return isDisabled ? (
      <div style={{ position: 'relative' }} ref={ref}>
        <Paper
          id={id}
          data-ls-id={id}
          key={id}
          className={cn(
            className,
            styles.addedElem,
            styles.root,
            styles.entityStyles,
            styles.groupStyles,
            styles.ownStyles,
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
        classes={{
          paper: cn(styles.entityStyles, styles.groupStyles, styles.ownStyles),
        }}
      >
        {children}
      </Menu>
    );
  },
);

export default DropdownMenu;
