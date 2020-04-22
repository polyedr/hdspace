import React, { ChangeEvent } from 'react';
import cn from 'classnames';
import { makeStyles, TextField } from '@material-ui/core';

import { sharedClasses } from '$styles/sharedClasses';

import { Renderer } from '../types';
const styles = require('../styles.scss');

const Input: Renderer = (props) => {
  const { id, style, params, isDisabled, active, sortableId, inputValue, onChange } = props;
  const { width, height, marginTop, marginRight, marginBottom, marginLeft, ...restStyles } = style;
  const { type, placeholder } = params;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(id, event.target.value);
  };

  const classes = makeStyles({
    root: {
      '& fieldset': {
        border: 0,
      },

      '&$focused $input': {
        borderColor: '#1890ff',
        boxShadow: 'inset 0px 0px 0 1px #1890ff',
      },

      '&.hovered $input': {
        outline: isDisabled ? '1px solid #949494' : 'none',
      },
    },

    input: {
      ...restStyles,
      outline: active ? 'red solid 1px' : 'none',
      outlineOffset: '-1px',

      '&:hover': {
        borderColor: style.color,
      },

      '&::placeholder': {
        color: style.color,
      },
    },

    focused: {},
  })();

  const inlineStyles = { width, height, marginTop, marginRight, marginBottom, marginLeft, transition: "none"};
  const InputProps = { readOnly: isDisabled, classes, className: cn(isDisabled && styles.disabled)};

  return (
    <TextField
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      variant="outlined"
      className={cn(sharedClasses.lsItem, isDisabled && styles.disabled, classes.root)}
      style={inlineStyles}
      type={type}
      value={inputValue}
      onChange={handleInputChange}
      InputProps={InputProps}
      placeholder={placeholder}
    />
  );
};

export { Input };
