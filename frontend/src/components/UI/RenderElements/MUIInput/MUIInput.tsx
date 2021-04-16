import React from 'react';
import cn from 'classnames';
import TextField from '@material-ui/core/TextField';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('input', {
  input: {
    boxSizing: 'border-box',
    '&:hover': {
      borderColor: 'rgba(0, 0, 0, 0.87)',
    },
  },
});

const MUIInput = React.forwardRef<HTMLInputElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [className, groupClass] = element.styles.classNames;
    const { type, placeholder, textContent } = element.parameters;

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <TextField
        ref={ref}
        id={element.id}
        data-ls-id={element.id}
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
