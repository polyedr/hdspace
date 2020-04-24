import React, { ChangeEvent } from 'react';
import cn from 'classnames';
import { makeStyles, TextField } from '@material-ui/core';

import { sharedClasses } from '$styles/sharedClasses';

import { Renderer } from '../types';
const styles = require('../styles.scss');

const Textarea: Renderer = (props) => {
  const { id, style, params, isDisabled, active, sortableId, value, onChange } = props;

  const {
    width,
    height,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    textAlign,
    ...restStyles
  } = style;

  const { placeholder } = params;

  const handleTextareaChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(id, event.target.value);
  };

  const classes = makeStyles({
    root: {
      width,
      height,

      '& fieldset': {
        border: 0,
      },

      '&.hovered $input': {
        outline: isDisabled ? '1px solid #949494' : 'none',
      },
    },

    input: {
      width: '100%',
      height: '100%',
        ...restStyles,
      outline: active ? 'red solid 1px' : 'none',
      outlineOffset: '-1px',
      alignItems: 'flex-start',

      '&:hover': {
        borderColor: 'rgba(0, 0, 0, 0.87)',
      },

      '&.Mui-focused, &.Mui-focused:hover': {
        borderColor: '#1890ff',
        boxShadow: 'inset 0px 0px 0 1px #1890ff',
      },

      '& textarea': {
        width: '100%',
        height: '100%',
        textAlign,
      },

      '&::placeholder': {
        color: style.color,
      },
    },

    focused: {},
  })();

  const inlineStyles = {
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    transition: 'none',
  };

  const InputProps = {
    readOnly: isDisabled,
    className: cn(isDisabled && styles.disabled, classes.input),
  };

  return (
    <TextField
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      multiline
      rows={4}
      placeholder={placeholder}
      variant="outlined"
      className={cn(sharedClasses.lsItem, isDisabled && styles.disabled, classes.root)}
      style={inlineStyles}
      InputProps={InputProps}
      value={value}
      onChange={handleTextareaChange}
    />
  );
};

export { Textarea };
