// @ts-nocheck
import React from 'react';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { ActionRendererProps } from '../types';
import { ActionType, WithActionProps } from '../../../../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles({
  root: ({ isDisabled, entityStyles, groupStyles, ownStyles }) => {
    const { color, backgroundColor } = {
      ...entityStyles,
      ...groupStyles,
      ...ownStyles,
    };
    return {
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

export type ActionRenderer = React.FC<WithActionProps & ActionRendererProps>;

const Action: ActionRenderer = React.forwardRef((props, ref) => {
  const { id, isDisabled, params, actionType, actionLink, className } = props;
  const { showRipple, textContent } = params;

  const classes = useStyles(props);

  const eventHandlers = useEventHandlers(props);

  const components: Record<ActionType, 'a' | 'button' | typeof Link> = {
    'external-link': 'a',
    'internal-link': Link,
    button: 'button',
  };

  const component = components[actionType];

  return (
    <Button
      ref={ref}
      id={id}
      data-ls-id={id}
      key={id}
      variant="contained"
      color="primary"
      className={cn(
        className,
        classes.root,
        classes.entityStyles,
        classes.groupStyles,
        classes.ownStyles,
        isDisabled && classes.disabled,
      )}
      disableRipple={isDisabled || !showRipple}
      component={component}
      {...(actionType === 'external-link' && {
        href: actionLink,
        target: '_blank',
      })}
      {...(actionType === 'internal-link' && { to: actionLink })}
      {...eventHandlers}
    >
      {textContent}
    </Button>
  );
});

export default Action;
