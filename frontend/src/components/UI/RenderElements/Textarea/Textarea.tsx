import React, { useCallback, ChangeEvent } from 'react';
import cn from 'classnames';
import { makeStyles, TextField } from '@material-ui/core';

import { Renderer } from '../types';
const styles = require('../styles.scss');

const Textarea: Renderer = (props) => {
  const { id, style, params, isDisabled, active, sortableId, savedElement, onChange } = props;

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

  const defaultValue = savedElement && savedElement.savedValue || '';

  const handleTextareaChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    onChange(id, event.target.value);
  }, [onChange, id]);

  const classes = makeStyles({
    root: {
      '& fieldset': {
        border: 0,
      },

      '&.hovered $input': {
        outline: isDisabled ? '1px solid #949494' : 'none',
      },
    },

    input: {
      width,
      height,
        ...restStyles,
      outline: active ? 'red solid 1px' : 'none',
      outlineOffset: '-1px',
      alignItems: 'flex-start',

      '&.Mui-focused, &.Mui-focused:hover': {
        borderColor: '#1890ff',
      },

      '& textarea': {
        width,
        height,
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
    transition: "none",
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
      defaultValue={defaultValue}
      placeholder={placeholder}
      variant="outlined"
      className={cn("ls-item", isDisabled && styles.disabled, classes.root)}
      style={inlineStyles}
      InputProps={InputProps}
      value={defaultValue}
      onChange={handleTextareaChange}
    />
  );
};

export { Textarea };
