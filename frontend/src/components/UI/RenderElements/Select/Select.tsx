import React, { ChangeEvent } from 'react';
import cn from 'classnames';
import { makeStyles, TextField, MenuItem } from '@material-ui/core';

import { convertPropCSS } from '$utils/StyleHelper';

import { SelectRendererProps } from '../types';
const styles = require('../styles.scss');

const SelectComponent = (props: SelectRendererProps) => {
  const {
    id,
    style,
    isDisabled,
    active,
    sortableId,
    currentValue,
    onElementChange,
    params,
    children,
    className,
    elementRef,
    childrenElements,
  } = props;

  const {
    width,
    height,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    borderRadius,
    ...restStyles
  } = style;
  
  const { isOpen } = params;

  const handleSelectChange = (event: ChangeEvent<{ name?: string | undefined; value: any; }>) => {
    onElementChange(id, event.target.value);
  };

  const inlineStyles = { marginTop, marginRight, marginBottom, marginLeft };

  const [menu] = childrenElements;
  const menuItems = menu.children;
  const menuStyles = menu.styles;

  const getMenuItemClasses = (itemStyle: React.CSSProperties) => makeStyles({
    root: {
      ...itemStyle,
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
      },
    },
  })();

  const classes = makeStyles({
    root: {
      height: '100%',

      '& fieldset': {
        border: 0,
      },

      '&$focused $input': {
        borderColor: '#1890ff',
        borderRadius,
        boxShadow: 'inset 0px 0px 0 1px #1890ff'
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

  const wrapperClasses = makeStyles({
    root: {
      '&.hovered $input': {
        outline: '1px solid #949494',
      },
    },
  })();

  const PrototypeMenuProps = {
    MenuProps: {
      PaperProps: {
        style: {
          ...(menuStyles && convertPropCSS(menuStyles.entityStyles)),
          ...(menuStyles && { minWidth: menuStyles.entityStyles.width }),
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
      <div
        key={id}
        style={{
          ...inlineStyles,
          display: 'inline-block',
          verticalAlign: 'top',
        }}
        className={cn(className, wrapperClasses.root)}
        tabIndex={isDisabled ? 0 : -1}
      >
        <TextField
          ref={elementRef}
          id={id}
          data-ls-id={id}
          data-id={sortableId}
          style={{ width, height }}
          variant="outlined"
          className={cn(classes.root, styles.disabled)}
          value={currentValue}
          InputProps={InputProps}
          select
        >
          {menuItems.map(({ id: itemID, parameters: { name, value } }) => (
            <MenuItem key={itemID} value={value}>
              {name}
            </MenuItem>
          ))}
        </TextField>
        {isOpen && children}
      </div>
    </>
  ) : (
    <div
      style={{
        ...inlineStyles,
        position: 'relative',
        display: 'inline-block',
        verticalAlign: 'top',
      }}
    >
      <TextField
        id={id}
        key={id}
        variant="outlined"
        style={{ ...inlineStyles, width, height }}
        className={classes.root}
        value={currentValue}
        onChange={handleSelectChange}
        InputProps={InputProps}
        SelectProps={PrototypeMenuProps}
        select
      >
        {menuItems.map(({ id: itemID, parameters: { name, value, showRipple }, styles }) => (
          <MenuItem key={itemID} value={value} className={getMenuItemClasses(styles).root} disableRipple={!showRipple}>
            {name}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export { SelectComponent as Select };
