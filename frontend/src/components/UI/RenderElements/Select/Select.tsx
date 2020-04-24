import React, { ChangeEvent } from 'react';
import cn from 'classnames';
import { makeStyles, MenuItem, TextField } from '@material-ui/core';

import { convertPropCSS } from '$utils/StyleHelper';
import { sharedClasses } from '$styles/sharedClasses';

import { Renderer } from '../types';
const styles = require('../styles.scss');

const SelectComponent: Renderer = (props) => {
  const { id, style, isDisabled, active, sortableId, selectValue, onChange, params, childrenElements } = props;
  const { width, height, marginTop, marginRight, marginBottom, marginLeft, borderRadius, ...restStyles } = style;
  const { options, showRipple } = params;

  const menuStyles = childrenElements.find(child => child.struct_type === 'menu')?.styles;
  const menuItemStyles = childrenElements.find(child => child.struct_type === 'menuItem')?.styles;

  const handleSelectChange = (event: ChangeEvent<{ name?: string | undefined; value: any; }>) => {
    onChange(id, event.target.value);
  };

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
    },
  })(); 

  const MenuProps = {
    MenuProps: {
      PaperProps: {
        style: {
          ...(menuStyles && convertPropCSS(menuStyles)),
          ...(menuStyles && { minWidth: menuStyles.width }),
        },
      },
    },
  };

  const inlineStyles = { width, height, marginTop, marginRight, marginBottom, marginLeft };

  const InputProps = {
    classes: classes,
    className: cn(isDisabled && styles.disabled),
  };

  return (
    <TextField
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      variant="outlined"
      style={inlineStyles}
      className={cn(sharedClasses.lsItem, isDisabled && styles.disabled, classes.root)}
      value={selectValue}
      onChange={handleSelectChange}
      InputProps={InputProps}
      SelectProps={MenuProps}
      select
    >
      {options?.map(({ name, value }) => <MenuItem key={value} className={menuItemClasses.root} value={value} disableRipple={!showRipple}>{name}</MenuItem>)}
    </TextField>
  );
};

export { SelectComponent as Select };
