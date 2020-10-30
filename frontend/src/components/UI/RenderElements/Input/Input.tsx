// @ts-nocheck

import React, { ChangeEvent } from 'react';
import cn from 'classnames';
import TextField from '@material-ui/core/TextField';

import { InputRendererProps } from '../types';
import { makeComponentStyles } from '../styles';

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
  const {
    id,
    params,
    isDisabled,
    currentValue,
    onElementChange,
    className,
  } = props;
  const { type, placeholder } = params;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onElementChange(id, event.target.value);
  };

  const styles = useStyles(props);

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
      onChange={handleInputChange}
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
    />
  );
});

export default Input;
