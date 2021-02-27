import React from 'react';
import cn from 'classnames';
import { ButtonRendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles('button', {
  root: ({ isDisabled, ownStyles }) => {
    const { color, backgroundColor } = ownStyles || {};
    return {
      textTransform: 'uppercase',
      outline: 0,
      '&:hover, &:active': {
        ...(isDisabled && {
          boxShadow:
            '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
          color,
          backgroundColor,
        }),
      },
    };
  },
});

type Props = ButtonRendererProps;

const Button = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { id, isDisabled, params, className, groupClass } = props;
  const { /* showRipple, */ textContent } = params || {};

  const classes = useStyles(props);
  const eventHandlers = useEventHandlers(props);

  return (
    <button
      type="button"
      ref={(dom) => {
        if (typeof ref === 'function') {
          ref(dom);
        } else if (ref) {
          ref.current = dom;
        }
      }}
      id={id}
      data-ls-id={id}
      key={id}
      className={cn(
        'mdc-button',
        // !isDisabled && showRipple ? 'ripple' : '',
        className,
        classes.root,
        groupClass,
        isDisabled && classes.disabled,
        classes.ownStyles,
      )}
      {...eventHandlers}
      dangerouslySetInnerHTML={{ __html: textContent }}
    />
  );
});

export default Button;
