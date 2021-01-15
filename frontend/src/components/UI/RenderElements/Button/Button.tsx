// @ts-nocheck
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { WithActionProps } from '@Src/types';
import { MDCRipple } from '@material/ripple';

import { ActionRendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles('button', {
  button: ({ isDisabled, ownStyles }) => {
    const { color, backgroundColor } = ownStyles;
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

type Props = WithActionProps &
  ActionRendererProps & {
    type: string;
  };

const Button: React.FC<Props> = React.forwardRef((props, ref) => {
  const { id, isDisabled, params, className, groupClass } = props;
  const { showRipple, textContent } = params;

  const [ripple, setRipple] = useState<MDCRipple | null>(null);

  useEffect(() => {
    if (!ripple) {
      return;
    }
    if (showRipple) {
      ripple.activate();
    } else {
      ripple.deactivate();
    }
  }, [ripple, showRipple]);

  const dom = !ref ? null : ref.current;

  useEffect(() => {
    if (!dom) {
      return;
    }
    setRipple(new MDCRipple(dom));
  }, [dom]);

  const classes = useStyles(props);
  const eventHandlers = useEventHandlers(props);

  return (
    <button
      type="button"
      ref={ref}
      id={id}
      data-ls-id={id}
      key={id}
      data-show-ripple={showRipple}
      className={cn(
        'mdc-button',
        className,
        classes.button,
        groupClass,
        isDisabled && classes.disabled,
        classes.ownStyles,
      )}
      {...eventHandlers}
    >
      {textContent}
      <mat-ripple />
    </button>
  );
});

export default Button;
