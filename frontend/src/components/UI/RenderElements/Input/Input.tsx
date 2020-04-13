import React, { useCallback, ChangeEvent } from 'react';
import cn from 'classnames';
import { makeStyles, TextField } from '@material-ui/core';

import { Renderer } from '../types';
const styles = require('../styles.scss');

const Input: Renderer = (props) => {
  const { id, style, params, isDisabled, active, sortableId, savedElement, onChange } = props;
  const { width, height, marginTop, marginRight, marginBottom, marginLeft, ...restStyles } = style;
  const { type, placeholder } = params;

  const defaultValue = savedElement && savedElement.savedValue || '';

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    onChange(id, event.target.value);
  }, [onChange, id]);

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

  return (
    <TextField
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      variant="outlined"
      className={cn("ls-item", isDisabled && styles.disabled, classes.root)}
      style={{
        width,
        height,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        transition: "none",
      }}
      type={type}
      value={defaultValue}
      onChange={handleInputChange}
      InputProps={{
        readOnly: isDisabled,
        classes,
        className: cn(isDisabled && styles.disabled),
      }}
      placeholder={placeholder}
    />
  );
};

export { Input };
