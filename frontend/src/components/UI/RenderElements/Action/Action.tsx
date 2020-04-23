import React from 'react';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { makeStyles, Button } from '@material-ui/core';

import { WithActionProps, ActionType } from '$utils/withAction';
import { sharedClasses } from '$styles/sharedClasses';

import { RendererProps } from '../types';
const styles = require('../styles.scss');

type Action = React.FC<WithActionProps & RendererProps>;

export const Action: Action = (props) => {
  const {
    id,
    style,
    active,
    isDisabled,
    params,
    onClick,
    sortableId,
    actionType,
    actionLink,
  } = props;

  const { backgroundColor, color, ...restStyles } = style;
  const { showRipple, textContent } = params;

  const classes = makeStyles({
    root: {
      cursor: isDisabled ? 'default' : 'pointer',
      ...restStyles,
      backgroundColor,
      color,
      ...(isDisabled && { transition: 'none' }),
      '&:hover': {
        backgroundColor,
        color,
        ...(isDisabled && { boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)' }),
      },
      '&:active': {
        color,
        ...(isDisabled && { boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)' }),
      },
    },
  })();

  const components: Record<ActionType, 'a' | 'button' | typeof Link> = {
    'external-link': 'a',
    'internal-link': Link,
    button: 'button',
  }

  return (
    <Button
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      variant="contained"
      color="primary"
      className={cn(classes.root, sharedClasses.lsItem, isDisabled && styles.disabled, active && sharedClasses.activated)}
      disableRipple={isDisabled || !showRipple}
      component={components[actionType]}
      {...actionType === 'external-link' && { href: actionLink, target: '_blank' }}
      {...actionType === 'internal-link' && { to: actionLink }}
      onClick={onClick}
    >
      {textContent}
    </Button>
  );
}