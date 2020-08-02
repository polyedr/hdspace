import React from 'react';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { makeStyles, Button } from '@material-ui/core';

import { WithActionProps, ActionType } from '$utils/withAction';

import { ActionRendererProps } from '../types';
const styles = require('../styles.scss');

export type ActionRenderer = React.FC<WithActionProps & ActionRendererProps>;

export const Action: ActionRenderer = (props) => {
  const {
    id,
    isDisabled,
    params,
    onClick,
    sortableId,
    actionType,
    actionLink,
    elementRef,
    className,
    entityStyles,
    groupStyles,
    ownStyles,
  } = props;

  const { showRipple, textContent } = params;

  const classes = makeStyles({
    root: {
      cursor: isDisabled ? 'default' : 'pointer',
      ...(isDisabled && { transition: 'none' }),
      '&:hover': {
        ...(isDisabled && { boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)' }),
      },
      '&:active': {
        ...(isDisabled && { boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)' }),
      },

      '&$entityStyles': {
        ...entityStyles,

        '&:hover': {
          backgroundColor: entityStyles.backgroundColor,
          color: entityStyles.color,
        },

        '&:active': {
          color: entityStyles.color,
        },
      },

      '&$entityStyles$groupStyles': {
        ...groupStyles,

        '&:hover': {
          backgroundColor: groupStyles.backgroundColor,
          color: groupStyles.color,
        },

        '&:active': {
          color: groupStyles.color,
        },
      },

      '&$entityStyles$groupStyles$ownStyles': {
        ...ownStyles,

        '&:hover': {
          backgroundColor: ownStyles.backgroundColor,
          color: ownStyles.color,
        },

        '&:active': {
          color: ownStyles.color,
        },
      },
    },

    entityStyles: {},
    groupStyles: {},
    ownStyles: {},
  })();

  const components: Record<ActionType, 'a' | 'button' | typeof Link> = {
    'external-link': 'a',
    'internal-link': Link,
    button: 'button',
  }

  return (
    <Button
      ref={elementRef}
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      variant="contained"
      color="primary"
      className={cn(
        className,
        classes.root,
        classes.entityStyles,
        classes.groupStyles,
        classes.ownStyles,
        isDisabled && styles.disabled
      )}
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