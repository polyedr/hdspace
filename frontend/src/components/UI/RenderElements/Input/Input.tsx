// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import TextField from '@material-ui/core/TextField';
import { InputRendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles({
  root: {
    '& fieldset': {
      border: 0,
    },
    '&$focused $input': {
      borderColor: '#1890ff',
      boxShadow: 'inset 0px 0px 0 1px #1890ff',
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
  const { id, params, isDisabled, currentValue, className } = props;
  const { type, placeholder } = params;

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
      value={currentValue}
      InputProps={{
        readOnly: isDisabled,
        classes: {
          input: cn(
            // styles.input,
            styles.entityStyles,
            styles.groupStyles,
            styles.ownStyles,
          ),
        },
        className: cn(isDisabled && styles.disabled),
      }}
      placeholder={placeholder}
      {...eventHandlers}
    />
  );
});

export default Input;
