import React, { ChangeEvent } from 'react';
import cn from 'classnames';
import { makeStyles, MenuItem, TextField, Paper, MenuList } from '@material-ui/core';

import { convertPropCSS } from '$utils/StyleHelper';
import { sharedClasses } from '$styles/sharedClasses';
import { SelectItemChild, SelectMenuChild } from '$domain/libraryElements';

import { SelectRendererProps } from '../types';
const styles = require('../styles.scss');

const SelectComponent = (props: SelectRendererProps) => {
  const { id, style, isDisabled, activeItemId, active, sortableId, value, onChange, params, childrenElements } = props;
  const { width, height, marginTop, marginRight, marginBottom, marginLeft, borderRadius, ...restStyles } = style;
  const { showRipple, isOpen } = params;

  const handleSelectChange = (event: ChangeEvent<{ name?: string | undefined; value: any; }>) => {
    onChange(id, event.target.value);
  };

  const handlePaperClick = (event: React.MouseEvent<HTMLDivElement>) => {
    (event.target as HTMLElement).focus();
  };

  const handleMenuItemClick = (event: React.MouseEvent<HTMLLIElement>) => {
    (event.target as HTMLElement).focus();
  };

  const menu = childrenElements.find(child => child.struct_type === 'selectMenu') as unknown as SelectMenuChild;
  const menuStyles = menu?.styles;
  const menuItems = childrenElements.filter(child => child.struct_type === 'selectItem') as SelectItemChild[];
  const menuItemStyles = childrenElements.find(child => child.struct_type === 'selectItem')?.styles;

  const inlineStyles = { width, height, marginTop, marginRight, marginBottom, marginLeft };

  const classes = makeStyles({
    root: {
      ...inlineStyles,
      height: '100%',

      '& fieldset': {
        border: 0,
      },

      '&$focused $input': {
        borderColor: '#1890ff',
        borderRadius,
        boxShadow: 'inset 0px 0px 0 1px #1890ff'
      },

      '&.hovered $input': {
        outline: isDisabled ? '1px solid #949494' : 'none',
      },
    },

    input: {
      height: '100%',
      boxSizing: 'border-box',
      ...restStyles,
      borderRadius,
      outline: active ? '1px red solid' : 'none',
      outlineOffset: '-1px',

      '&.MuiSelect-outlined.MuiSelect-outlined': {
        paddingRight: `calc(${restStyles.paddingRight} + 18px)`,
      },

      '&:hover': {
        ...(!isDisabled && { borderColor: 'rgba(0, 0, 0, 0.87)' }),
      },

      '&::placeholder': {
        color: style.color,
      },
    },

    focused: {},
  })();

  const menuItemClasses = makeStyles({
    root: {
      ...(menuItemStyles && convertPropCSS(menuItemStyles)),
      '&:hover': {
        backgroundColor: isDisabled ? menuItemStyles?.['background-color'] : 'rgba(0, 0, 0, 0.04)',
      },
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

  const PrototypeMenuProps = {
    MenuProps: {
      PaperProps: {
        style: {
          ...(menuStyles && convertPropCSS(menuStyles)),
          ...(menuStyles && { minWidth: menuStyles.width }),
        },
      },
    },
  };

  const InputProps = {
    classes: classes,
    className: cn(isDisabled && styles.disabled),
  };

  return isDisabled ? (
    <>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <TextField
          id={id}
          data-ls-id={id}
          data-id={sortableId}
          key={id}
          variant="outlined"
          className={cn(sharedClasses.lsItem, styles.disabled, classes.root)}
          value={value}
          InputProps={InputProps}
          select
        >
          {menuItems?.map(({ id: itemID, parameters: { name, value } }) => <MenuItem key={itemID} value={value}>{name}</MenuItem>)}
        </TextField>
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
              {menuItems?.map(({ id: itemID, parameters: { name, value } }) => (
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
                  value={value}
                  disableRipple={isDisabled || !showRipple}
                  onClick={handleMenuItemClick}
                >
                  {name}
                </MenuItem>
              ))}
            </MenuList>
          </Paper>
        )}
      </div>
    </>
  ) : (
    <TextField
      id={id}
      key={id}
      variant="outlined"
      style={inlineStyles}
      className={classes.root}
      value={value}
      onChange={handleSelectChange}
      InputProps={InputProps}
      SelectProps={PrototypeMenuProps}
      select
    >
      {menuItems?.map(({ parameters: { name, value } }) => (
        <MenuItem
          key={value}
          className={menuItemClasses.root}
          value={value}
          disableRipple={!showRipple}
        >
          {name}
        </MenuItem>
      ))}
    </TextField>
  );
};

export { SelectComponent as Select };
