// @ts-nocheck
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { ActionType, WithActionProps } from '@Src/types';
import { MDCRipple } from '@material/ripple';

import { ActionRendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const components: Record<ActionType, 'a' | 'button' | typeof Link> = {
  'external-link': 'a',
  'internal-link': Link,
  button: 'button',
};

const useStyles = makeComponentStyles({
  root: ({ isDisabled, entityStyles, groupStyles, ownStyles, type }) => {
    const { color, backgroundColor } = {
      ...entityStyles,
      ...groupStyles,
      ...ownStyles,
    };
    return {
      color,
      backgroundColor,
      textDecoration: type === 'button' ? 'none' : 'underline',

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
  label: {
    textDecoration: 'none',
    textTransform: 'uppercase',
  },
});

type Props = WithActionProps &
  ActionRendererProps & {
    type: string;
  };

export type ActionRenderer = React.FC<Props>;

const Action: ActionRenderer = React.forwardRef((props, ref) => {
  const { id, isDisabled, params, actionType, actionLink, className } = props;
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

  const Component = components[actionType];

  return (
    <Component
      ref={ref}
      id={id}
      data-ls-id={id}
      key={id}
      data-show-ripple={showRipple}
      className={cn(
        className,
        classes.root,
        classes.entityStyles,
        classes.groupStyles,
        classes.ownStyles,
        isDisabled && classes.disabled,
        'mdc-button',
      )}
      {...(actionType === 'external-link' && {
        href: actionLink,
        target: '_blank',
      })}
      {...(actionType === 'internal-link' && { to: actionLink })}
      {...eventHandlers}
    >
      <span className={classes.label}>{textContent}</span>
      <mat-ripple />
    </Component>
  );
});

export default Action;
