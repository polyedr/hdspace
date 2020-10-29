// @ts-nocheck

import React, { ChangeEvent } from 'react';
import cn from 'classnames';
import { makeStyles, TextField } from '@material-ui/core';

import { InputRendererProps } from '../types';
import makeElementStyles from '../styles';

const useElementStyles = makeElementStyles();

const useDefaultStyles = makeStyles({
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

  const elementStyles = useElementStyles(props);
  const defaultStyles = useDefaultStyles(props);

  return (
    <TextField
      ref={ref}
      id={id}
      data-ls-id={id}
      key={id}
      variant="outlined"
      className={cn(
        className,
        isDisabled && elementStyles.disabled,
        defaultStyles.root,
      )}
      type={type}
      value={currentValue}
      onChange={handleInputChange}
      InputProps={{
        readOnly: isDisabled,
        classes: {
          input: cn(
            defaultStyles.input,
            elementStyles.entityStyles,
            elementStyles.groupStyles,
            elementStyles.ownStyles,
          ),
        },
        className: cn(isDisabled && elementStyles.disabled),
      }}
      placeholder={placeholder}
    />
  );
});

export default Input;
