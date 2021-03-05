// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import TextField from '@material-ui/core/TextField';
import { InputRendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles('input', {
  input: {
    boxSizing: 'border-box',
    '&:hover': {
      borderColor: 'rgba(0, 0, 0, 0.87)',
    },
  },
});

const MUIInput: React.FC<InputRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, params, isDisabled, className, groupClass } = props;
    const { type, placeholder, textContent } = params;

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <TextField
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        variant="outlined"
        className={cn(className, isDisabled && classes.disabled)}
        type={type}
        value={textContent}
        InputProps={{
          readOnly: isDisabled,
          classes: {
            input: cn(classes.input, groupClass, classes.ownStyles),
          },
          className: cn(isDisabled && classes.disabled),
        }}
        placeholder={placeholder}
        {...eventHandlers}
      />
    );
  },
);

export default MUIInput;
