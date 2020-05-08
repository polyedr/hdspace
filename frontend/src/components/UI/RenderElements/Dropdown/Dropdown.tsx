import React from 'react';
import cn from 'classnames';
import { makeStyles, MenuItem, Button, Menu, Paper, MenuList } from '@material-ui/core';

import { convertPropCSS } from '$utils/StyleHelper';
import { DropdownItemChild, DropdownMenuChild } from '$domain/libraryElements';
import { sharedClasses } from '$styles/sharedClasses';

import { DropdownRendererProps } from '../types';
const styles = require('../styles.scss');

const DropdownComponent = (props: DropdownRendererProps) => {
  const { id, style, isDisabled, activeItemId, active, sortableId, params, childrenElements } = props;
  const { backgroundColor, color, ...restStyles } = style;
  const { textContent, showRipple, isOpen } = params;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePaperClick = (event: React.MouseEvent<HTMLDivElement>) => {
    (event.target as HTMLElement).focus();
  };

  const handleMenuItemClick = (event: React.MouseEvent<HTMLLIElement>) => {
    (event.target as HTMLElement).focus();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menu = childrenElements.find(child => child.struct_type === 'dropdownMenu') as unknown as DropdownMenuChild;;
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

  const EditableMenuClasses = makeStyles({
    root: {
      position: 'absolute',
      top: '16px',
      left: '16px',
      overflow: 'hidden',
      zIndex: 1,
      ...(menuStyles && convertPropCSS(menuStyles)),
    },
  })();

  const menuItemClasses = makeStyles({
    root: {
      ...(menuItemStyles && convertPropCSS(menuItemStyles)),
      '&:hover': {
        backgroundColor: isDisabled ? menuItemStyles?.['background-color'] : 'rgba(0, 0, 0, 0.04)',
      },
    },
  })();

  return isDisabled ? (
    <>
      <div
        id={id}
        data-ls-id={id}
        data-id={sortableId}
        key={id}
        style={{ position: 'relative', display: 'inline-block' }}
        className={cn(sharedClasses.lsItem, styles.disabled, active && sharedClasses.activated)}
      >
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          id={id}
          data-ls-id={id}
          data-id={sortableId}
          key={id}
          variant="contained"
          color="primary"
          className={classes.root}
          disableRipple
        >
          {textContent}
        </Button>
        {isOpen && (
          <Paper
            id={`${menu?.id}e`}
            data-ls-id={`${menu?.id}e`}
            tabIndex={0}
            key={menu?.id}
            className={cn(
              sharedClasses.lsItem,
              sharedClasses.unsortable,
              styles.addedElem,
              EditableMenuClasses.root,
              parseInt(activeItemId) === menu?.id && sharedClasses.activated
            )}
            elevation={8}
            onClick={handlePaperClick}
          >
            <MenuList>
              {menuItems?.map(({ id: itemID, parameters: { textContent: itemTextContent } }) => (
                <MenuItem
                  id={`${itemID}e`}
                  data-ls-id={`${itemID}e`}
                  tabIndex={0}
                  key={itemID}
                  className={cn(
                    menuItemClasses.root,
                    sharedClasses.lsItem,
                    sharedClasses.unsortable,
                    styles.addedElem,
                    styles.disabled,
                    parseInt(activeItemId) === itemID && sharedClasses.activated
                  )}
                  disableRipple
                  onClick={handleMenuItemClick}
                >
                  {itemTextContent}
                </MenuItem>
              ))}
            </MenuList>
          </Paper>
        )}
      </div>
    </>
  ) : (
    <>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleMenuButtonClick}
        id={id}
        key={id}
        variant="contained"
        color="primary"
        className={classes.root}
        disableRipple={!showRipple}
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
        className={sharedClasses.lsItem}
      >
        {menuItems?.map(({ id: menuItemID, parameters: { textContent: itemTextContent } }) => (
          <MenuItem
            key={menuItemID}
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
