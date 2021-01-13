// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import TextField from '@material-ui/core/TextField';
import { InputRendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles('input', {
  root: {
    '& fieldset': {
      border: 0,
    },
  },

  input: {
    boxSizing: 'border-box',
    '&:hover': {
      borderColor: 'rgba(0, 0, 0, 0.87)',
    },
  },
});

const Input: React.FC<InputRendererProps> = React.forwardRef((props, ref) => {
  const { id, params, isDisabled, className, groupClass } = props;
  const { type, placeholder, textContent } = params;

  const styles = useStyles(props);
  const eventHandlers = useEventHandlers(props);

  return (
    <TextField
      ref={ref}
      id={id}
      data-ls-id={id}
      key={id}
      variant="outlined"
      className={cn(className, isDisabled && styles.disabled, styles.root)}
      type={type}
      value={textContent}
      InputProps={{
        readOnly: isDisabled,
        classes: {
          input: cn(styles.input, groupClass, styles.ownStyles),
        },
        className: cn(isDisabled && styles.disabled),
      }}
      placeholder={placeholder}
      {...eventHandlers}
    />
  );
});

export default Input;
