// @ts-nocheck
import React from 'react';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { makeStyles, Button } from '@material-ui/core';
import { ActionRendererProps } from '../types';
import { ActionType, WithActionProps } from '../../../../utils/withAction';

const styles = require('../styles.scss');

export type ActionRenderer = React.FC<WithActionProps & ActionRendererProps>;

const getClassStyles = (style: React.CSSProperties) => ({
  ...style,

  '&:hover': {
    backgroundColor: style.backgroundColor,
    color: style.color,
  },

  '&:active': {
    color: style.color,
  },
});

const getStyles = (
  isDisabled: boolean,
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) =>
  makeStyles({
    root: {
      cursor: isDisabled ? 'default' : 'pointer',
      ...(isDisabled && { transition: 'none' }),

      '&:hover': {
        ...(isDisabled && {
          boxShadow:
            '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
        }),
      },

      '&:active': {
        ...(isDisabled && {
          boxShadow:
            '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
        }),
      },
    },

    entityStyles: {
      ...getClassStyles(entityStyles),
    },

    groupStyles: {
      ...getClassStyles(groupStyles),
    },

    ownStyles: {
      ...getClassStyles(ownStyles),
    },
  });

const Action: ActionRenderer = React.forwardRef(
  (
    {
      id,
      isDisabled,
      params,
      onClick,
      actionType,
      actionLink,
      className,
      entityStyles,
      groupStyles,
      ownStyles,
    },
    ref,
  ) => {
    const { showRipple, textContent } = params;

    const classes = getStyles(
      isDisabled,
      entityStyles,
      groupStyles,
      ownStyles,
    )();

    const components: Record<ActionType, 'a' | 'button' | typeof Link> = {
      'external-link': 'a',
      'internal-link': Link,
      button: 'button',
    };

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
          isDisabled && styles.disabled,
        )}
        disableRipple={isDisabled || !showRipple}
        component={components[actionType]}
        {...(actionType === 'external-link' && {
          href: actionLink,
          target: '_blank',
        })}
        {...(actionType === 'internal-link' && { to: actionLink })}
        onClick={onClick}
      >
        {textContent}
      </Button>
    );
  },
);

export default Action;
