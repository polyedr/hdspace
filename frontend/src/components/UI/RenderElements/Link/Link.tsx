// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MaterialLink } from '@material-ui/core';
import { ActionRendererProps } from '../types';
import { WithActionProps } from '../../../../utils/withAction';
import { makeComponentStyles } from '../styles';

export type LinkRenderer = React.FC<WithActionProps & ActionRendererProps>;

const Link: LinkRenderer = React.forwardRef((props, ref) => {
  const {
    id,
    isDisabled,
    params,
    onClick,
    actionType,
    actionLink,
    className,
  } = props;
  const { textContent } = params;

  const classes = makeComponentStyles(props);

  return (
    <MaterialLink
      ref={ref}
      id={id}
      data-ls-id={id}
      key={id}
      className={cn(
        className,
        isDisabled && classes.disabled,
        classes.entityStyles,
        classes.groupStyles,
        classes.ownStyles,
      )}
      underline={isDisabled ? 'none' : 'hover'}
      onClick={onClick}
      {...(actionType === 'external-link' && {
        href: actionLink,
        target: '_blank',
      })}
      {...(actionType === 'internal-link' && {
        component: RouterLink,
        to: actionLink,
      })}
    >
      {textContent}
    </MaterialLink>
  );
});

export default Link;
