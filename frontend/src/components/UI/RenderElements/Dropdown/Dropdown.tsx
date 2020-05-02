import React from 'react';
import cn from 'classnames';
import { makeStyles, MenuItem, Button, Menu } from '@material-ui/core';

import { convertPropCSS } from '$utils/StyleHelper';
import { DropdownItemChild } from '$domain/libraryElements';

import { DropdownRendererProps } from '../types';
const styles = require('../styles.scss');

const DropdownComponent = (props: DropdownRendererProps) => {
  const { id, style, isDisabled, active, sortableId, params, childrenElements } = props;
  const { backgroundColor, color, ...restStyles } = style;
  const { textContent, showRipple } = params;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menu = childrenElements.find(child => child.struct_type === 'dropdownMenu');
  const menuStyles = menu?.styles;
  const menuItems = childrenElements.filter(child => child.struct_type === 'dropdownItem') as DropdownItemChild[];
  const menuItemStyles = childrenElements.find(child => child.struct_type === 'dropdownItem')?.styles;

  const classes = makeStyles({
    root: {
      cursor: isDisabled ? 'default' : 'pointer',
      ...restStyles,
      backgroundColor,
      color,
      ...(isDisabled && { transition: 'none' }),
      '&:hover': {
        backgroundColor,
        color,
        ...(isDisabled && { boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)' }),
      },
      '&:active': {
        color,
        ...(isDisabled && { boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)' }),
      },
    },
  })();

  const menuClasses = makeStyles({
    paper: {
      ...(menuStyles && convertPropCSS(menuStyles)),
    },
  })();

  const menuItemClasses = makeStyles({
    root: {
      ...(menuItemStyles && convertPropCSS(menuItemStyles)),
    },
  })();

  return (
    <>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        {...!isDisabled && { onClick: handleMenuButtonClick }}
        id={id}
        data-ls-id={id}
        data-id={sortableId}
        key={id}
        variant="contained"
        color="primary"
        className={cn(classes.root, 'ls-item', isDisabled && styles.disabled, active && 'activated')}
        disableRipple={isDisabled || !showRipple}
      >
        {textContent}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        classes={menuClasses}
      >
        {menuItems?.map(({ id, parameters: { textContent: itemTextContent } }) => (
          <MenuItem
            key={id}
            className={menuItemClasses.root}
            disableRipple={!showRipple}
            onClick={handleMenuClose}
          >
            {itemTextContent}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export { DropdownComponent as Dropdown };
